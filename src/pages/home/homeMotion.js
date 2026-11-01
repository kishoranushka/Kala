/* Home's own choreography, layered onto the shared timeline (see createMotion ctx).
   The hero breathes: the mandala blooms open once, then turns too slowly to notice. */
export function homeMotion({ gsap, ScrollTrigger, one, all, on, d, H, canScroll }) {
  const hero = one('[data-hero]');
  if (!hero) return;
  const at = Math.max(H, 0);

  gsap.from(hero.querySelectorAll('[data-ml]'), { autoAlpha: 0, scale: 0.84, svgOrigin: '0 0', duration: 2.6, ease: 'power3.out', stagger: { each: 0.1, from: 'end' }, delay: at + 0.1 });
  gsap.from(all('[data-piece]'), { autoAlpha: 0, y: 36, duration: 1.6, ease: 'power3.out', stagger: 0.14, delay: at + 0.5 });
  all('[data-float]').forEach((el, i) => {
    gsap.to(el, { y: i % 2 ? 7 : -9, duration: 4.6 + i * 0.7, yoyo: true, repeat: -1, ease: 'sine.inOut', delay: at + 2 + i * 0.3 });
  });

  /* the bloom drifts away from the pointer, the paintings lean toward it */
  if (d.fine) {
    const mv = one('[data-mandala-move]');
    const pm = one('[data-piece-move]');
    const mx = gsap.quickTo(mv, 'x', { duration: 2.2, ease: 'power2.out' });
    const my = gsap.quickTo(mv, 'y', { duration: 2.2, ease: 'power2.out' });
    const px = gsap.quickTo(pm, 'x', { duration: 1.8, ease: 'power2.out' });
    const py = gsap.quickTo(pm, 'y', { duration: 1.8, ease: 'power2.out' });
    on(hero, 'pointermove', (e) => {
      const b = hero.getBoundingClientRect();
      const dx = (e.clientX - b.left) / b.width - 0.5;
      const dy = (e.clientY - b.top) / b.height - 0.5;
      mx(-dx * 18);
      my(-dy * 14);
      px(dx * 10);
      py(dy * 8);
    });
    on(hero, 'pointerleave', () => {
      mx(0);
      my(0);
      px(0);
      py(0);
    });
  }

  if (canScroll && ScrollTrigger) {
    gsap.to(one('[data-mandala-scroll]'), { rotation: 16, scale: 1.05, ease: 'none', scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: 1.2 } });
  }
}
