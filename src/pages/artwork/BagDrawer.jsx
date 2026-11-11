import { useCallback, useEffect, useLayoutEffect, useRef } from 'react';
import { getWork, metaLine } from '@/data/works';
import { useBag } from '@/context/BagContext';
import { gsap, canAnimate } from '@/motion/gsap';
import { useDialogKeys } from '@/hooks/useDialogKeys';
import { useScrollLock } from '@/hooks/useScrollLock';
import Button from '@/components/ui/Button';
import Icon from '@/components/ui/Icon';
import Notice from '@/components/ui/Notice';
import TextLink from '@/components/ui/TextLink';

/* the cart slides in from the right; the originals inside settle one after another */
export default function BagDrawer() {
  const { bag, remove, drawerOpen, closeDrawer } = useBag();
  const drawerRef = useRef(null);
  const scrimRef = useRef(null);
  const closeRef = useRef(null);
  useScrollLock(drawerOpen);

  /* leaving the page never leaves the drawer open behind it */
  useEffect(() => closeDrawer, [closeDrawer]);

  useLayoutEffect(() => {
    if (!drawerOpen) return;
    if (canAnimate()) {
      gsap.fromTo(drawerRef.current, { xPercent: 100 }, { xPercent: 0, duration: 0.8, ease: 'expo.out' });
      gsap.fromTo(scrimRef.current, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.5 });
      gsap.fromTo(drawerRef.current.querySelectorAll('[data-bag-item]'), { x: 40, autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: 0.9, stagger: 0.06, delay: 0.2, ease: 'expo.out' });
    }
    const t = setTimeout(() => closeRef.current?.focus(), 50);
    return () => clearTimeout(t);
  }, [drawerOpen]);

  const close = useCallback(() => {
    const done = () => {
      closeDrawer();
      document.querySelector('[data-bag-btn]')?.focus();
    };
    if (!canAnimate()) return done();
    gsap.to(drawerRef.current, { xPercent: 100, duration: 0.6, ease: 'expo.in' });
    gsap.to(scrimRef.current, { autoAlpha: 0, duration: 0.6, onComplete: done });
  }, [closeDrawer]);
  const onKeyDown = useDialogKeys(close);

  if (!drawerOpen) return null;
  const items = bag.map(getWork).filter(Boolean);

  return (
    <>
      <div ref={scrimRef} onClick={close} className="fixed inset-0 z-69 bg-[rgba(22,21,19,.72)]" />
      <div
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="bag-h"
        onKeyDown={onKeyDown}
        className="fixed top-0 right-0 bottom-0 z-70 flex w-[min(440px,100%)] flex-col overflow-y-auto rounded-l-ui bg-surface shadow-pop"
      >
        <div className="flex items-center justify-between border-b border-divider px-6 py-5">
          <h2 id="bag-h" className="art-title">
            Your cart <span className="meta font-sans">· {items.length}</span>
          </h2>
          <button
            ref={closeRef}
            type="button"
            onClick={close}
            aria-label="Close bag"
            className="inline-flex h-11 min-w-11 cursor-pointer items-center justify-center border-0 bg-transparent px-2.5 text-primary"
          >
            <Icon name="close" />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-col items-start gap-4 px-6 py-12">
            <p className="font-display text-[30px]/9 font-light">
              Your cart is <span className="italic">empty.</span>
            </p>
            <p className="meta">Originals you add will wait here.</p>
            <Button variant="secondary" to="/shop">
              Explore the Art
            </Button>
          </div>
        ) : (
          <>
            {items.map((w) => (
              <div key={w.id} data-bag-item className="grid grid-cols-[72px_1fr_auto] items-start gap-4 border-b border-divider px-6 py-5">
                <span className="relative h-[90px] w-[72px] overflow-hidden rounded-ui bg-wall">
                  <img src={w.img} alt="" loading="lazy" className={w.crop ? 'crop-ig object-cover' : 'block size-full object-cover'} />
                </span>
                <span className="flex flex-col gap-1">
                  <span className="font-display text-xl/6 font-medium">{w.title}</span>
                  <span className="meta">{metaLine(w)}</span>
                  <span className="meta">Original · quantity 1</span>
                </span>
                <span className="flex flex-col items-end gap-2">
                  <span className="price">{w.price}</span>
                  <button type="button" onClick={() => remove(w.id)} className="h-8 cursor-pointer border-0 bg-transparent p-0 font-sans text-[13px] font-semibold text-link">
                    Remove
                  </button>
                </span>
              </div>
            ))}
            <div className="mt-auto flex flex-col gap-4 border-t border-divider p-6">
              <div className="flex justify-between text-sm">
                <span className="font-semibold">Subtotal</span>
                <span className="meta">Calculated at checkout</span>
              </div>
              <Notice tone="info">You pay securely on the order page with UPI (scan a QR code), card or netbanking, through Razorpay.</Notice>
              <Button to="/order" block data-cursor="explore">
                Continue to Order
              </Button>
              <TextLink to="/shop" className="self-start">
                Continue browsing
              </TextLink>
            </div>
          </>
        )}
      </div>
    </>
  );
}
