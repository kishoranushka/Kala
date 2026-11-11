/* POST /api/order — start checkout.
   Body: { works: [id…], customer: { name, email, phone, address, city, state, pin, note }, replaces? }
   Checks the details, prices the paintings from works.json (never trusts the browser), holds them for
   20 minutes so nobody else can buy them mid-payment, saves a pending order and creates the Razorpay order.
   Returns: { orderId, key, razorpayOrderId, amount, currency }
   Errors: { error, fields? } (422), { error, taken? } (409), 429 when too many checkouts are started.
   The Shiprocket order and emails happen only after payment (see _lib/finalize.js). */
import { randomBytes } from 'node:crypto';
import { clean, clientKey, json, readJson } from './_lib/http.js';
import { dbConfigured, getOrder, holdWorks, insertOrder, recentCheckouts, releaseHolds, updateOrder } from './_lib/db.js';
import { createRazorpayOrder, publicKey, razorpayConfigured } from './_lib/razorpay.js';
import { orderableWorks, rupees } from './_lib/shiprocket.js';

const PHONE = /^[6-9]\d{9}$/;
const PIN = /^[1-9]\d{5}$/;
const EMAIL = /^[^\s@"'<>(),;:\\]+@[^\s@"'<>(),;:\\]+\.[^\s@"'<>(),;:\\]+$/;
const HOLD_MINUTES = 20;
const MAX_WORKS = 20;
/* holding paintings blocks other buyers, so one visitor can't start checkouts endlessly */
const LIMIT = { minutes: 15, perVisitor: 8, perEmail: 6 };

/* readable and unguessable: KALA-<time><5 random chars> */
const ALPHABET = '0123456789ABCDEFGHJKLMNPQRSTUVWXYZ';
const newOrderId = () => `KALA-${Date.now().toString(36).toUpperCase()}${[...randomBytes(5)].map((b) => ALPHABET[b % ALPHABET.length]).join('')}`;

export default async function handler(req, res) {
  if (req.method !== 'POST') return json(res, 405, { error: 'Method not allowed' });
  if (!razorpayConfigured() || !dbConfigured()) {
    return json(res, 503, { error: 'Online payment isn’t switched on yet. Please write to me to buy this painting.' });
  }

  let body;
  try {
    body = await readJson(req);
  } catch {
    return json(res, 400, { error: 'Invalid request.' });
  }

  const c = body.customer && typeof body.customer === 'object' ? body.customer : {};
  const client = clientKey(req);
  const customer = {
    name: clean(c.name, 80),
    email: clean(c.email, 120).toLowerCase(),
    phone: clean(c.phone, 20).replace(/\D/g, '').replace(/^(91|0)(?=\d{10}$)/, ''),
    address: clean(c.address, 250),
    city: clean(c.city, 60),
    state: clean(c.state, 60),
    pin: clean(c.pin, 6),
    country: 'India',
    note: clean(c.note, 500),
    ...(client ? { client } : {}), // hashed IP, only for the checkout limit
  };

  const ids = Array.isArray(body.works) ? body.works.slice(0, MAX_WORKS + 1).map((id) => clean(id, 60)) : [];
  if (ids.length > MAX_WORKS) return json(res, 422, { error: `Please order at most ${MAX_WORKS} paintings at once.` });

  let works;
  try {
    works = orderableWorks(ids);
  } catch (err) {
    return json(res, 409, { error: err.message, taken: err.taken || [] });
  }

  const missing = [];
  if (!customer.name) missing.push('name');
  if (!EMAIL.test(customer.email)) missing.push('email');
  if (!PHONE.test(customer.phone)) missing.push('phone');
  if (!customer.address) missing.push('address');
  if (!customer.city) missing.push('city');
  if (!customer.state) missing.push('state');
  if (!PIN.test(customer.pin)) missing.push('pin');
  if (missing.length) return json(res, 422, { error: `Please check: ${missing.join(', ')}.`, fields: missing });

  const orderId = newOrderId();
  const lines = works.map((w) => ({ id: w.id, title: w.title, price: rupees(w.price) }));
  const amount = lines.reduce((s, w) => s + w.price, 0) * 100; // paise; shipping within India is free

  let inserted = false;
  try {
    const [byVisitor, byEmail] = await Promise.all([
      client ? recentCheckouts({ client, minutes: LIMIT.minutes }) : 0,
      recentCheckouts({ email: customer.email, minutes: LIMIT.minutes }),
    ]);
    if (byVisitor >= LIMIT.perVisitor || byEmail >= LIMIT.perEmail) {
      return json(res, 429, { error: 'Too many checkouts were started in a short time. Please wait a few minutes and try again.' }, { 'Retry-After': '600' });
    }

    /* the same buyer starting over (changed their details or cart): let go of their earlier, unpaid checkout */
    const replaces = typeof body.replaces === 'string' ? body.replaces.slice(0, 40) : null;
    if (replaces) {
      const prev = await getOrder(replaces);
      if (prev?.status === 'pending' && prev.customer?.email === customer.email) {
        await releaseHolds(prev.id);
        await updateOrder(prev.id, { status: 'cancelled', problem: `Replaced by ${orderId}` }, { ifStatus: 'pending' });
      }
    }

    await insertOrder({ id: orderId, status: 'pending', works: lines, amount, customer });
    inserted = true;

    const taken = await holdWorks(orderId, lines.map((w) => w.id), HOLD_MINUTES);
    if (taken?.length) {
      await updateOrder(orderId, { status: 'cancelled', problem: `Already held or sold: ${taken.join(', ')}` });
      const titles = lines.filter((w) => taken.includes(w.id)).map((w) => w.title);
      const many = titles.length > 1;
      return json(res, 409, {
        error: `${titles.join(', ')} ${many ? 'have' : 'has'} just been bought, or someone is paying for ${many ? 'them' : 'it'} right now.`,
        taken,
      });
    }

    const rzp = await createRazorpayOrder({
      amount,
      receipt: orderId,
      notes: { kala_order: orderId, works: lines.map((w) => w.title).join(', ').slice(0, 250), customer: customer.name },
    });
    await updateOrder(orderId, { razorpay_order_id: rzp.id });

    return json(res, 200, { orderId, key: publicKey(), razorpayOrderId: rzp.id, amount, currency: 'INR' });
  } catch (err) {
    console.error('[api/order]', err);
    /* never leave paintings held by a checkout that can't be paid */
    if (inserted) {
      await releaseHolds(orderId).catch(() => {});
      await updateOrder(orderId, { status: 'failed', problem: String(err.message).slice(0, 300) }, { ifStatus: 'pending' }).catch(() => {});
    }
    return json(res, 502, { error: 'The payment couldn’t be started. Please try again in a minute.' });
  }
}
