/* POST /api/order — creates a shipping order in Shiprocket for an order request.
   Body: { works: [id…], customer: { name, email, phone, address, city, state, pin, country, note } }
   Returns: { orderId, shiprocket: { ok, orderId?, error? } }
   The order email (Web3Forms) is sent by the browser afterwards either way, so a Shiprocket hiccup never loses an order. */
import { configured, createOrder, orderableWorks } from './_lib/shiprocket.js';

const PHONE = /^[6-9]\d{9}$/;
const PIN = /^\d{6}$/;

function json(res, status, body) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(body));
}

async function readJson(req) {
  if (req.body && typeof req.body === 'object') return req.body;
  if (typeof req.body === 'string') return JSON.parse(req.body);
  const chunks = [];
  for await (const c of req) chunks.push(c);
  return JSON.parse(Buffer.concat(chunks).toString('utf8') || '{}');
}

const clean = (s, max = 200) => String(s ?? '').trim().slice(0, max);

export default async function handler(req, res) {
  if (req.method !== 'POST') return json(res, 405, { error: 'Method not allowed' });

  let body;
  try {
    body = await readJson(req);
  } catch {
    return json(res, 400, { error: 'Invalid request.' });
  }

  const c = body.customer || {};
  const customer = {
    name: clean(c.name, 80),
    email: clean(c.email, 120),
    phone: clean(c.phone, 20).replace(/\D/g, '').replace(/^(91|0)(?=\d{10}$)/, ''),
    address: clean(c.address, 250),
    city: clean(c.city, 60),
    state: clean(c.state, 60),
    pin: clean(c.pin, 6),
    country: clean(c.country, 40) || 'India',
    note: clean(c.note, 500),
  };
  /* a readable reference shared by the email, Shiprocket and the customer */
  const orderId = `KALA-${Date.now().toString(36).toUpperCase()}`;

  let works;
  try {
    works = orderableWorks(Array.isArray(body.works) ? body.works.map(String) : []);
  } catch (err) {
    return json(res, 409, { error: err.message });
  }

  const missing = [];
  if (!customer.name) missing.push('name');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email)) missing.push('email');
  if (!PHONE.test(customer.phone)) missing.push('phone');
  if (!customer.address) missing.push('address');
  if (!customer.city) missing.push('city');
  if (!customer.state) missing.push('state');
  if (!PIN.test(customer.pin)) missing.push('pin');
  if (missing.length) return json(res, 422, { error: `Check: ${missing.join(', ')}.`, fields: missing });

  if (!/^india$/i.test(customer.country)) return json(res, 200, { orderId, shiprocket: { ok: false, error: 'International order: add it in Shiprocket by hand.' } });
  if (!configured()) return json(res, 200, { orderId, shiprocket: { ok: false, error: 'Shiprocket is not set up yet (missing SHIPROCKET_* settings).' } });

  try {
    const out = await createOrder({ orderId, customer, works });
    return json(res, 200, { orderId, shiprocket: { ok: true, orderId: out.shiprocketOrderId, shipmentId: out.shipmentId } });
  } catch (err) {
    console.error('[api/order]', err);
    return json(res, 200, { orderId, shiprocket: { ok: false, error: err.message } });
  }
}
