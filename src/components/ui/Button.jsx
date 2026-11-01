import cx from '@/utils/cx';
import Icon from './Icon';
import SmartLink from './SmartLink';

/* Gallery buttons (inner pages): a fill slides up from below on hover; the arrow nudges forward. */
const SLIDE =
  'relative isolate inline-flex min-h-12 items-center justify-center gap-2.5 overflow-hidden rounded-ui px-6 font-sans text-sm font-semibold tracking-[.02em] cursor-pointer no-underline ' +
  'transition-[color,border-color] duration-500 ease-gallery ' +
  'before:absolute before:inset-0 before:-z-10 before:rounded-[inherit] before:translate-y-[101%] before:transition-transform before:duration-600 before:ease-gallery hover:before:translate-y-0 ' +
  '[&_svg]:transition-transform [&_svg]:duration-500 [&_svg]:ease-gallery hover:[&_svg]:translate-x-1 ' +
  'aria-disabled:pointer-events-none aria-disabled:opacity-55';

/* Home buttons: a solid fill that lifts and turns secondary on hover. */
const LIFT =
  'inline-flex min-h-[50px] items-center justify-center gap-2.5 rounded-ui border-[1.5px] border-transparent px-[26px] font-sans text-sm font-semibold tracking-[.02em] cursor-pointer no-underline ' +
  'transition-[transform,background-color,color,border-color,box-shadow] duration-500 ease-gallery hover:-translate-y-0.5 ' +
  '[&_svg]:transition-transform [&_svg]:duration-500 [&_svg]:ease-gallery hover:[&_svg]:translate-x-1 ' +
  'aria-disabled:pointer-events-none aria-disabled:opacity-55';

const VARIANTS = {
  /* inner pages */
  primary: [SLIDE, 'border-0 bg-primary text-on-primary before:bg-secondary hover:text-on-primary'],
  secondary: [SLIDE, 'border border-line bg-transparent text-primary before:bg-primary hover:border-primary hover:text-on-primary'],
  light: [SLIDE, 'border-0 bg-surface text-primary before:bg-secondary hover:text-on-primary'],
  /* home and bands */
  solid: [LIFT, 'bg-primary text-on-primary hover:bg-secondary hover:text-on-primary'],
  ghost: [
    LIFT,
    'bg-transparent text-primary border-line hover:border-primary hover:bg-primary/4 hover:text-primary ' +
      '[.inverse_&]:text-on-primary [.inverse_&]:border-on-primary/50 [.inverse_&]:hover:border-on-primary [.inverse_&]:hover:bg-on-primary/6 [.inverse_&]:hover:text-on-primary',
  ],
  paper: [LIFT, 'bg-surface text-primary hover:bg-secondary hover:text-on-primary'],
};

export default function Button({ to, variant = 'primary', block = false, arrow, className, children, type = 'button', ...props }) {
  const [base, look] = VARIANTS[variant];
  const classes = cx(base, look, block && 'w-full', className);
  const content = (
    <>
      {children}
      {arrow && <Icon name={arrow === true ? 'arrow' : arrow} size={base === LIFT ? 18 : 16} />}
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
