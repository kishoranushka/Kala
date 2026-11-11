import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);
ScrollTrigger.config({ ignoreMobileResize: true });

/* Crawlers and headless renderers (Googlebot's renderer, Bing, link previews, Lighthouse) don't advance
   animation frames, so entrance animations would leave the page blank for them — Google then reports
   a "Soft 404". They get the final, motionless state instead: same content, no motion. */
const CRAWLER =
  /bot\b|bot\/|crawl|spider|slurp|google-inspectiontool|googleother|google-extended|lighthouse|headlesschrome|pagespeed|preview|facebookexternalhit|whatsapp|telegram|embedly|quora link|outbrain|pinterest|vkshare|w3c_validator|redditbot|applebot|yandex|baiduspider|duckduck|perplexity|claude|gptbot|chatgpt|anthropic|ccbot|bytespider/i;
const isCrawler = () =>
  typeof navigator !== 'undefined' && (navigator.webdriver === true || CRAWLER.test(navigator.userAgent || ''));

/* `?still` in the URL renders every page in its final, motionless state (for screenshots and review) */
export const stillFrames = typeof window !== 'undefined' && (/[?&]still\b/.test(window.location.search) || isCrawler());

export const prefersReducedMotion = () =>
  stillFrames || (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches);

/* component-level flourishes (drawers, toasts, pops) only run when motion is welcome */
export const canAnimate = () => !prefersReducedMotion();

export { gsap, ScrollTrigger };
