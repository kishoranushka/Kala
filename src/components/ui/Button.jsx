import cx from '@/utils/cx';
import Icon from './Icon';
import SmartLink from './SmartLink';

/* a fill slides up from below on hover; the arrow nudges forward */
const BASE =
  'relative isolate inline-flex min-h-12 items-center justify-center gap-2.5 overflow-hidden rounded-[2px] px-6 font-sans text-sm font-semibold tracking-[.02em] cursor-pointer ' +
  'transition-[color,border-color] duration-500 ease-gallery ' +
  'before:absolute before:inset-0 before:-z-10 before:translate-y-[101%] before:transition-transform before:duration-600 before:ease-gallery hover:before:translate-y-0 ' +
  '[&_svg]:transition-transform [&_svg]:duration-500 [&_svg]:ease-gallery hover:[&_svg]:translate-x-1 ' +
  'aria-disabled:pointer-events-none aria-disabled:opacity-55';

const VARIANTS = {
  primary: 'border-0 bg-ink text-paper before:bg-cobalt hover:text-paper',
  secondary: 'border border-line bg-transparent text-ink before:bg-ink hover:border-ink hover:text-paper',
  light: 'border-0 bg-paper text-ink before:bg-oak hover:text-ink',
};

export default function Button({ to, variant = 'primary', block = false, arrow, className, children, type = 'button', ...props }) {
  const classes = cx(BASE, VARIANTS[variant], block && 'w-full', className);
  const content = (
    <>
      {children}
      {arrow && <Icon name={arrow === true ? 'arrow' : arrow} size={16} />}
    </>
  );

  if (to) {
    return (
      <SmartLink to={to} className={classes} {...props}>
        {content}
      </SmartLink>
    );
  }
  return (
    <button type={type} className={classes} {...props}>
      {content}
    </button>
  );
}
