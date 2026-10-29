import { forwardRef, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import cx from '@/utils/cx';
import { NAV_LINKS } from '@/data/site';
import { useBag } from '@/context/BagContext';
import { gsap, canAnimate } from '@/motion/gsap';
import Icon from '@/components/ui/Icon';
import Wordmark from './Wordmark';

const NAV_LINK =
  'py-3 text-ink hover:text-ink bg-[image:linear-gradient(#22211F,#22211F)] bg-no-repeat bg-[position:100%_100%] bg-[length:0%_1px] ' +
  'transition-[background-size] duration-600 ease-gallery hover:bg-[position:0%_100%] hover:bg-[length:100%_1px] ' +
  'aria-[current=page]:bg-[position:0%_100%] aria-[current=page]:bg-[length:100%_1px]';

const BAG_BTN = 'inline-flex h-11 cursor-pointer items-center gap-2 rounded-[2px] border-0 bg-transparent px-3 font-sans text-sm text-ink hover:text-ink';

function BagCount({ count }) {
  const ref = useRef(null);
  const previous = useRef(count);

  /* the badge hops when something new lands in the bag */
  useEffect(() => {
    if (count > previous.current && canAnimate()) gsap.fromTo(ref.current, { scale: 1.6 }, { scale: 1, duration: 0.8, ease: 'back.out(3)' });
    previous.current = count;
  }, [count]);

  return (
    <span ref={ref} className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-ink px-1.5 text-[11px] font-bold text-paper tabular-nums">
      {count}
    </span>
  );
}

/* bag control varies by page: Home names the order page, the viewing room opens the drawer,
   the order page jumps to its picker, everywhere else links to the order page with a count */
function BagControl({ mode }) {
  const { bag, openDrawer } = useBag();
  const icon = <Icon name="bag" />;

  if (mode === 'order-link') {
    return (
      <Link to="/order" data-magnetic aria-label="Your order" className={cx(BAG_BTN, 'font-semibold')}>
        {icon}
        <span>Order</span>
      </Link>
    );
  }
  if (mode === 'drawer') {
    return (
      <button type="button" data-magnetic data-bag-btn onClick={openDrawer} aria-label={`Bag, ${bag.length} items`} aria-haspopup="dialog" className={cx(BAG_BTN, 'font-medium')}>
        {icon}
        <BagCount count={bag.length} />
      </button>
    );
  }
  const anchor = mode === 'anchor';
  const Tag = anchor ? 'a' : Link;
  return (
    <Tag
      {...(anchor ? { href: '#choose' } : { to: '/order' })}
      data-magnetic
      aria-label={anchor ? `Your order, ${bag.length} works` : `Bag, ${bag.length} items`}
      className={cx(BAG_BTN, 'font-medium')}
    >
      {icon}
      <BagCount count={bag.length} />
    </Tag>
  );
}

const Header = forwardRef(function Header({ current, bagMode = 'link', isHome = false, menuOpen, onMenu }, menuButtonRef) {
  return (
    <header data-header className="sticky top-0 z-50 border-b border-[rgba(229,224,216,0)] bg-ivory">
      <div className="wrap flex h-[76px] items-center justify-between gap-8 max-sm:h-[60px]">
        <Wordmark to={isHome ? '#top' : '/'} />
        <nav aria-label="Primary" className="flex gap-8 text-sm/5 font-medium tracking-[.01em] max-wide:gap-5 max-nav:hidden">
          {NAV_LINKS.map((link) => (
            <Link key={link.key} to={link.to} aria-current={current === link.key ? 'page' : undefined} className={NAV_LINK}>
              {link.label}
            </Link>
          ))}
        </nav>
        <div className={cx('flex items-center', isHome ? 'gap-2' : 'gap-1')}>
          <BagControl mode={bagMode} />
          <button
            ref={menuButtonRef}
            type="button"
            onClick={onMenu}
            aria-expanded={menuOpen}
            aria-controls="kala-menu"
            className="hidden h-11 cursor-pointer items-center gap-2.5 border-0 bg-transparent pr-1 pl-3 font-sans text-sm font-semibold tracking-[.02em] text-ink max-nav:inline-flex"
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
