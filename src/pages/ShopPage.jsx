import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import cx from '@/utils/cx';
import { COLLECTIONS, STATUS, WORKS, formatINR, getWork, isBuyable, onSale, payValue, priceValue } from '@/data/works';
import { SALE, saleEndsLabel } from '@/data/sale';
import { useMotionApi } from '@/motion/MotionContext';
import ShopCard from '@/components/art/ShopCard';
import CtaBand from '@/components/sections/CtaBand';
import FaqSection from '@/components/sections/FaqSection';
import { SHOP_FAQ } from '@/data/faq';
import { PageMandala } from '@/components/mandala/Mandala';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import Button from '@/components/ui/Button';
import TextLink from '@/components/ui/TextLink';
import { Line } from '@/components/ui/Typography';

/* available first (ones you can buy online before "price on request"), then the rest; newest plates first inside each group */
const SORTED = [...WORKS].sort(
  (a, b) => STATUS[a.status].rank - STATUS[b.status].rank || isBuyable(b) - isBuyable(a) || parseInt(b.plate, 10) - parseInt(a.plate, 10)
);
const SALE_WORKS = WORKS.filter(onSale);
/* the biggest saving on one painting, for the sale callout */
const BEST_SAVING = Math.max(0, ...SALE_WORKS.map((w) => priceValue(w) - payValue(w)));
const CHIPS = [{ id: 'all', title: 'All' }, ...COLLECTIONS].map((c) => ({
  ...c,
  count: c.id === 'all' ? WORKS.length : WORKS.filter((w) => w.collection === c.id).length,
}));
const FEATURED = ['cat', 'sunflower', 'buddha'].map(getWork);
const AVAILABLE = WORKS.filter((w) => w.status === 'available').length;

function Chip({ pressed, onClick, children }) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      onClick={onClick}
      className="inline-flex min-h-10 cursor-pointer items-center gap-2 rounded-ui border border-line bg-transparent px-4 font-sans text-[13px] font-semibold tracking-[.02em] whitespace-nowrap text-primary transition-colors duration-400 ease-gallery hover:border-primary aria-pressed:border-primary aria-pressed:bg-primary aria-pressed:text-on-primary"
    >
      {children}
    </button>
  );
}

/* a switch that reads its state from aria-pressed */
function Toggle({ pressed, onClick, children }) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      onClick={onClick}
      className="group inline-flex min-h-10 cursor-pointer items-center gap-2.5 border-0 bg-transparent px-1 font-sans text-[13px] font-semibold text-primary"
    >
      <i
        aria-hidden="true"
        className="relative h-[22px] w-[38px] rounded-full bg-track transition-colors duration-300 group-aria-pressed:bg-success after:absolute after:top-[3px] after:left-[3px] after:size-4 after:rounded-full after:bg-surface after:transition-transform after:duration-300 after:ease-gallery group-aria-pressed:after:translate-x-4"
      />
      {children}
    </button>
  );
}

export default function ShopPage() {
  const [col, setCol] = useState('all');
  /* /shop?available opens with "available only" on (the sale banners link here) */
  const [params] = useSearchParams();
  const [availOnly, setAvailOnly] = useState(() => params.has('available'));
  const cards = useMemo(() => SORTED.filter((w) => (col === 'all' || w.collection === col) && (!availOnly || w.status === 'available')), [col, availOnly]);
  const reset = () => {
    setCol('all');
    setAvailOnly(false);
  };

  /* re-hang the wall when the filters change */
  const motion = useMotionApi();
  const gridRef = useRef(null);
  const firstRender = useRef(true);
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    motion.current?.pop(gridRef.current.querySelectorAll('[data-card]'));
    motion.current?.refresh();
  }, [col, availOnly, motion]);

  return (
    <>
      {/* on phones the intro shrinks to title + sale line so the paintings show on the first screen */}
      <section aria-labelledby="shop-h" className="relative overflow-hidden pt-[clamp(40px,6vw,88px)] pb-[clamp(56px,7vw,104px)] max-sm:pt-4 max-sm:pb-5">
        <PageMandala className="-top-[260px] -right-[240px] w-[760px] opacity-85 max-sm:-top-[300px] max-sm:-right-[300px] max-sm:w-[440px]" />
        <div className="wrap relative z-1">
          <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Shop' }]} />
          <div className="mt-7 grid-12 items-end max-sm:mt-3">
            <div className="col-[1/7] max-lg:col-span-full">
              <p data-intro className="eyebrow m-0 max-sm:hidden">
                The shop · Original paintings
              </p>
              <h1 id="shop-h" data-intro-line className="heading-1 mt-5 mb-0 max-sm:mt-0 max-sm:text-[38px]">
                <Line>Paintings to</Line>{' '}
                <Line>
                  <span className="text-secondary italic">live</span> with.
                </Line>
              </h1>
              <p data-intro className="lead mt-6 mb-0 max-sm:hidden">
                Every painting here is an original, so there is only ever one. Add the ones you love to your cart and confirm the details on the order page.
              </p>
              {SALE_WORKS.length > 0 && (
                <p data-intro className="mt-6 mb-0 inline-flex flex-wrap items-center gap-x-3 gap-y-1.5 rounded-ui bg-sale-wash px-4 py-3 text-sm/[22px] max-sm:mt-4 max-sm:px-3 max-sm:py-2 max-sm:text-[13px]/5">
                  <span className="rounded-full bg-sale px-2.5 py-0.5 text-[11px]/[18px] font-bold tracking-[.08em] text-on-primary uppercase">{SALE.percent}% off</span>
                  <span>
                    <b className="font-bold text-sale">{SALE.name}:</b> every original you can buy online is {SALE.percent}% off, saving you up to {formatINR(BEST_SAVING)}
                    {saleEndsLabel() ? `, until ${saleEndsLabel()}` : ''}.
                  </span>
                </p>
              )}
              <div data-intro className="mt-8 flex flex-wrap items-baseline gap-x-8 gap-y-3 max-sm:hidden">
                <span>
                  <b className="mr-1.5 font-display text-[34px] leading-none font-normal">{AVAILABLE}</b>available now
                </span>
                <span className="text-muted">
                  <b className="mr-1.5 font-display text-[34px] leading-none font-normal">{WORKS.length}</b>works in all
                </span>
                <TextLink to="/order" arrow>
                  Go to your cart
                </TextLink>
              </div>
            </div>
            <div data-intro aria-label="Newest paintings" className="col-[8/13] grid grid-cols-3 items-end gap-3.5 max-lg:hidden">
              {FEATURED.map((w, i) => (
                <Link key={w.id} to={`/artwork/${w.id}`} data-cursor="view" className={cx('group block text-primary no-underline hover:text-primary', i === 1 && '-translate-y-7')}>
                  <div className="flex aspect-[4/5] min-h-0 items-center justify-center overflow-hidden rounded-ui bg-mat p-3.5">
                    <img
                      src={w.img}
                      alt={w.alt}
                      className="block h-auto max-h-full w-auto max-w-full min-h-0 shadow-[0_2px_4px_rgba(34,33,31,.12),0_18px_30px_-16px_rgba(34,33,31,.5)] transition-transform duration-900 ease-gallery group-hover:-translate-y-1.5"
                    />
                  </div>
                  <span className="mt-2.5 block text-xs/4 text-muted">{w.title}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div data-intro className="sticky top-[var(--sale-h,0px)] z-40 border-y border-divider bg-page/96 backdrop-blur-sm">
        <div className="wrap flex flex-wrap items-center justify-between gap-x-6 gap-y-3 py-3.5 max-sm:py-2.5">
          <div role="group" aria-label="Filter by collection" className="no-scrollbar flex gap-2 overflow-x-auto p-0.5">
            {CHIPS.map((c) => (
              <Chip key={c.id} pressed={col === c.id} onClick={() => setCol(c.id)}>
                {c.title} <span className="font-medium opacity-55">{c.count}</span>
              </Chip>
            ))}
          </div>
          <div className="flex shrink-0 items-center gap-4 max-sm:w-full max-sm:justify-between">
            <Toggle pressed={availOnly} onClick={() => setAvailOnly((v) => !v)}>
              Available only
            </Toggle>
            <span role="status" className="text-[13px] whitespace-nowrap text-muted">
              {cards.length} {cards.length === 1 ? 'painting' : 'paintings'}
            </span>
          </div>
        </div>
      </div>

      <section aria-label="Paintings">
        <div className="wrap">
          <div
            ref={gridRef}
            className="grid grid-cols-4 gap-x-7 gap-y-14 pt-14 max-sm:pt-6 pb-[clamp(96px,11vw,150px)] max-xl:grid-cols-3 max-lg:grid-cols-2 max-lg:gap-x-5 max-lg:gap-y-11 max-sm:gap-x-3.5 max-sm:gap-y-9"
          >
            {cards.map((work) => (
              <ShopCard key={work.id} work={work} showCollection titleClassName="text-2xl/7 max-sm:text-[19px]/[23px]" />
            ))}
            {cards.length === 0 && (
              <div className="col-span-full flex flex-col items-start gap-5 border-y border-divider py-20">
                <p className="heading-2 m-0 font-light">Nothing here just yet.</p>
                <Button variant="secondary" onClick={reset}>
                  Show all paintings
                </Button>
              </div>
            )}
          </div>
        </div>
      </section>

      <FaqSection id="shop-faq-h" eyebrow="Buying an original" title="Good to *know.*" items={SHOP_FAQ} />

      <CtaBand
        id="shop-cta-h"
        eyebrow="Not quite it?"
        title="The right painting might not exist *yet.*"
        lead="Share an idea, a room or a wall, and we’ll shape something personal together."
      />
    </>
  );
}
