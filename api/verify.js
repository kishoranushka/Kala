/* POST /api/verify — the buyer's browser reports a successful Razorpay payment.
   Body: { orderId, razorpay_order_id, razorpay_payment_id, razorpay_signature }
   The signature proves the payment is genuine; then the order is finalised (paid → sold → Shiprocket → emails).
   Returns: { orderId, status, notified } */
import { json, readJson } from './_lib/http.js';
import { dbConfigured, getOrder } from './_lib/db.js';
import { razorpayConfigured, validPaymentSignature } from './_lib/razorpay.js';
import { finalizeOrder } from './_lib/finalize.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return json(res, 405, { error: 'Method not allowed' });
  if (!razorpayConfigured() || !dbConfigured()) return json(res, 503, { error: 'Payments are not set up.' });

  let body;
  try {
    body = await readJson(req);
  } catch {
    return json(res, 400, { error: 'Invalid request.' });
  }
  const { orderId, razorpay_order_id: razorpayOrderId, razorpay_payment_id: paymentId, razorpay_signature: signature } = body;

  try {
    const order = orderId && (await getOrder(String(orderId)));
    if (!order || order.razorpay_order_id !== razorpayOrderId) return json(res, 404, { error: 'Order not found.' });
    if (!validPaymentSignature({ razorpayOrderId, paymentId, signature })) return json(res, 400, { error: 'Payment could not be verified.' });

    const done = await finalizeOrder(order.id, paymentId);
    return json(res, 200, {
      orderId: done.id,
      status: done.status,
      notified: Boolean(done.notified),
      shiprocket: done.shiprocket ? { ok: Boolean(done.shiprocket.ok), error: done.shiprocket.error || null } : null,
      problem: done.problem || null,
    });
  } catch (err) {
    console.error('[api/verify]', err);
    return json(res, 502, { error: 'Payment received, but confirming it failed. It will be confirmed automatically.' });
  }
}
