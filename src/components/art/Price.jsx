import cx from '@/utils/cx';
import { SALE } from '@/data/sale';
import { formatINR, onSale, payValue, priceValue } from '@/data/works';

const SIZES = {
  sm: { now: 'text-[14px]/5', was: 'text-[12px]/5', badge: 'text-[9.5px]/[14px] px-1.5' },
  md: { now: 'text-[16px]/6', was: 'text-[13px]/6', badge: 'text-[10px]/[16px] px-2' },
  lg: { now: 'text-[26px]/8', was: 'text-[17px]/8', badge: 'text-[11px]/[18px] px-2.5 py-0.5' },
};

/* "50% off" pill for the corner of a card's image */
export function SaleTag({ className }) {
  return (
    <span
      className={cx(
        'z-1 inline-flex shrink-0 items-center rounded-full bg-sale px-2.5 py-[5px] text-[11px]/[14px] font-bold tracking-[.08em] whitespace-nowrap text-on-primary uppercase shadow-[0_6px_14px_-8px_rgba(34,33,31,.6)]',
        'max-sm:px-2 max-sm:py-1 max-sm:text-[9px]/3 max-sm:tracking-[.05em]',
        className
      )}
    >
      {SALE.percent}% off
    </span>
  );
}

/* A work's price. During a sale: the sale price, the full price struck through, and a "50% off" tag.
   Screen readers hear "Sale price ₹ 1,000, was ₹ 2,000". `dark` = on a primary fill. */
export default function SalePrice({ work, size = 'md', badge = true, dark = false, stacked = false, className }) {
  const s = SIZES[size];
  if (!onSale(work)) {
    return <span className={cx('price', s.now, className)}>{formatINR(priceValue(work))}</span>;
  }
  return (
    <span className={cx('inline-flex tabular-nums', stacked ? 'flex-col items-end' : 'flex-wrap items-baseline gap-x-2 gap-y-1', className)}>
      <span className="sr-only">Sale price</span>
      <span className={cx('font-bold', s.now, dark ? 'text-sale-on-dark' : 'text-sale')}>{formatINR(payValue(work))}</span>
      <span className="sr-only">, was</span>
      <s className={cx('font-medium decoration-1', s.was, dark ? 'text-on-primary-muted' : 'text-muted')}>{formatINR(priceValue(work))}</s>
      {badge && (
        <span aria-hidden="true" className={cx('self-center rounded-full bg-sale font-bold tracking-[.06em] whitespace-nowrap text-on-primary uppercase', s.badge)}>
          {SALE.percent}% off
        </span>
      )}
    </span>
  );
}
