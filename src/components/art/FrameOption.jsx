import cx from '@/utils/cx';
import { formatINR } from '@/data/works';
import { FRAME_LABEL, frameOf, framePrice } from '@/data/shipping';
import { useBag } from '@/context/BagContext';

/* "Frame it for me (+ ₹120)" — only for unframed paintings that offer a frame (see src/data/shipping.js).
   The choice is kept with the cart, so it is the same on the artwork page, in the drawer and at checkout.
   `disabled` freezes it (e.g. while paying). */
export default function FrameOption({ work, disabled = false, className }) {
  const { framed, setFramed } = useBag();
  const size = frameOf(work);
  if (!size) return null;
  const on = framed.includes(work.id);
  return (
    <label className={cx('flex cursor-pointer items-start gap-2.5 text-[13px]/5 text-soft has-disabled:cursor-not-allowed has-disabled:opacity-60', className)}>
      <input
        type="checkbox"
        checked={on}
        disabled={disabled}
        onChange={(e) => setFramed(work.id, e.target.checked)}
        className="mt-px size-[17px] shrink-0 accent-link"
      />
      <span className="min-w-0">
        <span className="font-semibold text-primary">Frame it for me</span> (+ {formatINR(framePrice(work))})
        <span className="block text-[12px]/[18px] text-muted">{FRAME_LABEL[size]}, framed before it ships. Optional.</span>
      </span>
    </label>
  );
}
