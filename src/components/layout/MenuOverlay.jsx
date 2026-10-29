import { useLayoutEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import cx from '@/utils/cx';
import { CONTACT, NAV_LINKS } from '@/data/site';
import { gsap, canAnimate } from '@/motion/gsap';
import { useDialogKeys } from '@/hooks/useDialogKeys';
import { useScrollLock } from '@/hooks/useScrollLock';
import { RingMandala } from '@/components/mandala/Mandala';
import Button from '@/components/ui/Button';
import Icon from '@/components/ui/Icon';
import SmartLink from '@/components/ui/SmartLink';
import { pad2 } from '@/data/works';
import Wordmark from './Wordmark';

/* the menu opens as a circle growing from the Menu button */
const geometry = () => ({ at: `${window.innerWidth - 44}px 30px`, r: Math.hypot(window.innerWidth, window.innerHeight) + 40 });

export default function MenuOverlay({ open, instantClose, onClose, current, isHome, menuButtonRef }) {
  const menuRef = useRef(null);
  const closeRef = useRef(null);
  const timeline = useRef(null);
  const onKeyDown = useDialogKeys(() => onClose(false));
  useScrollLock(open);

  useLayoutEffect(() => {
    const menu = menuRef.current;
    const parts = () => menu.querySelectorAll('.menu-list .li, [data-menu-num], [data-menu-fade]');
    timeline.current?.kill();

    if (open) {
      menu.style.visibility = 'visible';
      if (canAnimate()) {
        const g = geometry();
        timeline.current = gsap
          .timeline()
          .fromTo(menu, { clipPath: `circle(0px at ${g.at})` }, { clipPath: `circle(${g.r}px at ${g.at})`, duration: 1, ease: 'expo.inOut', clearProps: 'clipPath' })
          .fromTo(menu.querySelectorAll('.menu-list .li'), { yPercent: 115 }, { yPercent: 0, duration: 1.1, stagger: 0.06, ease: 'expo.out' }, 0.35)
          .fromTo(menu.querySelectorAll('[data-menu-num], [data-menu-fade]'), { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.05, ease: 'expo.out' }, 0.55);
      }
      const t = setTimeout(() => closeRef.current?.focus(), 60);
      return () => clearTimeout(t);
    }

    if (menu.style.visibility !== 'visible') return;
    const instant = instantClose.current;
    instantClose.current = false;
    const done = () => {
      menu.style.visibility = 'hidden';
      gsap.set(menu, { clearProps: 'clipPath' });
      gsap.set(parts(), { clearProps: 'all' });
    };
    const refocus = () => menuButtonRef.current?.offsetParent && menuButtonRef.current.focus();
    if (instant || !canAnimate()) {
      done();
      if (!instant) refocus();
      return;
    }
    const g = geometry();
    timeline.current = gsap
      .timeline({ onComplete: () => { done(); refocus(); } })
      .to(menu.querySelectorAll('.menu-list .li'), { yPercent: -115, duration: 0.5, stagger: 0.03, ease: 'expo.in' })
      .to(menu.querySelectorAll('[data-menu-num], [data-menu-fade]'), { autoAlpha: 0, duration: 0.3 }, 0)
      .fromTo(menu, { clipPath: `circle(${g.r}px at ${g.at})` }, { clipPath: `circle(0px at ${g.at})`, duration: 0.8, ease: 'expo.inOut' }, 0.25);
  }, [open, instantClose, menuButtonRef]);

  /* following a link closes the menu at once (the curtain covers the change) */
  const closeNow = () => onClose(true);

  return (
    <div
      id="kala-menu"
      ref={menuRef}
      role="dialog"
      aria-modal="true"
      aria-label="Menu"
      onKeyDown={onKeyDown}
      className="inverse invisible fixed inset-0 z-80 flex flex-col overflow-x-hidden overflow-y-auto overscroll-contain bg-chapter text-paper"
    >
      <RingMandala spin={140} className="absolute -right-[260px] -bottom-[260px] w-[760px] opacity-[.12]" />

      <div className="wrap relative flex h-[76px] items-center justify-between gap-6 max-sm:h-[60px]">
        <Wordmark inverse to={isHome ? '#top' : '/'} />
        <button
          ref={closeRef}
          type="button"
          onClick={() => onClose(false)}
          className="inline-flex h-11 cursor-pointer items-center gap-2.5 border-0 bg-transparent pr-1 pl-3 font-sans text-sm font-semibold tracking-[.02em] text-paper"
        >
          Close
          <Icon name="close" />
        </button>
      </div>

      <nav className="wrap relative" aria-label="Site">
        <ol className="menu-list m-0 list-none p-0 pt-[clamp(24px,5vh,64px)]">
          {NAV_LINKS.map((link, i) => (
            <li key={link.key} className="border-b border-[rgba(255,254,250,.14)]">
              <Link
                to={link.to}
                onClick={closeNow}
                aria-current={current === link.key ? 'page' : undefined}
                className="group flex items-baseline gap-5 py-3 font-display text-[clamp(40px,8vw,88px)]/[1.05] font-light text-paper no-underline hover:text-on-inverse-muted max-sm:py-2.5 max-sm:text-[clamp(38px,11vw,56px)]"
              >
                <span data-menu-num className="min-w-7 shrink-0 font-sans text-xs leading-none font-semibold tracking-[.06em] text-on-inverse-muted">
                  {pad2(i + 1)}
                </span>
                <span className="lm">
                  <span className={cx('li transition-transform duration-600 ease-gallery group-hover:italic', link.italicInMenu && 'italic')}>{link.label}</span>
                </span>
              </Link>
            </li>
          ))}
        </ol>
      </nav>

      <div className="wrap relative mt-auto flex flex-wrap items-center justify-between gap-x-8 gap-y-5 py-10 max-sm:py-8">
        <Button variant="light" to={isHome ? '#commission' : '/commission'} onClick={closeNow} arrow={isHome} data-menu-fade data-cursor="talk">
          Start a Commission
        </Button>
        <div data-menu-fade className="flex flex-wrap gap-x-6 gap-y-1 text-sm/[22px]">
          <SmartLink to={isHome ? '#commission' : '/contact'} onClick={closeNow} className="inline-flex min-h-11 items-center text-on-inverse-muted underline">
            {CONTACT.email}
          </SmartLink>
          <a href="#top" onClick={closeNow} className="inline-flex min-h-11 items-center text-on-inverse-muted underline">
            Instagram · {CONTACT.instagram}
          </a>
        </div>
      </div>
    </div>
  );
}
