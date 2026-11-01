import cx from '@/utils/cx';
import { isAvailable, metaLine, plateLabel, priceLine } from '@/data/works';
import StatusBadge from '@/components/ui/StatusBadge';
import ArtLink from './ArtLink';

/* A catalogue card: the framed work, then plate, status, title, meta and price (or what to do instead). */
export default function ArtworkCard({ work, eyebrow = plateLabel(work), titleClassName = 'art-title', className, ...props }) {
  return (
    <figure data-card className={cx('m-0', className)} {...props}>
      <ArtLink work={work} />
      <figcaption data-cap className="mt-[18px] flex flex-col gap-1.5">
        <div className="flex items-baseline justify-between gap-3">
          <span className="eyebrow">{eyebrow}</span>
          <StatusBadge status={work.status} />
        </div>
        <span className={titleClassName}>{work.title}</span>
        <span className="meta">{metaLine(work)}</span>
        {isAvailable(work) ? (
          <span className="price">{work.price}</span>
        ) : (
          <span className="text-sm/6 font-semibold text-link">{priceLine(work)}</span>
        )}
      </figcaption>
    </figure>
  );
}
