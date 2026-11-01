import { useLayoutEffect, useRef } from 'react';
import { gsap, canAnimate } from '@/motion/gsap';
import Icon from './Icon';

/* a short confirmation that rises from the bottom of the screen */
export default function Toast({ children, action, onAction }) {
  const ref = useRef(null);

  useLayoutEffect(() => {
    if (canAnimate()) gsap.fromTo(ref.current, { y: 40, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.7, ease: 'expo.out' });
  }, []);

  return (
    <div
      ref={ref}
      role="status"
      className="fixed bottom-7 left-1/2 z-85 flex max-w-[calc(100%-32px)] -translate-x-1/2 items-center gap-4 rounded-ui bg-primary py-3 pr-3 pl-[18px] text-sm/[22px] text-on-primary shadow-[0_12px_32px_-10px_rgba(34,33,31,.4)] max-sm:bottom-4"
    >
      <Icon name="check" strokeWidth={1.75} className="text-[#7FC59B]" />
      <span>{children}</span>
      {action && (
        <button type="button" onClick={onAction} className="inline-flex h-11 cursor-pointer items-center border-0 bg-transparent px-2.5 font-sans text-sm font-semibold text-on-primary underline underline-offset-[3px]">
          {action}
        </button>
      )}
    </div>
  );
}
