/* Razorpay Checkout: loads checkout.js on demand and opens the payment window
   (UPI QR code / UPI apps, cards, netbanking, wallets). */

let loading;
function loadCheckout() {
  if (window.Razorpay) return Promise.resolve();
  loading ??= new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = 'https://checkout.razorpay.com/v1/checkout.js';
    s.async = true;
    s.onload = resolve;
    s.onerror = () => {
      loading = null;
      reject(new Error('The payment window couldn’t load. Check your connection and try again.'));
    };
    document.head.appendChild(s);
  });
  return loading;
}

/* Razorpay wants a hex colour; use the theme's primary token if it is one */
const themeColour = () => {
  const c = getComputedStyle(document.documentElement).getPropertyValue('--color-primary').trim();
  return /^#[0-9a-f]{3,8}$/i.test(c) ? c : undefined;
};

/* Resolves with { razorpay_payment_id, razorpay_order_id, razorpay_signature } once paid.
   Rejects with { dismissed: true, failure } if the buyer closes the window without paying. */
export async function payWithRazorpay({ key, razorpayOrderId, amount, orderId, description, customer }) {
  await loadCheckout();
  return new Promise((resolve, reject) => {
    let failure = null;
    const rzp = new window.Razorpay({
      key,
      order_id: razorpayOrderId,
      amount,
      currency: 'INR',
      name: 'KALA',
      description: description.slice(0, 250),
      notes: { kala_order: orderId },
      prefill: { name: customer.name, email: customer.email, contact: customer.phone },
      theme: { color: themeColour() },
      /* UPI (with its QR code) first; cards, netbanking and wallets below */
      config: {
        display: {
          blocks: { upi: { name: 'Pay with UPI: scan the QR code or use your UPI app', instruments: [{ method: 'upi' }] } },
          sequence: ['block.upi'],
          preferences: { show_default_blocks: true },
        },
      },
      timeout: 15 * 60, // seconds; the paintings are held for 20 minutes
      retry: { enabled: true },
      handler: resolve,
      modal: {
        confirm_close: true,
        ondismiss: () => reject(Object.assign(new Error('dismissed'), { dismissed: true, failure })),
      },
    });
    rzp.on('payment.failed', (resp) => {
      failure = resp?.error?.description || 'The payment didn’t go through.';
    });
    rzp.open();
  });
}
