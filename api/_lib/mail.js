/* Order emails via Resend (https://resend.com) — optional.
   Env: RESEND_API_KEY   turns server emails on.
        ORDER_EMAIL_TO   where order alerts go (default: the artist's address below).
        MAIL_FROM        a sender on a domain verified in Resend, e.g. "KALA <orders@anushkakishor.in>".
                         Without it, Resend's test sender is used, which can only email the Resend account's
                         own address: the artist still gets alerts, but customers get no confirmation email
                         (they still get Razorpay's payment receipt). */
import { timedFetch } from './http.js';
import { confirmationHtml, LOGO } from './email-html.js';

const ARTIST = 'kishoranushka96@gmail.com';
const SITE = process.env.SITE_URL || 'https://kala.anushkakishor.in';

export const mailConfigured = () => Boolean(process.env.RESEND_API_KEY);
export const customerMailConfigured = () => mailConfigured() && Boolean(process.env.MAIL_FROM);

async function send({ to, subject, text, html, attachments, replyTo }) {
  const res = await timedFetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: process.env.MAIL_FROM || 'KALA <onboarding@resend.dev>',
      to: [to],
      subject,
      text,
      ...(html ? { html } : {}),
      ...(attachments ? { attachments } : {}),
      ...(replyTo ? { reply_to: replyTo } : {}),
    }),
  });
  if (!res.ok) {
    const out = await res.json().catch(() => ({}));
    throw new Error(`Email: ${out.message || res.status}`);
  }
}

const inr = (rupees) => `₹ ${Number(rupees).toLocaleString('en-IN')}`;
const address = (c) => [c.address, c.city, c.state, c.pin, c.country].filter(Boolean).join(', ');
const workLines = (order) => order.works.map((w) => `  • ${w.title} — ${inr(w.price)}${w.full > w.price ? ` (sale price, was ${inr(w.full)})` : ''}`).join('\n');

export function artistAlert(order) {
  const c = order.customer;
  const sr = order.shiprocket;
  return send({
    to: process.env.ORDER_EMAIL_TO || ARTIST,
    replyTo: c.email,
    subject: `Paid order ${order.id} from ${c.name}: ${order.works.map((w) => w.title).join(', ')}`,
    text: [
      `New PAID order ${order.id}`,
      '',
      'Paintings:',
      workLines(order),
      `Total paid: ${inr(order.amount / 100)}  (Razorpay payment ${order.razorpay_payment_id})`,
      '',
      `Customer: ${c.name}`,
      `Email: ${c.email}`,
      `Phone: ${c.phone}`,
      `Ship to: ${address(c)}`,
      `Note: ${c.note || '—'}`,
      '',
      `Shiprocket: ${sr?.ok ? `created (order ${sr.orderId}, shipment ${sr.shipmentId}). Assign a courier and ship.` : `NOT created: ${sr?.error || 'unknown'}. Add this order in Shiprocket by hand.`}`,
      ...(order.problem ? ['', `⚠ CHECK: ${order.problem}`] : []),
      '',
      'Reply to this email to write to the customer.',
    ].join('\n'),
  });
}

export function customerConfirmation(order) {
  const c = order.customer;
  const track = `${SITE}/track?id=${encodeURIComponent(order.id)}`;
  const lost = order.works.filter((w) => order.lost?.includes(w.id));
  const allLost = lost.length > 0 && lost.length === order.works.length;
  return send({
    to: c.email,
    replyTo: process.env.ORDER_EMAIL_TO || ARTIST,
    subject: allLost ? `About your KALA order ${order.id}` : `Your KALA order ${order.id} is confirmed`,
    html: confirmationHtml({ order, track, lost, allLost }),
    attachments: [{ filename: 'kala-logo.png', content: LOGO.base64, content_type: 'image/png', content_id: 'kala-logo' }],
    text: [
      `Hi ${c.name.split(' ')[0]},`,
      '',
      allLost
        ? `Thank you for your payment for order ${order.id}. I’m sorry: ${lost.map((w) => w.title).join(', ')} went to another buyer moments before your payment came through. I’ll refund you in full and write to you shortly.`
        : `Thank you! Your payment is received and your order ${order.id} is confirmed.`,
      ...(lost.length && !allLost ? ['', `I’m sorry: ${lost.map((w) => w.title).join(', ')} went to another buyer moments before your payment came through. I’ll refund that part in full and write to you shortly.`] : []),
      '',
      workLines(order),
      `Total paid: ${inr(order.amount / 100)}`,
      '',
      `Shipping to: ${address(c)}`,
      '',
      ...(allLost ? [] : ['I’ll pack your painting with care and send it soon. You’ll get courier tracking by SMS and email once it ships.']),
      `Track your order any time: ${track}`,
      '',
      'Questions? Just reply to this email.',
      '',
      'Anushka',
      'KALA',
    ].join('\n'),
  });
}
