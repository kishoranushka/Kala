/* POST /api/razorpay-webhook — Razorpay tells us about payments directly.
   A safety net: if the buyer closes the tab right after paying, the order is still confirmed here.
   Set up in Razorpay → Account & Settings → Webhooks: URL https://<site>/api/razorpay-webhook,
   events "order.paid" and "payment.captured", secret = RAZORPAY_WEBHOOK_SECRET. */
import { json, readRaw } from './_lib/http.js';
import { dbConfigured, getOrderByRazorpay } from './_lib/db.js';
import { validWebhookSignature } from './_lib/razorpay.js';
import { finalizeOrder } from './_lib/finalize.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return json(res, 405, { error: 'Method not allowed' });

  const raw = await readRaw(req);
  if (!validWebhookSignature(raw, req.headers['x-razorpay-signature'])) return json(res, 400, { error: 'Bad signature' });

  let event;
  try {
    event = JSON.parse(raw);
  } catch {
    return json(res, 400, { error: 'Invalid body' });
  }
  if (!['order.paid', 'payment.captured'].includes(event.event)) return json(res, 200, { ignored: event.event });

  const payment = event.payload?.payment?.entity;
  const razorpayOrderId = payment?.order_id || event.payload?.order?.entity?.id;
  if (!payment?.id || !razorpayOrderId || !dbConfigured()) return json(res, 200, { ignored: 'no order' });

  try {
    const order = await getOrderByRazorpay(razorpayOrderId);
    if (!order) return json(res, 200, { ignored: 'unknown order' }); // not one of ours
    const done = await finalizeOrder(order.id, payment.id);
    return json(res, 200, { orderId: done.id, status: done.status });
  } catch (err) {
    console.error('[api/razorpay-webhook]', err);
    return json(res, 500, { error: 'retry' }); // Razorpay retries later
  }
}
