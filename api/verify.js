/* POST /api/verify — the buyer's browser reports a successful Razorpay payment.
   Body: { orderId, razorpay_order_id, razorpay_payment_id, razorpay_signature }
   The signature proves the payment is genuine; then the order is finalised (paid → sold → Shiprocket → emails).
   Returns: { orderId, status, notified, shiprocket, problem, lost: [{ id, title }] }
   `lost` = paintings someone else bought first (the buyer is refunded for those). */
import { json, readJson } from './_lib/http.js';
import { dbConfigured, getOrder, lostWorks } from './_lib/db.js';
import { razorpayConfigured, validPaymentSignature } from './_lib/razorpay.js';
import { finalizeOrder } from './_lib/finalize.js';

const str = (v, max = 100) => (typeof v === 'string' ? v.slice(0, max) : '');

export default async function handler(req, res) {
  if (req.method !== 'POST') return json(res, 405, { error: 'Method not allowed' });
  if (!razorpayConfigured() || !dbConfigured()) return json(res, 503, { error: 'Payments are not set up.' });

  let body;
  try {
    body = await readJson(req);
  } catch {
    return json(res, 400, { error: 'Invalid request.' });
  }
  const orderId = str(body.orderId, 40);
  const razorpayOrderId = str(body.razorpay_order_id);
  const paymentId = str(body.razorpay_payment_id);
  const signature = str(body.razorpay_signature, 200);
  if (!orderId || !razorpayOrderId || !paymentId || !signature) return json(res, 400, { error: 'Invalid request.' });

  try {
    const order = await getOrder(orderId);
    if (!order || order.razorpay_order_id !== razorpayOrderId) return json(res, 404, { error: 'Order not found.' });
    if (!validPaymentSignature({ razorpayOrderId, paymentId, signature })) return json(res, 400, { error: 'Payment could not be verified.' });

    const done = await finalizeOrder(order.id, paymentId);
    const lost = await lostWorks(done).catch(() => []);
    return json(res, 200, {
      orderId: done.id,
      status: done.status,
      notified: Boolean(done.notified),
      shiprocket: done.shiprocket ? { ok: Boolean(done.shiprocket.ok), error: done.shiprocket.error || null } : null,
      problem: done.problem || null,
      lost: done.works.filter((w) => lost.includes(w.id)).map((w) => ({ id: w.id, title: w.title })),
    });
  } catch (err) {
    console.error('[api/verify]', err);
    return json(res, 502, { error: 'Payment received, but confirming it failed. It will be confirmed automatically.' });
  }
}
