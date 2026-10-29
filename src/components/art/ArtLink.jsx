import { Link } from 'react-router-dom';
import cx from '@/utils/cx';
import { ratioOf } from '@/data/works';

/* A framed artwork that opens its viewing room. Reveals on scroll unless `reveal` is false. */
export default function ArtLink({ work, reveal = true, priority = false, shadow = 'shadow-hang', className, style, imgClassName, ...props }) {
  return (
    <Link
      to={`/artwork/${work.id}`}
      data-art-link
      data-reveal={reveal || undefined}
      data-cursor="view"
      aria-label={`View ${work.title}`}
      className={cx('group relative block overflow-hidden bg-wall', shadow, className)}
      style={{ aspectRatio: ratioOf(work), ...style }}
      {...props}
    >
      <img
        src={work.img}
        alt={work.alt}
        loading={priority ? undefined : 'lazy'}
        fetchpriority={priority ? 'high' : undefined}
        className={cx(
          'block size-full object-cover transition-transform duration-1400 ease-gallery',
          work.crop ? 'crop-ig group-hover:scale-[1.03]' : 'group-hover:scale-[1.04]',
          imgClassName
        )}
      />
    </Link>
  );
}
