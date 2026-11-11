import { useEffect, useRef } from 'react';
import cx from '@/utils/cx';
import { gsap, canAnimate } from '@/motion/gsap';

/* the thank-you panel that replaces a form; takes focus and settles in line by line */
export default function FormSuccess({ eyebrow = 'Message sent', name, titleClassName, className, children }) {
  const ref = useRef(null);

  useEffect(() => {
    const panel = ref.current;
    panel.focus();
    if (canAnimate()) gsap.fromTo(panel.children, { y: 24, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.9, stagger: 0.07, ease: 'expo.out', clearProps: 'all' });
  }, []);

  return (
    <div ref={ref} role="status" tabIndex={-1} className={cx('flex flex-col outline-none', className)}>
      <p className="eyebrow text-success!">{eyebrow}</p>
      <h2 className={cx('font-display font-light', titleClassName)}>
        Thank you, <span className="italic">{name}.</span>
      </h2>
      {children}
    </div>
  );
}
