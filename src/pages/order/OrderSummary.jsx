import { getWork } from '@/data/works';
import Notice from '@/components/ui/Notice';

const DL = 'm-0 grid grid-cols-[auto_1fr] gap-x-6 gap-y-2.5 text-sm/[22px] [&_dd]:m-0 [&_dd]:font-semibold [&_dt]:text-muted';

/* the sticky "Your order" card beside every step */
export default function OrderSummary({ selection, canEdit, onRemove, collect }) {
  const picked = selection.map(getWork);
  return (
    <aside
      aria-labelledby="sum-h"
      className="sticky top-24 col-[9/13] bg-surface p-7 shadow-[0_1px_0_#E5E0D8] max-lg:static max-lg:col-span-full max-lg:mt-12"
    >
      <div className="flex items-baseline justify-between gap-3">
        <h2 id="sum-h" className="art-title">
          Your order
        </h2>
        <span aria-live="polite" className="meta tabular-nums">
          {picked.length} {picked.length === 1 ? 'original' : 'originals'}
        </span>
      </div>
      {picked.length === 0 && <p className="meta mt-5">Nothing chosen yet. Tap a work to add it.</p>}
      <div className="mt-3">
        {picked.map((w) => (
          <div key={w.id} className="grid grid-cols-[56px_1fr_auto] items-center gap-3 border-b border-divider py-3.5">
            <span className="relative h-[70px] w-14 overflow-hidden rounded-ui bg-wall">
              <img src={w.img} alt="" className={w.crop ? 'crop-ig object-cover' : 'block size-full object-cover'} />
            </span>
            <span className="flex min-w-0 flex-col gap-0.5">
              <span className="font-display text-lg/[22px] font-medium">{w.title}</span>
              <span className="meta text-[12px]!">Original · quantity 1</span>
            </span>
            <span className="flex flex-col items-end gap-1">
              <span className="price text-[14px]!">{w.price}</span>
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
      <dl className={`${DL} mt-5`}>
        <dt>Subtotal</dt>
        <dd>Confirmed with your order</dd>
        <dt>Shipping</dt>
        <dd>{collect ? 'Studio collection' : 'Confirmed with your order'}</dd>
      </dl>
      <Notice tone="info" className="mt-5 text-[13px]/5!">
        Payment is never taken on this page. You’ll receive a secure link once your order is confirmed.
      </Notice>
    </aside>
  );
}

export { DL as REVIEW_LIST };
