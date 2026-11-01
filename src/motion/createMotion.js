/* KALA motion system — the shared GSAP choreography for every page.
   It animates markup that is already on the page; it never builds UI.
   Hooks (data attributes) a page can use:
     data-intro-line (wraps .lm > .li lines)   data-intro   data-intro-img   data-intro-wipe
     data-eyebrow  data-words (.wm > .wi)  data-cap  data-stagger  data-reveal [data-noinner]
     data-speed  data-parallax="px"  data-scrub-rotate="deg"  data-spin="seconds"  data-fl  data-line
     data-cursor="view|talk|explore"  data-magnetic  data-tilt  data-marquee
   Links: "#id" scrolls behind the curtain, other routes travel behind the curtain. */
import { gsap, ScrollTrigger, prefersReducedMotion } from './gsap';

export function createMotion(root, { arriving, gentle, extra, navigate, closeMenu, isMenuOpen, setDest }) {
  const html = document.documentElement;
  const one = (s) => root.querySelector(s);
  const all = (s) => gsap.utils.toArray(root.querySelectorAll(s));
  const api = { busy: false };

  /* play the curtain, run fn while hidden, lift */
  api.cover = (fn, label) => {
    const curtain = one('[data-curtain]');
    const inner = one('[data-curtain-inner]');
    const lab = one('[data-curtain-label]');
    if (!curtain || prefersReducedMotion() || api.busy) {
      fn();
      return;
    }
    api.busy = true;
    if (label) setDest(label);
    gsap
      .timeline({ onComplete: () => { api.busy = false; } })
      .set(curtain, { autoAlpha: 1, yPercent: 100 })
      .set(lab, { autoAlpha: label ? 1 : 0 })
      .set(inner, { autoAlpha: 0, yPercent: 40 })
      .to(curtain, { yPercent: 0, duration: 0.8, ease: 'expo.inOut' })
      .to(inner, { autoAlpha: 1, yPercent: 0, duration: 0.5, ease: 'expo.out' }, 0.4)
      .add(() => { fn(); ScrollTrigger.refresh(); })
      .to(inner, { yPercent: -40, autoAlpha: 0, duration: 0.5, ease: 'expo.in' }, '+=0.2')
      .to(curtain, { yPercent: -100, duration: 0.9, ease: 'expo.inOut' }, '<0.1')
      .set(curtain, { autoAlpha: 0, yPercent: 100 })
      .set([inner, lab], { autoAlpha: 1, yPercent: 0 });
  };

  /* drop the curtain, then change route; the next page lifts it */
  api.travel = (to) => {
    const curtain = one('[data-curtain]');
    if (!curtain || api.busy) return;
    api.busy = true;
    gsap
      .timeline()
      .set(curtain, { autoAlpha: 1, yPercent: 100 })
      .set(one('[data-curtain-label]'), { autoAlpha: 0 })
      .set(one('[data-curtain-inner]'), { autoAlpha: 0, yPercent: 30 })
      .to(curtain, { yPercent: 0, duration: 0.8, ease: 'expo.inOut' })
      .to(one('[data-curtain-inner]'), { autoAlpha: 1, yPercent: 0, duration: 0.5, ease: 'expo.out' }, 0.45)
      .add(() => {
        if (isMenuOpen()) closeMenu(true);
        navigate(to);
      });
  };

  api.pop = (els) => {
    if (!els || !els.length || prefersReducedMotion()) return;
    gsap.fromTo(els, { y: 40, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 1, stagger: 0.06, ease: 'expo.out', clearProps: 'transform,opacity,visibility' });
  };

  api.refresh = () => ScrollTrigger.refresh();

  const mm = gsap.matchMedia();
  mm.add(
    {
      desktop: '(min-width: 1024px)',
      reduce: '(prefers-reduced-motion: reduce)',
      fine: '(hover: hover) and (pointer: fine)',
    },
    (c) => {
      const d = c.conditions;
      const offs = [];
      const on = (el, ev, fn, o) => {
        if (!el) return;
        el.addEventListener(ev, fn, o);
        offs.push(() => el.removeEventListener(ev, fn, o));
      };
      const cleanup = () => {
        offs.forEach((f) => f());
        html.classList.remove('kala-cursor');
      };
      const canScroll = html.scrollHeight - window.innerHeight > 400;
      const curtain = one('[data-curtain]');
      const inner = one('[data-curtain-inner]');
      const label = one('[data-curtain-label]');

      /* reduced motion: a quiet fade, everything else stays still */
      if (d.reduce) {
        gsap.from(all('[data-intro], [data-intro-line] .li, [data-hero] .li, [data-h-fade], [data-h-canvas]'), { autoAlpha: 0, duration: 0.5, stagger: 0.04 });
        return cleanup;
      }

      /* 1 · arrival: a short curtain lift after a page change, the full drawing on first load */
      const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
      let H = 0.3;
      api.busy = true;
      if (gentle && !arriving) {
        /* quiet opening (home): no curtain, everything settles in softly */
        if (curtain) gsap.set(curtain, { autoAlpha: 0, yPercent: 100 });
        tl.from(one('[data-header]'), { autoAlpha: 0, duration: 1.2, ease: 'power2.out' }, 0.1)
          .from(all('[data-intro-line] .li'), { yPercent: 40, autoAlpha: 0, duration: 1.3, stagger: 0.09, ease: 'power3.out' }, 0.2)
          .from(all('[data-intro]'), { y: 18, autoAlpha: 0, duration: 1.2, stagger: 0.07, ease: 'power3.out' }, 0.45)
          .add(() => { api.busy = false; }, 0.6);
        H = -1;
      } else if (curtain && inner) {
        gsap.set([inner, label], { clearProps: 'opacity,visibility,transform' });
        gsap.set(curtain, { autoAlpha: 1, yPercent: 0 });
        if (arriving) {
          tl.from(label, { autoAlpha: 0, y: 14, duration: 0.6 }, 0)
            .to(inner, { yPercent: -40, autoAlpha: 0, duration: 0.6, ease: 'expo.in' }, 0.4)
            .to(curtain, { yPercent: -100, duration: 1, ease: 'expo.inOut' }, 0.5);
          H = 0.85;
        } else {
          const draws = all('[data-draw]');
          draws.forEach((el) => {
            const L = el.getTotalLength ? el.getTotalLength() : 400;
            gsap.set(el, { strokeDasharray: L, strokeDashoffset: L });
          });
          tl.to(draws, { strokeDashoffset: 0, duration: 1.1, stagger: 0.035, ease: 'power2.inOut' }, 0)
            .from(all('[data-curtain-letter]'), { yPercent: 115, duration: 0.9, stagger: 0.07 }, 0.1)
            .from(label, { autoAlpha: 0, y: 12, duration: 0.7 }, 0.4)
            .to(inner, { yPercent: -40, autoAlpha: 0, duration: 0.7, ease: 'expo.in' }, 1.05)
            .to(curtain, { yPercent: -100, duration: 1.1, ease: 'expo.inOut' }, 1.15)
            .set(draws, { clearProps: 'strokeDasharray,strokeDashoffset' }, 2.3);
          H = 1.45;
        }
        tl.set(curtain, { autoAlpha: 0, yPercent: 100 }, H + 0.8).set(inner, { yPercent: 0, autoAlpha: 1 }, H + 0.8);
      }

      /* 2 · page opening */
      if (H >= 0) {
        tl.from(one('[data-header]'), { yPercent: -100, duration: 1.1 }, H)
          .from(all('[data-intro-line] .li'), { yPercent: 118, rotation: 5, transformOrigin: '0% 100%', duration: 1.5, stagger: 0.1 }, H + 0.1)
          .from(all('[data-intro]'), { y: 30, autoAlpha: 0, duration: 1.2, stagger: 0.08 }, H + 0.4);
        all('[data-intro-img]').forEach((el, i) => {
          const at = H + i * 0.15;
          tl.fromTo(el, { clipPath: 'circle(0% at 50% 50%)' }, { clipPath: 'circle(75% at 50% 50%)', duration: 1.7, ease: 'expo.inOut', clearProps: 'clipPath' }, at);
          const im = el.querySelector('img');
          if (im) tl.from(im, { scale: 1.4, duration: 2.2, clearProps: 'scale' }, at);
        });
        all('[data-intro-wipe]').forEach((el, i) => {
          tl.fromTo(el, { clipPath: 'inset(0% 0% 100% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.4, ease: 'expo.inOut', clearProps: 'clipPath' }, H + 0.2 + i * 0.12);
        });
        tl.add(() => { api.busy = false; }, H + 0.5);
      }

      /* 3 · living mandalas */
      all('[data-spin]').forEach((g) => {
        const s = parseFloat(g.getAttribute('data-spin')) || 120;
        gsap.to(g, { rotation: s > 0 ? 360 : -360, svgOrigin: '0 0', duration: Math.abs(s), repeat: -1, ease: 'none' });
      });
      const track = one('[data-marquee]');
      const mq = track ? gsap.to(track, { xPercent: -50, duration: 42, repeat: -1, ease: 'none' }) : null;

      /* 4 · pointer: cursor, magnetic controls, tilting canvases */
      if (d.fine) {
        all('[data-magnetic]').forEach((el) => {
          const mx = gsap.quickTo(el, 'x', { duration: 0.7, ease: 'power3' });
          const my = gsap.quickTo(el, 'y', { duration: 0.7, ease: 'power3' });
          on(el, 'pointermove', (e) => {
            const b = el.getBoundingClientRect();
            mx((e.clientX - b.left - b.width / 2) * 0.35);
            my((e.clientY - b.top - b.height / 2) * 0.35);
          });
          on(el, 'pointerleave', () => { mx(0); my(0); });
        });
        all('[data-tilt]').forEach((el) => {
          const zone = el.parentNode;
          gsap.set(el, { transformPerspective: 1200 });
          const rx = gsap.quickTo(el, 'rotationX', { duration: 1, ease: 'power3' });
          const ry = gsap.quickTo(el, 'rotationY', { duration: 1, ease: 'power3' });
          on(zone, 'pointermove', (e) => {
            const b = zone.getBoundingClientRect();
            ry(((e.clientX - b.left) / b.width - 0.5) * 10);
            rx(-((e.clientY - b.top) / b.height - 0.5) * 8);
          });
          on(zone, 'pointerleave', () => { rx(0); ry(0); });
        });
        setupCursor(root, on, html);
      }

      /* 5 · transitions: other routes and sections travel behind the curtain */
      on(
        window,
        'click',
        (e) => {
          const a = e.target.closest?.('a[href]');
          if (!a || !root.contains(a) || a.target === '_blank') return;
          if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button > 0) return;
          const url = new URL(a.href, window.location.href);
          if (url.origin !== window.location.origin) return;
          const samePage = url.pathname === window.location.pathname && url.search === window.location.search;

          if (!samePage) {
            e.preventDefault();
            e.stopImmediatePropagation();
            api.travel(url.pathname + url.search + url.hash);
            return;
          }

          e.preventDefault();
          e.stopImmediatePropagation();
          const id = url.hash.slice(1);
          const target = id ? document.getElementById(id) : null;
          if (id && !target) return;
          if (target && id !== 'top' && target.contains(a)) return;
          if (api.busy || !canScroll) {
            if (!api.busy) window.scrollTo(0, target && id !== 'top' ? target.getBoundingClientRect().top + window.scrollY : 0);
            return;
          }
          const y = target && id !== 'top' ? target.getBoundingClientRect().top + window.scrollY : 0;
          api.cover(() => {
            if (isMenuOpen()) closeMenu(true);
            window.scrollTo(0, y);
          }, target?.getAttribute('data-chapter'));
        },
        true
      );

      const ctx = { gsap, ScrollTrigger, root, all, one, d, on, tl, H, canScroll, api };
      if (!canScroll) {
        extra?.(ctx);
        return cleanup;
      }

      /* 6 · scroll storytelling */
      const header = one('[data-header]');
      let headerShown = true;
      const skewTo = track ? gsap.quickTo(track, 'skewX', { duration: 0.5, ease: 'power3' }) : null;
      let settle = null;
      ScrollTrigger.create({
        start: 0,
        end: 'max',
        onUpdate: (s) => {
          if (header) {
            const hide = s.direction === 1 && s.scroll() > 260;
            if (hide === headerShown) {
              headerShown = !hide;
              gsap.to(header, { yPercent: hide ? -100 : 0, duration: 0.7, ease: 'expo.out' });
            }
            header.classList.toggle('is-scrolled', s.scroll() > 40);
          }
          if (mq) {
            const v = s.getVelocity();
            mq.timeScale(s.direction * gsap.utils.clamp(1, 7, 1 + Math.abs(v) / 300));
            gsap.to(mq, { timeScale: s.direction, duration: 1.4, ease: 'power2.out', overwrite: true });
            if (skewTo) {
              skewTo(gsap.utils.clamp(-10, 10, -v / 180));
              clearTimeout(settle);
              settle = setTimeout(() => skewTo(0), 120);
            }
          }
        },
      });
      offs.push(() => clearTimeout(settle));

      all('[data-eyebrow]').forEach((el) => {
        gsap.from(el, { autoAlpha: 0, letterSpacing: '.45em', duration: 1.5, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 90%', once: true } });
      });
      all('[data-words]').forEach((h) => {
        gsap.from(h.querySelectorAll('.wi'), { yPercent: 115, rotation: 6, transformOrigin: '0% 100%', duration: 1.4, stagger: 0.05, ease: 'expo.out', scrollTrigger: { trigger: h, start: 'top 88%', once: true } });
      });
      all('[data-cap]').forEach((el) => {
        gsap.from(el, { y: 28, autoAlpha: 0, duration: 1.3, delay: 0.15, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 92%', once: true } });
      });
      all('[data-stagger]').forEach((list) => {
        gsap.from(list.children, { y: 34, autoAlpha: 0, duration: 1.2, stagger: 0.08, ease: 'expo.out', scrollTrigger: { trigger: list, start: 'top 88%', once: true } });
      });
      all('[data-reveal]').forEach((el) => {
        const t = gsap.timeline({ scrollTrigger: { trigger: el, start: 'top 90%', once: true } });
        t.fromTo(el, { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.5, ease: 'expo.inOut', clearProps: 'clipPath' });
        const art = el.querySelector('img, svg');
        if (art && !el.hasAttribute('data-noinner')) t.from(art, { scale: 1.3, duration: 2, ease: 'expo.out', clearProps: 'scale' }, 0.1);
      });
      all('[data-line]').forEach((el) => {
        gsap.from(el, { scaleX: 0, transformOrigin: '0% 50%', duration: 1.4, ease: 'expo.inOut', scrollTrigger: { trigger: el, start: 'top 92%', once: true } });
      });
      all('[data-scrub-rotate]').forEach((el) => {
        const deg = parseFloat(el.getAttribute('data-scrub-rotate')) || 90;
        gsap.fromTo(el, { rotation: -deg }, { rotation: deg, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true } });
      });
      if (d.desktop) {
        all('[data-speed]').forEach((el) => {
          const s = parseFloat(el.getAttribute('data-speed')) || 1;
          gsap.fromTo(el, { y: s * 70 }, { y: -s * 70, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true } });
        });
        all('[data-parallax]').forEach((el) => {
          const px = parseFloat(el.getAttribute('data-parallax')) || 80;
          gsap.fromTo(el, { y: px }, { y: -px, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true } });
        });
      }
      const fl = all('[data-fl]');
      if (fl.length) gsap.from(fl, { yPercent: 105, duration: 1.6, stagger: 0.09, ease: 'expo.out', scrollTrigger: { trigger: fl[0].parentNode, start: 'top 95%', once: true } });

      /* progress mandala: fills and turns with the scroll */
      const prog = one('[data-prog]');
      const ring = one('[data-prog-ring]');
      if (prog && ring) {
        const C = 2 * Math.PI * 20;
        gsap.set(ring, { strokeDasharray: C, strokeDashoffset: C });
        gsap.to(ring, { strokeDashoffset: 0, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: 0.3 } });
        gsap.to(one('[data-prog-petals]'), { rotation: 360, svgOrigin: '0 0', ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: 0.3 } });
        gsap.set(prog, { autoAlpha: 0, scale: 0.6 });
        ScrollTrigger.create({
          start: 600,
          onEnter: () => gsap.to(prog, { autoAlpha: 1, scale: 1, duration: 0.6, ease: 'expo.out' }),
          onLeaveBack: () => gsap.to(prog, { autoAlpha: 0, scale: 0.6, duration: 0.4 }),
        });
      }

      extra?.(ctx);
      document.fonts?.ready.then(() => ScrollTrigger.refresh());
      return cleanup;
    }
  );

  api.destroy = () => {
    mm.revert();
    html.classList.remove('kala-cursor');
  };
  return api;
}

/* the gallery cursor: a ring that grows into a label over art and calls to action */
function setupCursor(root, on, html) {
  const ring = root.querySelector('[data-cursor-ring]');
  const dot = root.querySelector('[data-cursor-dot]');
  if (!ring || !dot) return;
  html.classList.add('kala-cursor');
  /* the cursor takes its colours from the theme (styles/index.css) */
  const css = getComputedStyle(html);
  const ink = css.getPropertyValue('--color-primary').trim() || '#22211F';
  const paper = css.getPropertyValue('--color-on-primary').trim() || '#FFFEFA';
  const tint = (hex, a) => {
    const [r, g, b] = gsap.utils.splitColor(hex);
    return `rgba(${r},${g},${b},${a})`;
  };
  const labels = gsap.utils.toArray(root.querySelectorAll('[data-cl]'));
  gsap.set([ring, dot], { xPercent: -50, yPercent: -50, autoAlpha: 0 });
  const dX = gsap.quickTo(dot, 'x', { duration: 0.12, ease: 'power3' });
  const dY = gsap.quickTo(dot, 'y', { duration: 0.12, ease: 'power3' });
  const cX = gsap.quickTo(ring, 'x', { duration: 0.55, ease: 'power3' });
  const cY = gsap.quickTo(ring, 'y', { duration: 0.55, ease: 'power3' });
  let shown = false;
  let state = '';

  const setCursor = (s, dark) => {
    const key = s + (dark ? ':d' : '');
    if (key === state) return;
    state = key;
    const big = s === 'view' || s === 'talk' || s === 'explore';
    const size = big ? 104 : s === 'link' ? 60 : 36;
    ring.style.mixBlendMode = big ? 'normal' : 'difference';
    gsap.to(ring, {
      width: size,
      height: size,
      backgroundColor: big ? (dark ? tint(paper, 0.94) : tint(ink, 0.92)) : 'rgba(255,255,255,0)',
      borderColor: big ? 'rgba(255,255,255,0)' : '#FFFFFF',
      color: dark ? ink : paper,
      autoAlpha: s === 'hide' ? 0 : shown ? 1 : 0,
      duration: 0.55,
      ease: 'expo.out',
    });
    gsap.to(dot, { scale: big || s === 'link' ? 0 : 1, autoAlpha: s === 'hide' ? 0 : shown ? 1 : 0, duration: 0.3 });
    labels.forEach((l) => {
      const match = l.getAttribute('data-cl') === s;
      gsap.to(l, { autoAlpha: match ? 1 : 0, y: match ? 0 : 8, duration: 0.4, ease: 'expo.out' });
    });
  };

  on(window, 'pointermove', (e) => {
    if (!shown) {
      shown = true;
      gsap.set([ring, dot], { x: e.clientX, y: e.clientY });
      gsap.to([ring, dot], { autoAlpha: 1, duration: 0.3 });
    }
    dX(e.clientX);
    dY(e.clientY);
    cX(e.clientX);
    cY(e.clientY);
  });
  on(html, 'mouseleave', () => {
    shown = false;
    gsap.to([ring, dot], { autoAlpha: 0, duration: 0.3 });
  });
  on(root, 'pointerover', (e) => {
    const t = e.target;
    if (!t?.closest) return;
    const dark = !!t.closest('.inverse');
    const zone = t.closest('[data-cursor]');
    if (zone) return setCursor(zone.getAttribute('data-cursor'), dark);
    if (t.closest('input, textarea, select, label')) return setCursor('hide', dark);
    if (t.closest('a, button, summary')) return setCursor('link', dark);
    setCursor('default', dark);
  });
  on(window, 'pointerdown', () => gsap.to(ring, { scale: 0.8, duration: 0.2 }));
  on(window, 'pointerup', () => gsap.to(ring, { scale: 1, duration: 0.6, ease: 'expo.out' }));
  setCursor('default', false);
}
