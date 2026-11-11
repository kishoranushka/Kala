import { Link } from 'react-router-dom';
import cx from '@/utils/cx';
import { WORKS, getCollection, isBuyable, metaLine, statusLabel } from '@/data/works';
import SalePrice from '@/components/art/Price';
import Mat from '@/components/art/Mat';
import PageTop from '@/components/sections/PageTop';
import { PageMandala } from '@/components/mandala/Mandala';
import Button from '@/components/ui/Button';
import Icon from '@/components/ui/Icon';
import { Line, SplitWords } from '@/components/ui/Typography';

const DOT = { sold: 'bg-muted', archived: 'bg-muted', inquiry: 'bg-link' };
const ORDER = { sold: 0, archived: 1, inquiry: 2 };

/* everything that can't be bought: sold first, then murals and other archived works, then personal pieces */
const ITEMS = WORKS.filter((w) => w.status !== 'available').sort((a, b) => ORDER[a.status] - ORDER[b.status]);
/* the most recent available works, newest first */
const HOMES = WORKS.filter((w) => w.status === 'available').reverse().sort((a, b) => isBuyable(b) - isBuyable(a)).slice(0, 4);

function nextStep(w) {
  if (w.collection === 'murals') return { to: '/walls', label: 'Commission a wall' };
  return { to: '/commission', label: w.status === 'inquiry' ? 'Enquire about it' : 'Commission something similar' };
}

function ArchiveCard({ work }) {
  const step = nextStep(work);
  return (
    <div className="flex flex-col">
      <Link to={`/artwork/${work.id}`} data-cursor="view" aria-label={`View ${work.title}, ${statusLabel(work)}`} className="group block text-primary no-underline hover:text-primary">
        <Mat work={work} ratio="aspect-[4/5]">
          {work.archiveNo && <span className="absolute top-3 left-3.5 z-1 font-display text-[22px] leading-none text-muted italic">Nº {work.archiveNo}</span>}
          <span className="absolute top-3.5 right-3.5 z-1 inline-flex items-center gap-1.5 rounded-full bg-surface px-2.5 py-[5px] text-[11px]/[14px] font-bold tracking-[.08em] uppercase">
            <i aria-hidden="true" className={cx('size-[7px] rounded-full', DOT[work.status])} />
            {statusLabel(work)}
          </span>
        </Mat>
        <span className="mt-[18px] block font-display text-[26px]/[30px] font-medium">{work.title}</span>
        <span className="mt-1 block text-[13px]/5 text-muted">
          {getCollection(work.collection).title} · {metaLine(work)}
        </span>
      </Link>
      <Link
        to={step.to}
        data-cursor="talk"
        className="mt-3.5 inline-flex items-center gap-2 self-start border-b border-primary pb-1 text-sm font-semibold text-primary no-underline hover:border-secondary hover:text-secondary"
      >
        {step.label} <Icon name="arrow" size={16} />
      </Link>
    </div>
  );
}

export default function ArchivePage() {
  return (
    <>
      <PageTop labelledBy="ar-h" crumbs={[{ label: 'Archive' }]}>
        <div className="col-[1/8] max-lg:col-span-full">
          <p data-intro className="eyebrow m-0">
            The archive · Not for sale
          </p>
          <h1 id="ar-h" data-intro-line className="heading-1 mt-5 mb-0">
            <Line>
              The <span className="text-secondary italic">uncollectable</span>
            </Line>{' '}
            <Line>collection.</Line>
          </h1>
        </div>
        <p data-intro className="lead col-[9/13] m-0 max-lg:col-span-full max-lg:mt-6">
          Some works have already found their walls, and murals stay where they were painted. They live here as part of the story. Like one? I can paint something in the same spirit.
        </p>
      </PageTop>

      <section aria-label="Archived works">
        <div className="wrap">
          <div data-stagger className="grid grid-cols-3 gap-x-7 gap-y-14 pt-10 pb-[clamp(96px,11vw,150px)] max-lg:grid-cols-2 max-sm:grid-cols-1 max-sm:gap-12">
            {ITEMS.map((w) => (
              <ArchiveCard key={w.id} work={w} />
            ))}
          </div>
        </div>
      </section>

      <section aria-labelledby="homes-h" className="inverse relative overflow-hidden bg-primary py-[clamp(88px,10vw,140px)] text-on-primary">
        <PageMandala
          stroke="rgb(255 254 250 / .3)"
          accentClass="stroke-secondary-on-dark"
          outerSpin={90}
          innerSpin={-70}
          className="top-1/2 -right-[180px] -mt-[360px] w-[720px] max-sm:-right-[260px] max-sm:-mt-[260px] max-sm:w-[520px]"
        />
        <div className="wrap relative z-1">
          <div className="grid-12 items-end">
            <div className="col-[1/8] max-lg:col-span-full">
              <p data-eyebrow className="eyebrow m-0">
                Still looking for a home
              </p>
              <SplitWords id="homes-h" text="These ones are *available.*" className="heading-2 mt-5 mb-0 font-light" />
            </div>
            <div data-cap className="col-[9/13] max-lg:col-span-full max-lg:mt-7">
              <Button variant="light" to="/shop" arrow data-magnetic>
                Visit the Shop
              </Button>
            </div>
          </div>
          <div data-stagger className="mt-7 grid grid-cols-4 gap-5 max-lg:grid-cols-2">
            {HOMES.map((w) => (
              <Link key={w.id} to={`/artwork/${w.id}`} data-cursor="view" className="group block text-on-primary no-underline hover:text-on-primary">
                <Mat work={w} ratio="aspect-square" padding="p-4" tone="bg-primary-hover" />
                <span className="mt-2.5 flex flex-wrap items-baseline justify-between gap-x-3 text-[13px] text-on-primary-soft">
                  {w.title}
                  {isBuyable(w) ? <SalePrice work={w} size="sm" badge={false} dark className="text-on-primary" /> : <span>Price on request</span>}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
