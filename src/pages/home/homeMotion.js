/* Home's own choreography, layered onto the shared timeline (see createMotion ctx). */
export function homeMotion({ gsap, one, all, on, d, tl, H, canScroll }) {
  /* the unfolding canvas */
  tl.from(one('[data-h-mandala]'), { scale: 0.5, autoAlpha: 0, duration: 2.8 }, H - 0.4)
    .from(one('[data-h-panel]'), { scaleX: 0, transformOrigin: '100% 50%', duration: 1.5, ease: 'expo.inOut' }, H - 0.25)
    .fromTo(one('[data-h-canvas]'), { clipPath: 'circle(0% at 50% 50%)' }, { clipPath: 'circle(75% at 50% 50%)', duration: 1.8, ease: 'expo.inOut', clearProps: 'clipPath' }, H)
    .from(one('[data-h-canvas] img'), { scale: 1.45, rotation: -12, transformOrigin: '50% 50%', duration: 2.4, clearProps: 'transform' }, H)
    .from(one('[data-h-eyebrow]'), { autoAlpha: 0, letterSpacing: '.6em', duration: 1.6 }, H + 0.1)
    .from(all('[data-hero] .li'), { yPercent: 118, rotation: 5, transformOrigin: '0% 100%', duration: 1.6, stagger: 0.12 }, H + 0.15)
    .from(all('[data-h-fade]'), { y: 30, autoAlpha: 0, duration: 1.3, stagger: 0.1 }, H + 0.75)
    .from(all('[data-h-under] > *'), { y: 22, autoAlpha: 0, duration: 1.1, stagger: 0.1 }, H + 1.1)
    .from(one('[data-h-vert]'), { y: 60, autoAlpha: 0, duration: 1.3 }, H + 1);

  const cue = one('[data-cue]');
  if (cue) {
    gsap
      .timeline({ repeat: -1, delay: H + 1.6, repeatDelay: 0.3 })
      .fromTo(cue, { scaleY: 0, transformOrigin: '50% 0%' }, { scaleY: 1, duration: 0.9, ease: 'expo.inOut' })
      .to(cue, { scaleY: 0, transformOrigin: '50% 100%', duration: 0.9, ease: 'expo.inOut' }, '+=0.2');
  }

  /* the hero canvas tilts toward the pointer */
  const canvas = one('[data-h-canvas]');
  const hero = one('[data-hero]');
  if (d.fine && canvas && hero) {
    gsap.set(canvas, { transformPerspective: 1200 });
    const rX = gsap.quickTo(canvas, 'rotationX', { duration: 1, ease: 'power3' });
    const rY = gsap.quickTo(canvas, 'rotationY', { duration: 1, ease: 'power3' });
    on(hero, 'pointermove', (e) => {
      const r = hero.getBoundingClientRect();
      rY(((e.clientX - r.left) / r.width - 0.5) * 12);
      rX(-((e.clientY - r.top) / r.height - 0.5) * 9);
    });
    on(hero, 'pointerleave', () => { rX(0); rY(0); });
  }

  if (!canScroll) return;
  const scrub = (trigger, start = 'top bottom', end = 'bottom top') => ({ trigger, start, end, scrub: true });

  if (d.desktop && hero) {
    gsap.to(one('[data-h-art]'), { y: -140, ease: 'none', scrollTrigger: scrub(hero, 'top top') });
    gsap.to(one('[data-h-copy]'), { y: 90, autoAlpha: 0.15, ease: 'none', scrollTrigger: scrub(hero, 'top top') });
    gsap.to(one('[data-h-mandala]'), { rotation: 75, ease: 'none', scrollTrigger: scrub(hero, 'top top') });
  }

  /* inside the pattern: the mandala unfolds petal by petal as it turns into place */
  const pattern = one('#pattern');
  const pm = one('[data-pat-mandala]');
  if (pattern && pm) {
    gsap
      .timeline({ scrollTrigger: { trigger: pattern, start: 'top bottom', end: 'bottom top', scrub: 1 } })
      .fromTo(pm, { rotation: -140, scale: 0.68 }, { rotation: 0, scale: 1, duration: 1, ease: 'none' })
      .to(pm, { rotation: 40, duration: 1, ease: 'none' });
    const petals = all('[data-petal]');
    const half = petals.length / 2;
    gsap
      .timeline({ scrollTrigger: { trigger: pattern, start: 'top 75%', end: 'center 55%', scrub: 1 } })
      .from(petals.slice(0, half), { autoAlpha: 0, stagger: 0.06, duration: 0.3 }, 0)
      .from(petals.slice(half), { autoAlpha: 0, stagger: 0.06, duration: 0.3 }, 0)
      .from(all('[data-petal2]'), { autoAlpha: 0, stagger: 0.025, duration: 0.25 }, 0.3);
    all('[data-pat-label]').forEach((label, i) => {
      const lt = gsap.timeline({ scrollTrigger: { trigger: pattern, start: `top ${55 - i * 8}%`, once: true } });
      lt.from(label, { autoAlpha: 0, x: -16, duration: 1, ease: 'expo.out' });
      const rule = label.querySelector('[data-pat-rule]');
      if (rule) lt.from(rule, { scaleX: 0, transformOrigin: '0% 50%', duration: 1, ease: 'expo.inOut' }, 0);
    });
  }

  /* the artist's hand: the thread draws through the studio, the detail zooms out to the whole */
  const thread = one('[data-thread]');
  if (thread) {
    gsap.fromTo(thread, { scaleX: 0, transformOrigin: '0% 50%' }, { scaleX: 1, ease: 'none', scrollTrigger: scrub(thread.parentNode, 'top 85%', 'bottom 55%') });
  }
  all('[data-hs]').forEach((el, i) => {
    gsap.from(el, { y: 100, autoAlpha: 0, duration: 1.5, delay: i * 0.1, ease: 'expo.out', scrollTrigger: { trigger: el.parentNode, start: 'top 85%', once: true } });
  });
  const zoom = one('[data-zoom]');
  if (zoom) gsap.fromTo(zoom, { scale: 1.8 }, { scale: 1, ease: 'none', scrollTrigger: scrub(zoom, 'top bottom', 'bottom 35%') });

  /* the quiet: a single paper mandala turns with the reader */
  const quiet = one('[data-quiet]');
  const qm = one('[data-quiet-mandala]');
  if (quiet && qm) {
    gsap.fromTo(qm, { rotation: -100, scale: 0.78 }, { rotation: 100, scale: 1.04, ease: 'none', scrollTrigger: scrub(quiet) });
  }

  /* commission: the painting opens through a circle, like the first one did */
  const comArt = one('[data-com-art]');
  if (comArt) {
    gsap
      .timeline({ scrollTrigger: { trigger: comArt, start: 'top 80%', once: true } })
      .fromTo(comArt, { clipPath: 'circle(0% at 50% 50%)' }, { clipPath: 'circle(75% at 50% 50%)', duration: 1.8, ease: 'expo.inOut', clearProps: 'clipPath' })
      .from(comArt.querySelector('img'), { scale: 1.5, rotation: 10, transformOrigin: '50% 50%', duration: 2.2, ease: 'expo.out', clearProps: 'transform' }, 0);
  }
  const commission = one('#commission');
  const comMandala = one('[data-com-mandala]');
  if (commission && comMandala) {
    gsap.fromTo(comMandala, { rotation: -50, y: 80 }, { rotation: 50, y: -80, ease: 'none', scrollTrigger: scrub(commission) });
  }
}
