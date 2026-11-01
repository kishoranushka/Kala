import { Link } from 'react-router-dom';
import cx from '@/utils/cx';
import { STATUS, isAvailable, metaLine } from '@/data/works';
import CartButton from './CartButton';

const DOT = { available: 'bg-success', sold: 'bg-muted', archived: 'bg-muted', inquiry: 'bg-link' };

/* The home shop-strip card: the painting floats on a soft mat with a status tag,
   then title, price, meta and an add-to-cart button. */
export default function ShopCard({ work, className }) {
  return (
    <div data-card className={cx('text-primary', className)}>
      <Link
        to={`/artwork/${work.id}`}
        data-cursor="view"
        aria-label={`View ${work.title}, ${STATUS[work.status].label}`}
        className="group block text-inherit no-underline hover:text-inherit"
      >
        <div className="relative flex aspect-[4/5] items-center justify-center rounded-ui bg-mat p-[30px] transition-colors duration-600 ease-gallery group-hover:bg-mat-hover max-sm:p-[18px]">
          <span className="absolute top-4 left-4 inline-flex items-center gap-1.5 rounded-full bg-surface px-2.5 py-[5px] text-[11px]/[14px] font-bold tracking-[.08em] uppercase">
            <i aria-hidden="true" className={cx('size-[7px] rounded-full', DOT[work.status])} />
            {STATUS[work.status].label}
          </span>
          <img
            src={work.img}
            alt={work.alt}
            loading="lazy"
            className="block h-auto max-h-full w-auto max-w-full shadow-[0_2px_4px_rgba(20,22,63,.14),0_26px_40px_-20px_rgba(20,22,63,.5)] transition-transform duration-900 ease-gallery group-hover:-translate-y-2 group-hover:-rotate-[1.5deg]"
          />
        </div>
        <div className="mt-[18px] flex items-baseline justify-between gap-3 max-sm:flex-col max-sm:gap-0.5">
          <span className="font-display text-[26px]/[30px] font-medium max-sm:text-[19px]/6">{work.title}</span>
          {isAvailable(work) && <span className="shrink-0 text-[15px] font-bold">{work.price}</span>}
        </div>
        <span className="mt-1 block text-[13px]/5 text-muted">{metaLine(work)}</span>
      </Link>
      <CartButton work={work} />
    </div>
  );
}
