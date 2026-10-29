import cx from '@/utils/cx';
import Icon from './Icon';
import SmartLink from './SmartLink';

const BASE =
  'inline-flex min-h-11 items-center gap-2 border-0 border-b bg-transparent px-0 py-3 font-sans text-sm font-semibold tracking-[.02em] cursor-pointer ' +
  'transition-[color,border-color] duration-400 ease-gallery ' +
  '[&_svg]:transition-transform [&_svg]:duration-500 [&_svg]:ease-gallery hover:[&_svg]:translate-x-[5px]';

const TONES = {
  ink: 'border-ink text-ink hover:border-cobalt hover:text-cobalt',
  inverse: 'border-paper text-paper hover:border-paper hover:text-paper',
};

/* underlined text link with an optional arrow; renders a button when given onClick and no `to` */
export default function TextLink({ to, arrow = false, tone = 'ink', className, children, ...props }) {
  const classes = cx(BASE, TONES[tone], className);
  const content = (
    <>
      {children}
      {arrow && <Icon name="arrow" size={16} />}
    </>
  );

  if (!to) {
    return (
      <button type="button" className={classes} {...props}>
        {content}
      </button>
    );
  }
  return (
    <SmartLink to={to} className={classes} {...props}>
      {content}
    </SmartLink>
  );
}
