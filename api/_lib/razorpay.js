/* Razorpay (payments) — server-side only.
   Env: RAZORPAY_KEY_ID          (Dashboard → Account & Settings → API Keys; rzp_test_… or rzp_live_…)
        RAZORPAY_KEY_SECRET      (shown once when the key is generated)
        RAZORPAY_WEBHOOK_SECRET  (the secret you type when adding the webhook; see README) */
import { createHmac, timingSafeEqual } from 'node:crypto';

const API = 'https://api.razorpay.com/v1';

export const razorpayConfigured = () => Boolean(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET);
export const publicKey = () => process.env.RAZORPAY_KEY_ID;

const auth = () => 'Basic ' + Buffer.from(`${process.env.RAZORPAY_KEY_ID}:${process.env.RAZORPAY_KEY_SECRET}`).toString('base64');

/* amount in paise */
export async function createRazorpayOrder({ amount, receipt, notes }) {
  const res = await fetch(`${API}/orders`, {
    method: 'POST',
    headers: { Authorization: auth(), 'Content-Type': 'application/json' },
    body: JSON.stringify({ amount, currency: 'INR', receipt, notes }),
  });
  const out = await res.json().catch(() => ({}));
  if (!res.ok || !out.id) throw new Error(`Razorpay: ${out.error?.description || res.status}`);
  return out;
}

function same(expected, given) {
  const a = Buffer.from(String(expected));
  const b = Buffer.from(String(given ?? ''));
  return a.length === b.length && timingSafeEqual(a, b);
}

/* the checkout's success response is genuine only if this matches */
export function validPaymentSignature({ razorpayOrderId, paymentId, signature }) {
  const expected = createHmac('sha256', process.env.RAZORPAY_KEY_SECRET).update(`${razorpayOrderId}|${paymentId}`).digest('hex');
  return same(expected, signature);
}

export function validWebhookSignature(rawBody, signature) {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!secret) return false;
  const expected = createHmac('sha256', secret).update(rawBody).digest('hex');
  return same(expected, signature);
}
