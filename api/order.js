/* POST /api/order — start checkout.
   Body: { works: [id…], customer: { name, email, phone, address, city, state, pin, note } }
   Checks the details, prices the paintings from works.json (never trusts the browser), holds them for
   20 minutes so nobody else can buy them mid-payment, saves a pending order and creates the Razorpay order.
   Returns: { orderId, key, razorpayOrderId, amount, currency }
   The Shiprocket order and emails happen only after payment (see _lib/finalize.js). */
import { clean, json, readJson } from './_lib/http.js';
import { dbConfigured, getOrder, holdWorks, insertOrder, releaseHolds, updateOrder } from './_lib/db.js';
import { createRazorpayOrder, publicKey, razorpayConfigured } from './_lib/razorpay.js';
import { orderableWorks, rupees } from './_lib/shiprocket.js';

const PHONE = /^[6-9]\d{9}$/;
const PIN = /^\d{6}$/;
const HOLD_MINUTES = 20;

/* readable, hard to guess: KALA-<time><random> */
const newOrderId = () => `KALA-${Date.now().toString(36).toUpperCase()}${Math.random().toString(36).slice(2, 5).toUpperCase()}`;

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

  const c = body.customer || {};
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
  };

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

  const orderId = newOrderId();
  const lines = works.map((w) => ({ id: w.id, title: w.title, price: rupees(w.price) }));
  const amount = lines.reduce((s, w) => s + w.price, 0) * 100; // paise; shipping within India is free

  try {
    /* the same buyer starting over (changed their details or cart): let go of their earlier, unpaid checkout */
    if (body.replaces) {
      const prev = await getOrder(String(body.replaces));
      if (prev?.status === 'pending' && prev.customer?.email === customer.email) {
        await releaseHolds(prev.id);
        await updateOrder(prev.id, { status: 'cancelled', problem: `Replaced by ${orderId}` }, { ifStatus: 'pending' });
      }
    }

    await insertOrder({ id: orderId, status: 'pending', works: lines, amount, customer });

    const taken = await holdWorks(orderId, lines.map((w) => w.id), HOLD_MINUTES);
    if (taken?.length) {
      await updateOrder(orderId, { status: 'cancelled', problem: `Already held or sold: ${taken.join(', ')}` });
      const titles = lines.filter((w) => taken.includes(w.id)).map((w) => w.title);
      return json(res, 409, {
        error: `${titles.join(', ')} ${titles.length > 1 ? 'have' : 'has'} just been bought, or someone is paying for ${titles.length > 1 ? 'them' : 'it'} right now. Remove ${titles.length > 1 ? 'them' : 'it'} to continue.`,
        taken,
      });
    }

    let rzp;
    try {
      rzp = await createRazorpayOrder({
        amount,
        receipt: orderId,
        notes: { kala_order: orderId, works: lines.map((w) => w.title).join(', ').slice(0, 250), customer: customer.name },
      });
    } catch (err) {
      await releaseHolds(orderId).catch(() => {});
      await updateOrder(orderId, { status: 'failed', problem: err.message }).catch(() => {});
      throw err;
    }
    await updateOrder(orderId, { razorpay_order_id: rzp.id });

    return json(res, 200, { orderId, key: publicKey(), razorpayOrderId: rzp.id, amount, currency: 'INR' });
  } catch (err) {
    console.error('[api/order]', err);
    return json(res, 502, { error: 'The payment couldn’t be started. Please try again in a minute.' });
  }
}
