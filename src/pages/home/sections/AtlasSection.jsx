import { useEffect, useRef, useState } from 'react';
import cx from '@/utils/cx';
import { getWork, pad2 } from '@/data/works';
import { gsap, canAnimate } from '@/motion/gsap';
import ArtLink from '@/components/art/ArtLink';
import StatusBadge from '@/components/ui/StatusBadge';
import TextLink from '@/components/ui/TextLink';
import { SplitWords } from '@/components/ui/Typography';
import { ATLAS_FILTERS, ATLAS_WORKS, HOME_H2 } from '../homeContent';

const works = ATLAS_WORKS.map((item) => ({ ...item, work: getWork(item.id) }));
const countFor = (id) => (id === 'all' ? works.length : works.filter((w) => w.work.collection === id).length);

function CommissionLink({ children }) {
  return (
    <a href="#commission" data-cursor="talk" className="text-sm/6 font-semibold">
      {children}
    </a>
  );
}

function AtlasWork({ item, dimmed }) {
  const { work } = item;
  return (
    <figure
      data-work
      data-speed={item.speed}
      className={cx('m-0 transition-opacity duration-600 ease-gallery', item.slot)}
      style={{ opacity: dimmed ? 0.2 : 1 }}
    >
      <ArtLink work={work} />
      {item.wide ? (
        <figcaption data-cap className="mt-[18px] flex flex-wrap items-start justify-between gap-6">
          <div className="flex flex-col gap-1.5">
            <span className="eyebrow">{item.eyebrow}</span>
            <span className="font-display text-[26px]/[30px] font-medium">{work.title}</span>
            <span className="meta">{item.meta}</span>
          </div>
          <div className="flex flex-col items-end gap-1.5 text-right">
            <StatusBadge status={work.status} leading="leading-[inherit]" />
            <CommissionLink>{item.cta}</CommissionLink>
          </div>
        </figcaption>
      ) : (
        <figcaption data-cap className="mt-[18px] flex flex-col gap-1.5">
          <div className="flex items-baseline justify-between gap-3">
            <span className="eyebrow">{item.eyebrow}</span>
            <StatusBadge status={work.status} leading="leading-[inherit]" />
          </div>
          <span className={cx('font-display font-medium', item.large ? 'text-[26px]/[30px]' : 'text-[22px]/[26px]')}>{work.title}</span>
          <span className="meta">{item.meta}</span>
          {item.cta ? <CommissionLink>{item.cta}</CommissionLink> : <span className="price">{work.price}</span>}
        </figcaption>
      )}
    </figure>
  );
}

/* 01 · The Art Atlas — browse by collection; works outside the filter dim rather than disappear */
export default function AtlasSection() {
  const [filter, setFilter] = useState('all');
  const gridRef = useRef(null);
  const firstRender = useRef(true);
  const active = ATLAS_FILTERS.find((f) => f.id === filter);
  const shown = countFor(filter);

  /* re-hang the works that match a new filter */
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    if (!canAnimate()) return;
    gridRef.current.querySelectorAll('[data-work]').forEach((fig) => {
      if (fig.style.opacity !== '1') return;
      gsap.fromTo(fig.querySelector('[data-art-link]'), { scale: 0.94, y: 18 }, { scale: 1, y: 0, duration: 1, ease: 'expo.out', clearProps: 'transform' });
    });
  }, [filter]);

  return (
    <section id="atlas" data-chapter="01 · The Art Atlas" aria-labelledby="atlas-h" className="pt-[clamp(88px,10vw,144px)] pb-[clamp(96px,11vw,160px)]">
      <div className="wrap">
        <div className="grid-12">
          <div className="col-[1/7] max-lg:col-span-full">
            <p data-eyebrow className="eyebrow">
              01 · The Art Atlas
            </p>
            <SplitWords id="atlas-h" text="A personal atlas of *paintings*." className={cx(HOME_H2, 'max-w-[13ch] font-normal')} />
            <p data-cap className="mt-7 max-w-[44ch] text-lg/[30px] text-soft">
              Wander by collection. Every work shows its status, so you always know what can come home with you.
            </p>
          </div>

          <nav aria-label="Browse the atlas by collection" className="col-[8/13] self-end max-lg:col-span-full max-lg:mt-12">
            <div className="flex items-baseline justify-between border-b border-line pb-3">
              <span className="eyebrow">Index of collections</span>
              <span aria-live="polite" className="meta tabular-nums">
                {shown} of {works.length} · {active.label}
              </span>
            </div>
            <ul data-stagger className="m-0 list-none p-0">
              {ATLAS_FILTERS.map((f, i) => {
                const on = f.id === filter;
                return (
                  <li key={f.id} className="border-b border-divider">
                    <button
                      type="button"
                      onClick={() => setFilter(f.id)}
                      aria-pressed={on}
                      className={cx(
                        'flex min-h-14 w-full cursor-pointer items-center gap-5 border-0 bg-transparent p-0 text-left font-display text-[26px]/8 transition-colors duration-400 ease-gallery',
                        on ? 'font-medium text-link' : 'font-normal text-primary'
                      )}
                    >
                      <span className="w-7 font-sans text-xs font-semibold tracking-[.06em] text-muted tabular-nums">{pad2(i + 1)}</span>
                      <span className={cx('flex-1', on && 'italic')}>{f.label}</span>
                      <span className="font-sans text-[13px] font-medium text-muted tabular-nums">{pad2(countFor(f.id))}</span>
                      <span aria-hidden="true" className={cx('h-px bg-link transition-[width] duration-600 ease-gallery', on ? 'w-7' : 'w-0')} />
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>

        <div
          ref={gridRef}
          className="mt-28 grid grid-cols-12 items-start gap-x-8 gap-y-24 max-xl:gap-x-6 max-lg:mt-16 max-lg:grid-cols-2 max-lg:gap-y-14 max-sm:grid-cols-1 max-sm:gap-y-16"
        >
          {works.map((item) => (
            <AtlasWork key={item.id} item={item} dimmed={filter !== 'all' && item.work.collection !== filter} />
          ))}

          <div data-speed="0.6" data-stagger className="col-[8/13] flex flex-col gap-7 self-center pl-[10%] max-lg:col-span-full max-lg:pl-0">
            <p className="max-w-[20ch] font-display text-[30px]/10 text-primary italic">Every artwork begins with curiosity.</p>
            <div className="flex flex-wrap gap-8">
              <TextLink to="/shop" arrow data-cursor="explore">
                Browse all works
              </TextLink>
              <TextLink to="/collections">See the collections</TextLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
