import cx from '@/utils/cx';
import { useBag } from '@/context/BagContext';
import { gsap, canAnimate } from '@/motion/gsap';
import { isAvailable } from '@/data/works';
import Icon from '@/components/ui/Icon';

/* why a work can't go in the cart */
export const cartOffLabel = (w) => (w.status === 'sold' ? 'Sold out' : w.status === 'archived' ? 'Not for sale' : 'Enquire only');

const BASE =
  'mt-3.5 inline-flex min-h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-ui border px-4 font-sans text-sm font-semibold tracking-[.02em] ' +
  'transition-[background-color,color,border-color,transform] duration-400 ease-gallery max-sm:gap-1.5 max-sm:px-2.5 max-sm:text-[13px]';

/* "Add to cart" under a card: fills secondary on hover, turns into a quiet "In your cart" once added,
   and stays disabled (with the reason) for works that aren't for sale */
export default function CartButton({ work, className }) {
  const { bag, add } = useBag();

  if (!isAvailable(work)) {
    return (
      <button
        type="button"
        disabled
        aria-label={`Add to cart is unavailable: ${work.title} is ${cartOffLabel(work)}`}
        className={cx(BASE, 'cursor-not-allowed border-line bg-transparent text-primary opacity-42', className)}
      >
        <Icon name="cart" size={18} strokeWidth={1.6} className="shrink-0" />
        <span>Add to cart</span>
        <span className="font-medium text-muted max-sm:hidden">· {cartOffLabel(work)}</span>
      </button>
    );
  }

  const inCart = bag.includes(work.id);
  const label = inCart ? 'In your cart' : 'Add to cart';
  const onClick = (e) => {
    if (!inCart) add(work.id);
    if (canAnimate()) gsap.fromTo(e.currentTarget, { scale: 0.94 }, { scale: 1, duration: 0.6, ease: 'back.out(3)' });
  };

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={inCart}
      aria-label={`${label}: ${work.title}`}
      className={cx(
        BASE,
        inCart
          ? 'border-success bg-transparent text-success hover:bg-success/6'
          : 'border-primary bg-primary text-on-primary hover:-translate-y-px hover:border-secondary hover:bg-secondary',
        className
      )}
    >
      <Icon name="cart" size={18} strokeWidth={1.6} className="shrink-0" />
      <span>{label}</span>
    </button>
  );
}
