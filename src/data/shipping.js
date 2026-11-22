/* KALA — delivery charge and the optional frame, in one place for the site, the API (/api/order) and the SEO build.
   Plain JS on purpose: imported by the browser (Vite), the Vercel functions and the Node build scripts.

   Delivery (India only): free when the order value (paintings + any frames) is ₹1,499 or more,
   otherwise a flat ₹50 per order.

   Framing: an unframed painting can be framed before it ships, if the buyer asks for it.
   A painting's `frameSize` (set in /admin) says which frame it gets:
     'small' (₹120) · 'large' (₹400) · 'none' (not offered) · missing = automatic:
     offered only when its Framing reads "Unframed" (or "No"); large for A3 and bigger, small otherwise. */

export const SHIPPING = { freeFrom: 1499, fee: 50 };
export const FRAME_PRICE = { small: 120, large: 400 };
export const FRAME_LABEL = { small: 'Small frame', large: 'Large frame' };

const UNFRAMED = /^\s*(unframed|no|none|not framed)\s*\.?\s*$/i;
const LARGE_SIZE = /\bA[0-3]\b/i;

/* 'small' | 'large' | null (no framing offered) */
export function frameOf(w) {
  if (!w) return null;
  const set = String(w.frameSize ?? '').trim().toLowerCase();
  if (set === 'none') return null;
  if (set === 'small' || set === 'large') return set;
  if (!UNFRAMED.test(String(w.framing ?? ''))) return null;
  return LARGE_SIZE.test(String(w.size ?? '')) ? 'large' : 'small';
}

/* framing charge in rupees for a work (0 if not offered) */
export const framePrice = (w) => FRAME_PRICE[frameOf(w)] ?? 0;

/* delivery for an order worth `value` rupees (paintings + frames) */
export const shippingFor = (value) => (value > 0 && value < SHIPPING.freeFrom ? SHIPPING.fee : 0);

/* how much more makes delivery free (0 when it already is) */
export const toFreeShipping = (value) => (value > 0 && value < SHIPPING.freeFrom ? SHIPPING.freeFrom - value : 0);

/* lines: [{ price, frame? }] in rupees → { paintings, framing, value, shipping, total } */
export function orderTotals(lines) {
  const paintings = lines.reduce((s, l) => s + (Number(l.price) || 0), 0);
  const framing = lines.reduce((s, l) => s + (Number(l.frame) || 0), 0);
  const value = paintings + framing;
  const shipping = shippingFor(value);
  return { paintings, framing, value, shipping, total: value + shipping };
}

/* a saved order ({ works: lines, amount in paise }) → its totals, with the delivery it actually paid */
export function paidTotals(order) {
  const t = orderTotals(order?.works || []);
  const total = Math.round(Number(order?.amount) || 0) / 100;
  return { ...t, shipping: Math.max(0, total - t.value), total };
}

/* "₹1,499" for copy */
const inr = (n) => `₹${Number(n).toLocaleString('en-IN')}`;
export const FREE_FROM_TEXT = inr(SHIPPING.freeFrom);
export const FEE_TEXT = inr(SHIPPING.fee);
/* one line for pages and SEO text */
export const SHIPPING_LINE = `Free delivery in India on orders of ${FREE_FROM_TEXT} or more; ${FEE_TEXT} below that`;
export const FRAMING_LINE = `Unframed paintings can be framed for you: ${inr(FRAME_PRICE.small)} for a small painting, ${inr(FRAME_PRICE.large)} for a larger one`;
