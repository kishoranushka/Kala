/* Runs once per order, after Razorpay confirms the payment — from /api/verify (the buyer's browser)
   or /api/razorpay-webhook (Razorpay itself), whichever arrives first.
   pending → paid (only one caller wins), paintings marked sold, Shiprocket order, emails. */
import { createRequire } from 'node:module';
import { getOrder, sellWorks, updateOrder } from './db.js';
import { configured as shiprocketConfigured, createOrder } from './shiprocket.js';
import { artistAlert, customerConfirmation, customerMailConfigured, mailConfigured } from './mail.js';

const require = createRequire(import.meta.url);
const DATA = require('../../src/data/works.json');

export async function finalizeOrder(orderId, paymentId) {
  /* a "cancelled" checkout can still be paid late (e.g. a UPI request approved after the window closed): honour it */
  const before = await getOrder(orderId);
  const claimed = await updateOrder(orderId, { status: 'paid', razorpay_payment_id: paymentId, paid_at: new Date().toISOString() }, { ifStatus: ['pending', 'cancelled', 'failed'] });
  if (!claimed) return getOrder(orderId); // already paid and handled by the other path

  const order = claimed;
  const problems = [];
  if (before && before.status !== 'pending') problems.push(`Payment arrived for a checkout that had been abandoned (${before.problem || before.status}).`);

  /* 1 · the paintings are now sold */
  let clash = [];
  try {
    clash = (await sellWorks(order.id)) || [];
    if (clash.length) problems.push(`Paid, but another order had already taken: ${clash.join(', ')}. Contact the customer about a refund or alternative.`);
  } catch (err) {
    problems.push(`Couldn’t mark the paintings sold (${err.message}). Mark them Sold in the editor.`);
  }

  /* 2 · the shipping order */
  let shiprocket;
  if (clash.length >= order.works.length) shiprocket = { ok: false, error: 'Skipped: every painting in this order went to another buyer. Refund this payment in Razorpay.' };
  else if (!shiprocketConfigured()) shiprocket = { ok: false, error: 'Shiprocket is not set up (missing SHIPROCKET_* settings).' };
  else {
    try {
      const byId = new Map(DATA.works.map((w) => [w.id, w]));
      const works = order.works.map((w) => ({ ...byId.get(w.id), ...w, price: String(w.price) }));
      const out = await createOrder({ orderId: order.id, customer: order.customer, works });
      shiprocket = { ok: true, orderId: out.shiprocketOrderId, shipmentId: out.shipmentId };
    } catch (err) {
      console.error('[finalize] shiprocket', err);
      shiprocket = { ok: false, error: err.message };
    }
  }

  const done = { ...order, shiprocket, problem: problems.join(' ') || null };

  /* 3 · emails (the browser falls back to Web3Forms for the artist alert if these aren't set up) */
  let notified = false;
  if (mailConfigured()) {
    try {
      await artistAlert(done);
      notified = true;
    } catch (err) {
      console.error('[finalize] artist email', err);
    }
    if (customerMailConfigured()) await customerConfirmation(done).catch((err) => console.error('[finalize] customer email', err));
  }

  return (await updateOrder(order.id, { shiprocket, notified, problem: done.problem }).catch(() => null)) ?? { ...done, notified };
}
