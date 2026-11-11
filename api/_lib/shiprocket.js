/* Shiprocket API helpers (server-side only — credentials never reach the browser).
   Env: SHIPROCKET_EMAIL, SHIPROCKET_PASSWORD  (an API user: Shiprocket → Settings → API → Configure → Create an API user)
        SHIPROCKET_PICKUP_LOCATION             (the pickup address nickname, exactly as in Settings → Pickup Addresses)
   Optional: SHIPROCKET_CHANNEL_NAME (default "Kala") or SHIPROCKET_CHANNEL_ID */
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const DATA = require('../../src/data/works.json');

const BASE = 'https://apiv2.shiprocket.in/v1/external';

/* default box for a painting without its own `ship` details (kg, cm) */
export const DEFAULT_BOX = { weight: 1, length: 50, breadth: 40, height: 6 };

export const configured = () => Boolean(process.env.SHIPROCKET_EMAIL && process.env.SHIPROCKET_PASSWORD && process.env.SHIPROCKET_PICKUP_LOCATION);

/* tokens last 10 days; keep one per warm function instance and refresh after 9 */
let cached = { token: null, at: 0 };
async function token(force = false) {
  if (!force && cached.token && Date.now() - cached.at < 9 * 24 * 3600 * 1000) return cached.token;
  const res = await fetch(`${BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: process.env.SHIPROCKET_EMAIL, password: process.env.SHIPROCKET_PASSWORD }),
  });
  const out = await res.json().catch(() => ({}));
  if (!res.ok || !out.token) throw new Error(`Shiprocket login failed: ${out.message || res.status}`);
  cached = { token: out.token, at: Date.now() };
  return out.token;
}

async function call(path, body) {
  for (const retry of [false, true]) {
    const res = await fetch(`${BASE}${path}`, {
      method: body ? 'POST' : 'GET',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${await token(retry)}` },
      ...(body ? { body: JSON.stringify(body) } : {}),
    });
    if (res.status === 401 && !retry) continue;
    const out = await res.json().catch(() => ({}));
    if (!res.ok || out.status_code >= 400) {
      const detail = out.errors ? Object.values(out.errors).flat().join(' ') : out.message;
      throw new Error(`Shiprocket: ${detail || res.status}`);
    }
    return out;
  }
}

/* The sales channel orders are filed under ("Kala", a custom channel in Shiprocket → Channels).
   SHIPROCKET_CHANNEL_ID wins if set; otherwise it's looked up by SHIPROCKET_CHANNEL_NAME (default "Kala").
   If no match, the order still goes in, under Shiprocket's default channel. */
let channelId;
async function channel() {
  if (process.env.SHIPROCKET_CHANNEL_ID) return Number(process.env.SHIPROCKET_CHANNEL_ID);
  if (channelId !== undefined) return channelId;
  const want = (process.env.SHIPROCKET_CHANNEL_NAME || 'Kala').trim().toLowerCase();
  try {
    const out = await call('/channels');
    const list = Array.isArray(out.data) ? out.data : [];
    const hit = list.find((c) => String(c.name ?? '').trim().toLowerCase() === want);
    channelId = hit ? Number(hit.id) : null;
    if (!hit) console.warn(`[shiprocket] no channel named "${want}" (found: ${list.map((c) => c.name).join(', ')})`);
  } catch (err) {
    console.warn('[shiprocket] channel lookup failed:', err.message);
    return null; // try again next time
  }
  return channelId;
}

/* "₹ 12,000" → 12000 */
export const rupees = (price) => Number(String(price ?? '').replace(/[^\d.]/g, '')) || 0;

/* the works a customer may order, priced from our own data (never from the browser) */
export function orderableWorks(ids) {
  const byId = new Map(DATA.works.map((w) => [w.id, w]));
  const works = [...new Set(ids)].map((id) => byId.get(id));
  if (!works.length || works.some((w) => !w)) throw new Error('Unknown painting in the order.');
  const unavailable = works.filter((w) => String(w.status).trim().toLowerCase() !== 'available');
  if (unavailable.length) throw new Error(`No longer available: ${unavailable.map((w) => w.title).join(', ')}.`);
  return works;
}

/* one parcel: the heaviest-sized box, stacked heights, summed weight */
export function parcel(works) {
  const boxes = works.map((w) => ({ ...DEFAULT_BOX, ...(w.ship || {}) }));
  return {
    weight: +boxes.reduce((s, b) => s + Number(b.weight), 0).toFixed(2),
    length: Math.max(...boxes.map((b) => Number(b.length))),
    breadth: Math.max(...boxes.map((b) => Number(b.breadth))),
    height: boxes.reduce((s, b) => s + Number(b.height), 0),
  };
}

export async function createOrder({ orderId, customer, works }) {
  const [first, ...rest] = customer.name.trim().split(/\s+/);
  const subTotal = works.reduce((s, w) => s + rupees(w.price), 0);
  const today = new Date(Date.now() + 5.5 * 3600 * 1000).toISOString().slice(0, 16).replace('T', ' '); // IST
  const channel_id = await channel();
  const out = await call('/orders/create/adhoc', {
    order_id: orderId,
    order_date: today,
    ...(channel_id ? { channel_id } : {}),
    pickup_location: process.env.SHIPROCKET_PICKUP_LOCATION,
    comment: customer.note?.slice(0, 250) || '',
    billing_customer_name: first,
    billing_last_name: rest.join(' '),
    billing_address: customer.address,
    billing_city: customer.city,
    billing_pincode: customer.pin,
    billing_state: customer.state,
    billing_country: customer.country || 'India',
    billing_email: customer.email,
    billing_phone: customer.phone,
    shipping_is_billing: true,
    order_items: works.map((w) => ({ name: w.title, sku: `KALA-${w.id}`, units: 1, selling_price: rupees(w.price) })),
    payment_method: 'Prepaid',
    sub_total: subTotal,
    ...parcel(works),
  });
  return { shiprocketOrderId: out.order_id, shipmentId: out.shipment_id, subTotal };
}
