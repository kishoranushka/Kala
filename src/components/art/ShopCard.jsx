import { Link } from 'react-router-dom';
import cx from '@/utils/cx';
import { getCollection, statusLabel, isAvailable, isBuyable, metaLine, onSale } from '@/data/works';
import CartButton from './CartButton';
import SalePrice, { SaleTag } from './Price';

const DOT = { available: 'bg-success', sold: 'bg-muted', archived: 'bg-muted', inquiry: 'bg-link' };

/* The home shop-strip card: the painting floats on a soft mat with a status tag,
   then title, price, meta and an add-to-cart button. */
export default function ShopCard({ work, showCollection = false, titleClassName = 'text-[26px]/[30px] max-sm:text-[19px]/6', className }) {
  return (
    <div data-card className={cx('text-primary', className)}>
      <Link
        to={`/artwork/${work.id}`}
        data-cursor="view"
        aria-label={`View ${work.title}, ${statusLabel(work)}`}
        className="group block text-inherit no-underline hover:text-inherit"
      >
        <div className="relative flex aspect-[4/5] items-center justify-center rounded-ui bg-mat p-[30px] transition-colors duration-600 ease-gallery group-hover:bg-mat-hover max-sm:p-[18px]">
          {/* status + sale pills share one row that wraps on narrow cards instead of overlapping */}
          <span className="absolute inset-x-4 top-4 z-1 flex flex-wrap items-start justify-between gap-1.5 max-sm:inset-x-2 max-sm:top-2 max-sm:gap-1">
            <span className="inline-flex min-w-0 items-center gap-1.5 rounded-full bg-surface px-2.5 py-[5px] text-[11px]/[14px] font-bold tracking-[.08em] uppercase max-sm:gap-1 max-sm:px-2 max-sm:py-1 max-sm:text-[9px]/3 max-sm:tracking-[.05em]">
              <i aria-hidden="true" className={cx('size-[7px] shrink-0 rounded-full max-sm:size-1.5', DOT[work.status])} />
              {statusLabel(work)}
            </span>
            {onSale(work) && <SaleTag />}
          </span>
          <img
            src={work.img}
            alt={work.alt}
            loading="lazy"
            className="block h-auto max-h-full w-auto max-w-full shadow-[0_2px_4px_rgba(20,22,63,.14),0_26px_40px_-20px_rgba(20,22,63,.5)] transition-transform duration-900 ease-gallery group-hover:-translate-y-2 group-hover:-rotate-[1.5deg]"
          />
        </div>
        {showCollection && (
          <span className="mt-4 block text-[11px]/4 font-semibold tracking-[.12em] text-secondary uppercase">{getCollection(work.collection).title}</span>
        )}
        <div className={cx('flex items-baseline justify-between gap-3 max-sm:flex-col max-sm:gap-0.5', showCollection ? 'mt-1' : 'mt-[18px]')}>
          <span className={cx('font-display font-medium', titleClassName)}>{work.title}</span>
          {isBuyable(work) ? (
            <SalePrice work={work} badge={false} className="shrink-0 justify-end max-sm:justify-start" />
          ) : (
            isAvailable(work) && <span className="shrink-0 text-[13px] font-semibold text-muted">Price on request</span>
          )}
        </div>
        <span className="mt-1 block text-[13px]/5 text-muted">{metaLine(work)}</span>
      </Link>
      <CartButton work={work} />
    </div>
  );
}
