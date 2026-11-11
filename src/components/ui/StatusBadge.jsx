import cx from '@/utils/cx';
import { STATUS, statusLabel } from '@/data/works';

/* every status pairs a word with a shape, never colour alone */
const MARKERS = {
  available: 'rounded-full bg-current',
  sold: 'rounded-full border-[1.5px] border-current',
  archived: 'border-[1.5px] border-current',
  inquiry: 'rotate-45 scale-[.85] bg-current',
};

const TONES = {
  available: 'text-success',
  sold: 'text-muted',
  archived: 'text-muted',
  inquiry: 'text-link',
};

/* pass `work` (preferred: archived works get their own wording) or just a `status`.
   `leading` — 20px by default; Home's captions let it inherit their 26px rhythm */
export default function StatusBadge({ work, status = work?.status, tone, marker = true, suffix, leading = 'leading-5', className }) {
  return (
    <span className={cx('inline-flex items-center gap-[7px] text-[13px] font-semibold', leading, tone ?? TONES[status], className)}>
      {marker && <span aria-hidden="true" className={cx('size-2 shrink-0', MARKERS[status])} />}
      {work ? statusLabel(work) : STATUS[status].label}
      {suffix}
    </span>
  );
}
