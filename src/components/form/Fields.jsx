import { forwardRef } from 'react';
import cx from '@/utils/cx';
import Icon from '@/components/ui/Icon';
import Notice from '@/components/ui/Notice';

/* text-base (16px) on purpose: anything smaller makes iOS zoom the page on focus */
const INPUT =
  'w-full min-w-0 max-w-full min-h-12 rounded-ui border border-line bg-surface px-3.5 py-3 font-sans text-base/6 text-primary placeholder:text-muted ' +
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
        'select-chevron max-w-full min-w-0 cursor-pointer text-ellipsis rounded-ui border border-line bg-surface pr-9 pl-3.5 font-sans font-semibold text-primary',
        /* a form select fills its field (a long option can't push it wider) and is 16px on phones (no iOS zoom) */
        tall ? 'min-h-12 w-full text-[15px] max-sm:text-base' : 'min-h-10 text-[13px]',
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
    <div className={cx('flex min-w-0 flex-col gap-2', className)}>
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
    <label className="relative flex min-h-[88px] min-w-0 cursor-pointer flex-col gap-1 rounded-ui border border-line bg-surface py-4 pr-4 pl-12 transition-colors duration-300 ease-gallery hover:border-primary has-checked:border-link has-checked:bg-link-wash has-focus-visible:shadow-focus max-sm:min-h-0 max-sm:gap-0.5 max-sm:py-3.5 max-sm:pl-11">
      <input type="radio" className="absolute top-[18px] left-4 m-0 size-[18px] accent-link max-sm:top-4 max-sm:left-3.5" {...inputProps} />
      <b className="font-display text-[22px]/[26px] font-medium max-sm:text-[19px]/6">{title}</b>
      <span className="text-[13px]/5 text-muted">{children}</span>
    </label>
  );
}

export function ChoiceGrid({ children }) {
  return <div className="grid grid-cols-[repeat(2,minmax(0,1fr))] gap-3 max-sm:grid-cols-1 max-sm:gap-2.5">{children}</div>;
}

export function Checkbox({ children, ...inputProps }) {
  return (
    <label className="flex cursor-pointer items-start gap-3 py-1 text-sm/[22px] text-soft">
      <input type="checkbox" className="mt-0.5 size-[18px] shrink-0 accent-link" {...inputProps} />
      <span className="min-w-0">{children}</span>
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

/* two or three columns that stack on phones. minmax(0, …) so no field can push the row wider than the form.
   Three columns (city · state · PIN) become city on its own line, then state and PIN side by side. */
const ROW_COLS = {
  two: 'grid-cols-[repeat(2,minmax(0,1fr))] max-sm:grid-cols-1',
  three:
    'grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)] max-sm:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] max-sm:gap-x-3 max-sm:[&>:first-child]:col-span-2',
};

export function FieldRow({ cols = 'two', children }) {
  return <div className={cx('grid gap-5', ROW_COLS[cols])}>{children}</div>;
}

/* the submit row under a form: on phones the button goes full width (easy to reach with a thumb) */
export const SUBMIT_ROW = 'flex flex-wrap items-center gap-x-5 gap-y-3 max-sm:flex-col max-sm:items-stretch max-sm:text-center';
