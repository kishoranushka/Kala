/* KALA — the shop-wide sale, switched by environment variables (one source for the site, the API and the SEO build).

     VITE_SALE_ON       "true" turns the sale on. Anything else (or missing) = no sale: no banners, no struck-out prices,
                        and the checkout charges full price.
     VITE_SALE_PERCENT  discount in percent, 1–90 (default 50)
     VITE_SALE_ENDS     optional end, ISO date-time, e.g. 2026-11-30T23:59:59+05:30. After it the sale switches off by itself.
     VITE_SALE_NAME     optional label (default "Launch sale")

   Set them in .env.local for local work and in Vercel → Settings → Environment Variables for the live site.
   The site reads them at build time, so after changing them in Vercel, redeploy. The API (/api/order) uses the
   same values, so what the page shows is what Razorpay charges.

   Plain JS on purpose: imported by the browser (Vite), the Vercel functions and the Node build scripts. */

/* Vite swaps import.meta.env for the VITE_* values in the browser; in Node it is undefined and process.env is used */
const viteEnv = import.meta.env || {};
const nodeEnv = typeof process !== 'undefined' && process.env ? process.env : {};
const env = (key) => String(viteEnv[key] ?? nodeEnv[key] ?? '').trim();

const percent = Math.min(90, Math.max(1, Math.round(Number(env('VITE_SALE_PERCENT')) || 50)));
const endsAt = env('VITE_SALE_ENDS') ? Date.parse(env('VITE_SALE_ENDS')) : NaN;

export const SALE = {
  enabled: /^(true|1|yes|on)$/i.test(env('VITE_SALE_ON')),
  percent,
  name: env('VITE_SALE_NAME') || 'Launch sale',
  endsAt: Number.isFinite(endsAt) ? endsAt : null,
};

/* is the sale running right now? */
export const saleActive = (now = Date.now()) => SALE.enabled && (SALE.endsAt === null || now < SALE.endsAt);

/* "₹ 12,000" / "3499" → rupees (0 if no price is set) */
export const rupeesOf = (price) => Number(String(price ?? '').replace(/[^\d.]/g, '')) || 0;

/* what a full price costs today (whole rupees) */
export const discounted = (full, now = Date.now()) => (saleActive(now) && full >= 1 ? Math.max(1, Math.round((full * (100 - SALE.percent)) / 100)) : full);

/* "30 November" in India time, for banners */
export const saleEndsLabel = () =>
  SALE.endsAt === null ? null : new Date(SALE.endsAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', timeZone: 'Asia/Kolkata' });
