import { forwardRef } from 'react';
import cx from '@/utils/cx';
import Icon from '@/components/ui/Icon';
import Notice from '@/components/ui/Notice';

const INPUT =
  'w-full min-h-12 rounded-ui border border-line bg-surface px-3.5 py-3 font-sans text-base/6 text-primary ' +
  'transition-[border-color,box-shadow] duration-300 ease-gallery focus:border-link focus:shadow-focus focus:outline-none aria-[invalid=true]:border-error';

export const Input = forwardRef(function Input({ className, ...props }, ref) {
  return <input ref={ref} className={cx(INPUT, className)} {...props} />;
});

export function Textarea({ className, ...props }) {
  return <textarea className={cx(INPUT, 'min-h-[140px] resize-y', className)} {...props} />;
}

/* compact (filters) or tall (forms) select with the KALA chevron */
export function Select({ tall = false, className, children, ...props }) {
  return (
    <select
      className={cx(
        'select-chevron cursor-pointer rounded-ui border border-line bg-surface pr-9 pl-3.5 font-sans font-semibold text-primary',
        tall ? 'min-h-12 text-[15px]' : 'min-h-10 text-[13px]',
        className
      )}
      {...props}
    >
      {children}
    </select>
  );
}

export function FieldError({ children, className, ...props }) {
  if (!children) return null;
  return (
    <p className={cx('flex items-start gap-2 text-[13px]/5 font-semibold text-error', className)} {...props}>
      {children}
    </p>
  );
}

/* label · optional hint · control · error */
export function Field({ id, label, hint, error, className, children }) {
  return (
    <div className={cx('flex flex-col gap-2', className)}>
      <label htmlFor={id} className="text-[13px]/5 font-semibold text-primary">
        {label}
      </label>
      {hint && (
        <span id={`${id}-hint`} className="text-xs/[18px] text-muted">
          {hint}
        </span>
      )}
      {children}
      <FieldError id={`${id}-error`}>{error}</FieldError>
    </div>
  );
}

/* aria wiring for a control inside <Field> */
export const describe = (id, { hint, error } = {}) => ({
  id,
  'aria-invalid': error ? true : undefined,
  'aria-describedby': [hint && `${id}-hint`, error && `${id}-error`].filter(Boolean).join(' ') || undefined,
});

/* a large radio tile; tinted cobalt when chosen */
export function ChoiceCard({ title, children, ...inputProps }) {
  return (
    <label className="relative flex min-h-[88px] cursor-pointer flex-col gap-1 rounded-ui border border-line bg-surface py-4 pr-4 pl-12 transition-colors duration-300 ease-gallery hover:border-primary has-checked:border-link has-checked:bg-link-wash has-focus-visible:shadow-focus">
      <input type="radio" className="absolute top-[18px] left-4 m-0 size-[18px] accent-link" {...inputProps} />
      <b className="font-display text-[22px]/[26px] font-medium">{title}</b>
      <span className="text-[13px]/5 text-muted">{children}</span>
    </label>
  );
}

export function ChoiceGrid({ children }) {
  return <div className="grid grid-cols-2 gap-3 max-sm:grid-cols-1">{children}</div>;
}

export function Checkbox({ children, ...inputProps }) {
  return (
    <label className="flex cursor-pointer items-start gap-3 text-sm/[22px] text-soft">
      <input type="checkbox" className="mt-0.5 size-[18px] shrink-0 accent-link" {...inputProps} />
      <span>{children}</span>
    </label>
  );
}

/* "N things need a quick fix" banner above a form */
export function ErrorSummary({ count, suffix = ' before this can go.' }) {
  if (!count) return null;
  return (
    <Notice tone="error" role="alert">
      {count === 1 ? 'One thing needs' : `${count} things need`} a quick fix{suffix}
    </Notice>
  );
}

export function ErrorIcon() {
  return <Icon name="alert" size={16} strokeWidth={2} className="mt-0.5 shrink-0" />;
}

/* two or three columns that stack on phones */
export function FieldRow({ cols = 'two', children }) {
  return <div className={cx('grid gap-5 max-sm:grid-cols-1', cols === 'three' ? 'grid-cols-[2fr_1fr_1fr]' : 'grid-cols-2')}>{children}</div>;
}
