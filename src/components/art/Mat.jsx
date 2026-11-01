import cx from '@/utils/cx';

/* A painting floating on a soft mount board. Put it inside a `group` link for the hover lift.
   `ratio` and `padding` are Tailwind classes; extra children (tags, numbers) sit on top. */
export default function Mat({ work, ratio = 'aspect-[4/3]', padding = 'p-[22px]', tone = 'bg-mat group-hover:bg-mat-hover', imgClassName, alt, children, className }) {
  return (
    <div className={cx('relative flex min-h-0 items-center justify-center overflow-hidden rounded-ui transition-colors duration-500 ease-gallery', ratio, padding, tone, className)}>
      {children}
      <img
        src={work.img}
        alt={alt ?? work.alt}
        loading="lazy"
        className={cx(
          'block h-auto max-h-full min-h-0 w-auto max-w-full shadow-[0_2px_4px_rgba(34,33,31,.12),0_24px_36px_-18px_rgba(34,33,31,.5)] transition-transform duration-900 ease-gallery group-hover:-translate-y-1.5',
          imgClassName
        )}
      />
    </div>
  );
}
