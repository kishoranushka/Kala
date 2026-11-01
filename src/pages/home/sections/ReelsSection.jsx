import { useRef } from 'react';
import { CONTACT } from '@/data/site';
import { REELS } from '@/data/works';
import { prefersReducedMotion } from '@/motion/gsap';
import Button from '@/components/ui/Button';
import Icon from '@/components/ui/Icon';
import SectionHead from '@/components/sections/SectionHead';

const ROUND =
  'inline-flex size-14 cursor-pointer items-center justify-center rounded-full border-[1.5px] border-on-primary/50 bg-transparent text-on-primary transition-colors duration-400 ease-gallery hover:border-surface hover:bg-surface hover:text-primary';

export default function ReelsSection() {
  const track = useRef(null);
  const scroll = (dir) => {
    const t = track.current;
    if (!t) return;
    const card = t.querySelector('a');
    const step = card ? card.getBoundingClientRect().width + 20 : 280;
    t.scrollBy({ left: dir * step * 2, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
  };

  return (
    <section aria-labelledby="reels-h" className="inverse relative overflow-hidden bg-primary py-[clamp(96px,11vw,150px)] text-on-primary">
      <div className="wrap">
        <SectionHead
          id="reels-h"
          eyebrow={`On Instagram · ${CONTACT.instagramHandle}`}
          title="Behind the *paint.*"
          lead="Sketches, works in progress and the odd bit of chaos. Tap a reel to watch it on Instagram."
          aside={
            <div data-cap className="flex shrink-0 gap-3 max-sm:hidden">
              <button type="button" className={ROUND} onClick={() => scroll(-1)} aria-label="Previous reels">
                <Icon name="arrowLeft" strokeWidth={1.8} />
              </button>
              <button type="button" className={ROUND} onClick={() => scroll(1)} aria-label="Next reels">
                <Icon name="arrow" strokeWidth={1.8} />
              </button>
            </div>
          }
        />
      </div>

      <div
        ref={track}
        data-stagger
        role="list"
        aria-label="Instagram reels"
        className="no-scrollbar flex snap-x snap-mandatory gap-5 overflow-x-auto px-(--track-pad) pt-3 pb-7 [--track-pad:max(64px,calc((100%_-_1488px)_/_2_+_64px))] [scroll-padding-left:var(--track-pad)] max-sm:gap-3.5 max-sm:[--track-pad:20px]"
      >
        {REELS.map((r, i) => (
          <a
            key={i}
            role="listitem"
            href={r.url}
            target="_blank"
            rel="noopener"
            aria-label={`Watch on Instagram: ${r.title} (opens in a new tab)`}
            className="group relative block aspect-[9/16] w-[clamp(210px,19vw,270px)] flex-none snap-start overflow-hidden rounded-ui bg-primary-hover text-on-primary no-underline transition-transform duration-700 ease-gallery after:absolute after:inset-0 after:bg-[linear-gradient(180deg,rgba(34,33,31,.35)_0%,rgba(34,33,31,0)_26%,rgba(34,33,31,0)_52%,rgba(34,33,31,.88)_100%)] hover:-translate-y-2 hover:text-on-primary max-sm:w-[200px]"
          >
            <img src={r.cover} alt={r.alt} loading="lazy" className="block size-full object-cover transition-transform duration-1400 ease-gallery group-hover:scale-106" />
            <span className="absolute top-3.5 left-3.5 z-2 inline-flex items-center gap-1.5 text-[11px]/[14px] font-bold tracking-[.08em] uppercase">
              <Icon name="reel" size={14} strokeWidth={2} />
              Reel
            </span>
            <span
              aria-hidden="true"
              className="absolute top-1/2 left-1/2 z-2 -mt-[30px] -ml-[30px] flex size-[60px] items-center justify-center rounded-full bg-surface/94 text-primary transition-[transform,background-color] duration-700 ease-gallery group-hover:scale-112 group-hover:bg-surface"
            >
              <Icon name="play" />
            </span>
            <span className="absolute inset-x-4 bottom-4 z-2 text-sm/5 font-semibold">
              {r.title}
              <span className="mt-0.5 block text-xs font-medium text-on-primary-muted">Watch on Instagram</span>
            </span>
          </a>
        ))}
      </div>

      <div className="wrap">
        <div data-cap className="mt-7 flex flex-wrap gap-3.5">
          <Button variant="paper" to={CONTACT.instagram}>
            <Icon name="instagram" size={18} strokeWidth={1.8} />
            Follow {CONTACT.instagramHandle}
          </Button>
          <Button variant="ghost" to={CONTACT.youtube}>
            <Icon name="youtube" strokeWidth={1.8} />
            YouTube {CONTACT.youtubeHandle}
          </Button>
        </div>
      </div>
    </section>
  );
}
