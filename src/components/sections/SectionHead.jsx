import cx from '@/utils/cx';
import { SplitWords } from '@/components/ui/Typography';
import SmartLink from '@/components/ui/SmartLink';
import Icon from '@/components/ui/Icon';

/* eyebrow + big light title on the left, an optional lead or link on the right.
   Title markup: *word* sets a word in italics. */
export default function SectionHead({ id, eyebrow, title, lead, aside, className, children }) {
  return (
    <div className={cx('mb-[clamp(40px,5vw,64px)] flex items-end justify-between gap-8 max-lg:flex-wrap', className)}>
      <div>
        <p data-eyebrow className="eyebrow-lg m-0">
          {eyebrow}
        </p>
        <SplitWords id={id} text={title} className="heading-section mt-3.5 mb-0" />
        {lead && (
          <p data-cap className="lead-lg mt-5 mb-0">
            {lead}
          </p>
        )}
        {children}
      </div>
      {aside}
    </div>
  );
}

/* the underlined arrow link beside a section title */
export function ArrowLink({ to, className, children, ...props }) {
  return (
    <SmartLink
      to={to}
      className={cx(
        'inline-flex min-h-11 items-center gap-2 border-b-[1.5px] border-current text-[15px] font-semibold !text-inherit no-underline transition-[gap] duration-500 ease-gallery hover:gap-3',
        className
      )}
      {...props}
    >
      {children}
      <Icon name="arrow" size={18} strokeWidth={1.8} />
    </SmartLink>
  );
}

/* the outlined pill list (spaces I paint, things I paint on) */
export function Chips({ items, label, className }) {
  return (
    <ul data-stagger aria-label={label} className={cx('m-0 mt-7 flex list-none flex-wrap gap-2.5 p-0', className)}>
      {items.map((item) => (
        <li key={item} className="rounded-full border border-line px-4 py-2 text-sm/5 font-medium">
          {item}
        </li>
      ))}
    </ul>
  );
}
