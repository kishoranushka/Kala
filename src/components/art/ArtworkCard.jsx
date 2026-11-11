import cx from '@/utils/cx';
import { isAvailable, isBuyable, metaLine, plateLabel, priceLine } from '@/data/works';
import SalePrice from './Price';
import StatusBadge from '@/components/ui/StatusBadge';
import ArtLink from './ArtLink';
import CartButton from './CartButton';

/* A catalogue card: the framed work, then plate, status, title, meta and price (or what to do instead),
   and optionally an add-to-cart button. */
export default function ArtworkCard({ work, eyebrow = plateLabel(work), titleClassName = 'art-title', cart = false, className, ...props }) {
  return (
    <figure data-card className={cx('m-0', className)} {...props}>
      <ArtLink work={work} />
      <figcaption data-cap className="mt-[18px] flex flex-col gap-1.5">
        <div className="flex items-baseline justify-between gap-3">
          <span className="eyebrow">{eyebrow}</span>
          <StatusBadge work={work} />
        </div>
        <span className={titleClassName}>{work.title}</span>
        <span className="meta">{metaLine(work)}</span>
        {isBuyable(work) ? (
          <SalePrice work={work} />
        ) : isAvailable(work) ? (
          <span className="text-sm/6 font-semibold text-link">Price on request</span>
        ) : (
          <span className="text-sm/6 font-semibold text-link">{priceLine(work)}</span>
        )}
        {cart && <CartButton work={work} className="mt-2" />}
      </figcaption>
    </figure>
  );
}
