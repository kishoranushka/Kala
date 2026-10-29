import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);
ScrollTrigger.config({ ignoreMobileResize: true });

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* component-level flourishes (drawers, toasts, pops) only run when motion is welcome */
export const canAnimate = () => !prefersReducedMotion();

export { gsap, ScrollTrigger };
