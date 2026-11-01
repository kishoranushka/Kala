import { useCallback, useLayoutEffect, useRef } from 'react';
import { gsap, canAnimate } from '@/motion/gsap';
import { useDialogKeys } from '@/hooks/useDialogKeys';
import { useScrollLock } from '@/hooks/useScrollLock';
import Icon from '@/components/ui/Icon';

/* the whole painting on black, as large as the screen allows */
export default function FullscreenViewer({ work, onClose }) {
  const ref = useRef(null);
  const closeRef = useRef(null);
  useScrollLock(true);

  useLayoutEffect(() => {
    if (canAnimate()) {
      gsap.fromTo(ref.current, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.5 });
      gsap.fromTo(ref.current.querySelector('img'), { scale: 0.92 }, { scale: 1, duration: 1, ease: 'expo.out' });
    }
    const t = setTimeout(() => closeRef.current?.focus(), 50);
    return () => clearTimeout(t);
  }, []);

  const close = useCallback(() => {
    if (!canAnimate()) return onClose();
    gsap.to(ref.current, { autoAlpha: 0, duration: 0.4, onComplete: onClose });
  }, [onClose]);
  const onKeyDown = useDialogKeys(close);

  return (
    <div
      ref={ref}
      role="dialog"
      aria-modal="true"
      aria-label={`${work.title}, full screen`}
      onKeyDown={onKeyDown}
      className="inverse fixed inset-0 z-80 flex items-center justify-center bg-[#0E0D0C] px-6 pt-[72px] pb-14"
    >
      <img src={work.img} alt={work.alt} className="max-h-full max-w-full object-contain" />
      <button
        ref={closeRef}
        type="button"
        onClick={close}
        className="absolute top-4 right-4 inline-flex h-11 cursor-pointer items-center gap-2 border-0 bg-transparent px-2.5 font-sans text-sm font-semibold text-on-primary"
      >
        Close <Icon name="close" />
      </button>
      <p className="meta absolute bottom-4 left-6 text-on-primary-muted!">{work.title} · Colours may vary slightly on screen.</p>
    </div>
  );
}
