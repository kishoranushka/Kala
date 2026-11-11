import { forwardRef, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { NAV_LINKS } from '@/data/site';
import { useBag } from '@/context/BagContext';
import { gsap, canAnimate } from '@/motion/gsap';
import Icon from '@/components/ui/Icon';
import Wordmark from './Wordmark';

const NAV_LINK =
  'py-3 text-primary no-underline hover:text-primary bg-[image:linear-gradient(currentColor,currentColor)] bg-no-repeat bg-[position:100%_100%] bg-[length:0%_1px] ' +
  'transition-[background-size] duration-600 ease-gallery hover:bg-[position:0%_100%] hover:bg-[length:100%_1px] ' +
  'aria-[current=page]:bg-[position:0%_100%] aria-[current=page]:bg-[length:100%_1px]';

function CartCount({ count }) {
  const ref = useRef(null);
  const previous = useRef(count);

  /* the badge hops when something new lands in the cart */
  useEffect(() => {
    if (count > previous.current && canAnimate()) gsap.fromTo(ref.current, { scale: 1.6 }, { scale: 1, duration: 0.7, ease: 'back.out(3)' });
    previous.current = count;
  }, [count]);

  return (
    <span ref={ref} className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-[11px] font-bold text-on-primary tabular-nums">
      {count}
    </span>
  );
}

const Header = forwardRef(function Header({ current, isHome = false, menuOpen, onMenu }, menuButtonRef) {
  const { bag } = useBag();
  return (
    <header data-header className="sticky top-0 z-50 bg-page shadow-[0_1px_0_transparent] transition-shadow duration-500 [&.is-scrolled]:shadow-[0_1px_0_var(--color-divider)]">
      <div className="wrap flex h-[76px] items-center justify-between gap-8 max-sm:h-[60px] max-sm:gap-3">
        <Wordmark to={isHome ? '#top' : '/'} withName />
        <nav aria-label="Primary" className="flex gap-8 text-sm/5 font-medium tracking-[.01em] max-wide:gap-5 max-nav:hidden">
          {NAV_LINKS.map((link) => (
            <Link key={link.key} to={link.to} aria-current={current === link.key ? 'page' : undefined} className={NAV_LINK}>
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex shrink-0 items-center gap-1">
          <Link
            to="/order"
            data-magnetic
            aria-label={`Cart, ${bag.length} items`}
            className="inline-flex h-11 items-center gap-2 rounded-ui px-3 max-sm:px-2 font-sans text-sm font-medium text-primary no-underline hover:text-primary"
          >
            <Icon name="cart" strokeWidth={1.6} />
            <CartCount count={bag.length} />
          </Link>
          <button
            ref={menuButtonRef}
            type="button"
            onClick={onMenu}
            aria-expanded={menuOpen}
            aria-controls="kala-menu"
            className="hidden h-11 cursor-pointer items-center gap-2.5 border-0 bg-transparent pr-1 pl-3 font-sans text-sm font-semibold tracking-[.02em] text-primary max-nav:inline-flex"
          >
            Menu
            <Icon name="menu" />
          </button>
        </div>
      </div>
    </header>
  );
});

export default Header;
