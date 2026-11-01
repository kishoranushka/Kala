import { Link, Navigate, useParams } from 'react-router-dom';
import cx from '@/utils/cx';
import { COLLECTIONS, getWork, pad2, ratioOf, worksIn } from '@/data/works';
import ArtworkCard from '@/components/art/ArtworkCard';
import InverseSection from '@/components/sections/InverseSection';
import PageTop from '@/components/sections/PageTop';
import { RingMandala } from '@/components/mandala/Mandala';
import Button from '@/components/ui/Button';
import TextLink from '@/components/ui/TextLink';
import { SplitWords } from '@/components/ui/Typography';

/* works pair up across the wall in fours; on tablet every second work drops lower */
const SLOTS = ['col-[1/7]', 'col-[8/12]', 'col-[2/6]', 'col-[7/13]'];
const DROPS = ['', 'mt-40', '', 'mt-20'];
const slotFor = (i) => cx(SLOTS[i % 4], DROPS[i % 4], 'max-lg:col-auto', i % 2 ? 'max-lg:mt-[72px] max-sm:mt-0 max-sm:ml-[12%]' : 'max-lg:mt-0');

function AdjacentChapter({ chapter, direction }) {
  const next = direction === 'next';
  return (
    <Link
      to={`/collections/${chapter.id}`}
      data-cursor="explore"
      className={cx(
        'group flex flex-col gap-2 py-12 text-primary hover:text-primary max-sm:py-8',
        next && 'items-end border-l border-divider text-right max-sm:border-t max-sm:border-l-0'
      )}
    >
      <span className="eyebrow">{next ? `Next chapter · ${chapter.num} →` : `← Previous chapter · ${chapter.num}`}</span>
      <span
        className={cx(
          'font-display text-[clamp(36px,4.4vw,64px)] leading-none font-light transition-transform duration-600 ease-gallery group-hover:italic',
          next ? 'group-hover:-translate-x-3' : 'group-hover:translate-x-3'
        )}
      >
        {chapter.title}
      </span>
    </Link>
  );
}

export default function CollectionPage() {
  const { id } = useParams();
  const index = COLLECTIONS.findIndex((c) => c.id === id);
  if (index === -1) return <Navigate to="/collections" replace />;

  const chapter = COLLECTIONS[index];
  const prev = COLLECTIONS[(index - 1 + COLLECTIONS.length) % COLLECTIONS.length];
  const next = COLLECTIONS[(index + 1) % COLLECTIONS.length];
  const lead = getWork(chapter.lead);
  const works = worksIn(chapter.id);
  const available = works.filter((w) => w.status === 'available').length;

  return (
    <>
      {/* ============================== CHAPTER OPENING */}
      <PageTop labelledBy="ch-h" crumbs={[{ label: 'Collections', to: '/collections' }, { label: chapter.title }]} bodyClassName="mt-10 grid-12">
        <div className="relative col-[1/6] self-center max-lg:col-span-full">
          <span
            aria-hidden="true"
            data-intro
            className="text-outline-secondary block font-display text-[clamp(140px,18vw,280px)] leading-[.8] font-light italic"
          >
            {chapter.num}
          </span>
          <p data-intro className="eyebrow mt-6">
            Chapter {chapter.num} of {COLLECTIONS.length}
          </p>
          <h1 id="ch-h" data-intro className="heading-1 mt-5">
            {chapter.title}
          </h1>
          <p data-intro className="lead mt-7">
            {chapter.intro}
          </p>
          <div data-intro className="mt-8 flex gap-8 border-t border-divider pt-6">
            <span>
              <b className="block font-display text-[40px] leading-none font-normal">{pad2(works.length)}</b>
              <span className="meta">{works.length === 1 ? 'work' : 'works'} in this chapter</span>
            </span>
            <span>
              <b className="block font-display text-[40px] leading-none font-normal text-success">{pad2(available)}</b>
              <span className="meta">available now</span>
            </span>
          </div>
        </div>
        <div className="relative col-[7/13] max-lg:col-span-full max-lg:mt-12">
          <div data-intro-img data-tilt data-cursor="view" className="relative overflow-hidden rounded-ui bg-wall shadow-float" style={{ aspectRatio: ratioOf(lead) }}>
            <img src={lead.img} alt={lead.alt} fetchpriority="high" className={cx('block size-full object-cover', lead.crop && 'crop-ig')} />
          </div>
          <p data-intro className="meta mt-4">
            Leading this chapter · {lead.title}
          </p>
        </div>
      </PageTop>

      {/* ============================== WORKS IN THIS CHAPTER */}
      <section aria-labelledby="cw-h" className="pt-[clamp(48px,6vw,88px)] pb-[clamp(96px,11vw,160px)]">
        <div className="wrap">
          <div className="mb-[clamp(48px,6vw,88px)] flex flex-wrap items-end justify-between gap-6">
            <div>
              <p data-eyebrow className="eyebrow">
                In this chapter
              </p>
              <SplitWords id="cw-h" text="Every work, *side* by side." className="heading-2 mt-5 font-light" />
            </div>
            <TextLink to="/shop">See all works in the shop</TextLink>
          </div>
          <div className="grid grid-cols-12 items-start gap-x-8 gap-y-24 max-lg:grid-cols-2 max-lg:gap-x-6 max-lg:gap-y-14 max-sm:grid-cols-1">
            {works.map((w, i) => (
              <ArtworkCard key={w.id} work={w} eyebrow={`Pl. ${w.plate}`} titleClassName="font-display text-[28px]/[34px] font-medium" cart className={slotFor(i)} />
            ))}
          </div>
        </div>
      </section>

      {/* ============================== COMMISSION IN THIS SPIRIT */}
      <InverseSection aria-labelledby="ch-cta-h" className="py-[clamp(88px,10vw,144px)]">
        <RingMandala className="absolute top-1/2 left-1/2 -mt-[450px] -ml-[450px] w-[900px] opacity-[.08]" />
        <div className="wrap relative flex flex-col items-center gap-7 text-center">
          <p data-eyebrow className="eyebrow">
            Something in this spirit
          </p>
          <h2 id="ch-cta-h" data-cap className="heading-2 mt-5 max-w-[18ch] font-light">
            Want a piece for your own walls from the <span className="text-secondary italic">{chapter.title}</span> chapter?
          </h2>
          <Button variant="light" to="/commission" arrow data-magnetic data-cursor="talk" data-cap>
            Start a Commission
          </Button>
        </div>
      </InverseSection>

      {/* ============================== ADJACENT CHAPTERS */}
      <nav aria-label="Other chapters" className="py-[clamp(48px,6vw,88px)]">
        <div className="wrap">
          <div className="grid grid-cols-2 border-t border-line max-sm:grid-cols-1">
            <AdjacentChapter chapter={prev} direction="prev" />
            <AdjacentChapter chapter={next} direction="next" />
          </div>
          <div className="mt-8">
            <TextLink to="/collections">Back to the Collector’s Index</TextLink>
          </div>
        </div>
      </nav>
    </>
  );
}
