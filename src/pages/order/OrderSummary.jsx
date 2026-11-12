import cx from '@/utils/cx';
import { formatINR, getWork, payValue, priceValue } from '@/data/works';
import { SALE } from '@/data/sale';
import SalePrice from '@/components/art/Price';
import Notice from '@/components/ui/Notice';

const DL =
  'm-0 grid grid-cols-[auto_minmax(0,1fr)] gap-x-6 gap-y-2.5 text-sm/[22px] max-sm:gap-x-4 [&_dd]:m-0 [&_dd]:font-semibold [&_dd]:[overflow-wrap:anywhere] [&_dt]:text-muted';

/* subtotal (struck through during a sale), the sale saving, shipping and the total */
export function Totals({ selection, paid = false, className }) {
  const picked = selection.map(getWork).filter(Boolean);
  const full = picked.reduce((s, w) => s + priceValue(w), 0);
  const total = picked.reduce((s, w) => s + payValue(w), 0);
  const saved = full - total;
  return (
    <dl className={cx(DL, className)}>
      <dt>Subtotal</dt>
      <dd className={saved > 0 ? 'text-muted line-through decoration-1' : undefined}>{formatINR(full)}</dd>
      {saved > 0 && (
        <>
          <dt className="font-semibold text-sale!">
            {SALE.name} · {SALE.percent}% off
          </dt>
          <dd className="text-sale">− {formatINR(saved)}</dd>
        </>
      )}
      <dt>Shipping</dt>
      <dd>Free within India</dd>
      <dt>{paid ? 'Paid' : 'Total'}</dt>
      <dd className="text-base">{formatINR(total)}</dd>
    </dl>
  );
}

/* the sticky "Your order" card beside every step. `items={false}` leaves out the list of works
   (the cart step already lists them in full). */
export default function OrderSummary({ selection, canEdit, onRemove, paid = false, items = true, className }) {
  const picked = selection.map(getWork).filter(Boolean);
  return (
    <aside
      aria-labelledby="sum-h"
      className={cx('sticky top-[calc(6rem+var(--sale-h,0px))] col-[9/13] min-w-0 bg-surface p-7 shadow-[0_1px_0_var(--color-divider)] max-lg:static max-lg:col-span-full max-lg:mt-12 max-sm:p-5', className)}
    >
      <div className="flex items-baseline justify-between gap-3">
        <h2 id="sum-h" className="art-title">
          {items ? 'Your order' : 'Order total'}
        </h2>
        <span aria-live="polite" className="meta tabular-nums">
          {picked.length} {picked.length === 1 ? 'original' : 'originals'}
        </span>
      </div>
      {items && picked.length === 0 && <p className="meta mt-5">Nothing chosen yet.</p>}
      {items && (
        <div className="mt-3">
          {picked.map((w) => (
            <div key={w.id} className="grid grid-cols-[56px_minmax(0,1fr)_auto] items-center gap-3 border-b border-divider py-3.5">
              <span className="relative h-[70px] w-14 overflow-hidden rounded-ui bg-wall">
                <img src={w.img} alt="" loading="lazy" className={w.crop ? 'crop-ig object-cover' : 'block size-full object-cover'} />
              </span>
              <span className="flex min-w-0 flex-col gap-0.5">
                <span className="font-display text-lg/[22px] font-medium">{w.title}</span>
                <span className="meta text-[12px]!">Original · quantity 1</span>
              </span>
              <span className="flex flex-col items-end gap-1">
                <SalePrice work={w} size="sm" badge={false} stacked />
                {canEdit && (
                  <button
                    type="button"
                    onClick={() => onRemove(w.id)}
                    aria-label={`Remove ${w.title}`}
                    className="h-7 cursor-pointer border-0 bg-transparent p-0 font-sans text-xs font-semibold text-link"
                  >
                    Remove
                  </button>
                )}
              </span>
            </div>
          ))}
        </div>
      )}
      <Totals selection={selection} paid={paid} className="mt-5" />
      <Notice tone="info" className="mt-5 text-[13px]/5!">
        Secure payment by Razorpay: UPI (scan a QR code), cards and netbanking. Your card and UPI details never reach this site.
      </Notice>
    </aside>
  );
}

export { DL as REVIEW_LIST };
