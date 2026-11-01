import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);
ScrollTrigger.config({ ignoreMobileResize: true });

/* `?still` in the URL renders every page in its final, motionless state (for screenshots and review) */
export const stillFrames = typeof window !== 'undefined' && /[?&]still\b/.test(window.location.search);

export const prefersReducedMotion = () =>
  stillFrames || (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches);

/* component-level flourishes (drawers, toasts, pops) only run when motion is welcome */
export const canAnimate = () => !prefersReducedMotion();

export { gsap, ScrollTrigger };
