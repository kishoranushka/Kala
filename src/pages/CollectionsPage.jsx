import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import cx from '@/utils/cx';
import { COLLECTIONS, getWork, pad2, ratioOf, worksIn } from '@/data/works';
import { gsap, canAnimate } from '@/motion/gsap';
import ArtLink from '@/components/art/ArtLink';
import PageIntro from '@/components/sections/PageIntro';
import { PageMandala } from '@/components/mandala/Mandala';
import Button from '@/components/ui/Button';
import StatusBadge from '@/components/ui/StatusBadge';
import TextLink from '@/components/ui/TextLink';
import { Accent, Line, SplitWords } from '@/components/ui/Typography';

const chapters = COLLECTIONS.map((c) => {
  const works = worksIn(c.id);
  const available = works.filter((w) => w.status === 'available').length;
  return {
    ...c,
    works,
    lead: getWork(c.lead),
    countLabel: `${pad2(works.length)} ${works.length === 1 ? 'work' : 'works'}`,
    availLabel: available ? `${pad2(available)} available` : 'None available now',
  };
});

function ImageFill({ work }) {
  return <img src={work.img} alt="" loading="lazy" className={cx('block size-full object-cover', work.crop && 'crop-ig')} />;
}

/* one chapter band; odd chapters turn dark and mirror */
function ChapterBand({ chapter, flip }) {
  return (
    <section
      aria-label={`Chapter ${chapter.num}: ${chapter.title}`}
      className={cx('relative overflow-hidden py-[clamp(88px,10vw,144px)]', flip && 'inverse bg-primary text-on-primary')}
    >
      <div className="wrap">
        <div className="grid grid-cols-12 items-center gap-x-8">
          <div className={cx('relative max-lg:col-span-full max-lg:row-auto', flip ? 'col-[7/13] row-1' : 'col-[1/7]')}>
            <span
              aria-hidden="true"
              data-parallax="60"
              className={cx(
                'text-outline-secondary pointer-events-none absolute -top-[.42em] font-display text-[clamp(120px,16vw,240px)] leading-none font-light italic max-lg:text-[120px]',
                flip ? '-left-[.1em]' : '-right-[.1em]'
              )}
            >
              {chapter.num}
            </span>
            <ArtLink work={chapter.lead} />
          </div>
          <div data-cap className={cx('max-lg:col-span-full max-lg:row-auto max-lg:mt-12', flip ? 'col-[1/6] row-1' : 'col-[8/13]')}>
            <p className="eyebrow">
              Chapter {chapter.num} · {chapter.countLabel}
            </p>
            <h2 className="heading-2 mt-5 font-light">{chapter.title}</h2>
            <p className="lead mt-6">{chapter.intro}</p>
            <ul className="mt-7 list-none border-t border-[rgba(143,136,125,.5)] p-0">
              {chapter.works.map((w) => (
                <li key={w.id} className="flex justify-between gap-4 border-b border-[rgba(143,136,125,.35)] py-3.5 text-sm/[22px]">
                  <span className="font-display text-xl/6 font-medium">{w.title}</span>
                  <StatusBadge status={w.status} marker={false} tone="text-inherit" />
                </li>
              ))}
            </ul>
            <div className="mt-8">
              <TextLink to={`/collections/${chapter.id}`} tone={flip ? 'inverse' : 'ink'} arrow data-cursor="explore">
                Enter the chapter
              </TextLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function CollectionsPage() {
  const [activeId, setActiveId] = useState(chapters[0].id);
  const active = chapters.find((c) => c.id === activeId);
  const frameRef = useRef(null);
  const firstRender = useRef(true);

  /* the preview opens from the top whenever a new chapter is hovered */
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    if (!canAnimate()) return;
    const frame = frameRef.current;
    gsap.fromTo(frame, { clipPath: 'inset(0% 0% 100% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.9, ease: 'expo.out', clearProps: 'clipPath' });
    gsap.fromTo(frame.querySelector('img'), { scale: 1.2 }, { scale: 1, duration: 1.2, ease: 'expo.out', clearProps: 'scale' });
  }, [activeId]);

  return (
    <>
      <PageIntro
        labelledBy="col-h"
        crumbs={[{ label: 'Collections' }]}
        mandala={<PageMandala className="-top-[180px] -left-[320px] w-[700px] opacity-55" />}
      >
        <div className="col-[1/8] pl-[8%] max-lg:col-span-full">
          <p data-intro className="eyebrow">
            Collections · The Collector’s Index
          </p>
          <h1 id="col-h" data-intro-line className="heading-1 mt-5">
            <Line>Four chapters</Line>
            <Line>
              of one <Accent>practice.</Accent>
            </Line>
          </h1>
        </div>
        <div className="col-[9/13] self-end max-lg:col-span-full max-lg:mt-8">
          <p data-intro className="lead">
            Each collection is a chapter: a subject I keep returning to, in paint or on a wall. Open one to see every work inside it.
          </p>
        </div>
      </PageIntro>

      {/* ============================== THE COLLECTOR'S INDEX */}
      <section aria-label="Index of collections" className="pb-[clamp(96px,11vw,160px)]">
        <div className="wrap">
          <div className="grid-12">
            <ol data-stagger className="col-[1/9] m-0 list-none border-t border-line p-0 max-lg:col-span-full">
              {chapters.map((c) => {
                const on = c.id === activeId;
                const hover = () => setActiveId(c.id);
                return (
                  <li key={c.id}>
                    <Link
                      to={`/collections/${c.id}`}
                      data-cursor="explore"
                      onMouseEnter={hover}
                      onFocus={hover}
                      className="grid grid-cols-[72px_1fr_auto] items-center gap-6 border-b border-divider py-7 text-primary transition-[padding] duration-600 ease-gallery hover:pl-4 hover:text-primary max-lg:grid-cols-[56px_1fr_88px] max-sm:grid-cols-[40px_1fr_64px] max-sm:gap-4 max-sm:py-5"
                    >
                      <span className="font-display text-[32px] leading-none text-secondary italic max-sm:text-2xl">{c.num}</span>
                      <span
                        className={cx(
                          'font-display text-[clamp(44px,6.4vw,96px)] leading-none font-light tracking-[-.015em] transition-colors duration-400 ease-gallery',
                          on ? 'text-secondary italic' : 'text-primary'
                        )}
                      >
                        {c.title}
                      </span>
                      <span className="flex flex-col items-end gap-1 text-right max-lg:hidden">
                        <span className="meta tabular-nums">{c.countLabel}</span>
                        <span className="meta text-success! tabular-nums">{c.availLabel}</span>
                      </span>
                      <span className="relative hidden size-[88px] overflow-hidden max-lg:block max-sm:size-16">
                        <ImageFill work={c.lead} />
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ol>

            <div aria-hidden="true" className="sticky top-[120px] col-[10/13] self-start max-lg:hidden">
              <div ref={frameRef} className="relative overflow-hidden bg-wall shadow-float" style={{ aspectRatio: ratioOf(active.lead) }}>
                <ImageFill work={active.lead} />
              </div>
              <p className="eyebrow mt-[18px]">
                Chapter {active.num} · {active.title}
              </p>
              <p className="art-title mt-1.5">{active.lead.title}</p>
            </div>
          </div>
        </div>
      </section>

      {chapters.map((c, i) => (
        <ChapterBand key={c.id} chapter={c} flip={i % 2 === 1} />
      ))}

      {/* ============================== QUIET CLOSE */}
      <section aria-label="Commission" className="border-t border-divider py-[clamp(96px,11vw,160px)]">
        <div className="wrap flex flex-col items-start gap-7 pl-[16%]">
          <p data-eyebrow className="eyebrow">
            A fifth chapter
          </p>
          <SplitWords as="p" text="The next collection could start with *your* idea." className="heading-2 mt-5 max-w-[16ch] font-light" />
          <Button to="/commission" arrow data-magnetic data-cursor="talk" data-cap>
            Commission a Piece
          </Button>
        </div>
      </section>
    </>
  );
}
