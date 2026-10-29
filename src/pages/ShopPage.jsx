import { useEffect, useMemo, useRef, useState } from 'react';
import cx from '@/utils/cx';
import { COLLECTIONS, STATUS, WORKS, availableWorks } from '@/data/works';
import { useMotionApi } from '@/motion/MotionContext';
import ArtworkCard from '@/components/art/ArtworkCard';
import CommissionBand from '@/components/sections/CommissionBand';
import PageIntro from '@/components/sections/PageIntro';
import { Select } from '@/components/form/Fields';
import { PageMandala } from '@/components/mandala/Mandala';
import Button from '@/components/ui/Button';
import TextLink from '@/components/ui/TextLink';
import { Accent, Line } from '@/components/ui/Typography';

const DEFAULTS = { col: 'all', avail: 'all', sort: 'curated' };
const CHIPS = [{ id: 'all', title: 'All' }, ...COLLECTIONS].map((c) => ({
  ...c,
  count: c.id === 'all' ? WORKS.length : WORKS.filter((w) => w.collection === c.id).length,
}));

/* the gallery wall: six column spans repeat down the page; on tablet every second work drops lower */
const SLOTS = ['col-[1/6]', 'col-[7/10]', 'col-[10/13]', 'col-[2/7]', 'col-[8/12]', 'col-[4/8]'];
const slotFor = (i) => cx(SLOTS[i % 6], 'max-lg:col-auto', i % 2 && 'max-lg:mt-20 max-sm:mt-0');

function filterWorks({ col, avail, sort }) {
  const list = WORKS.filter(
    (w) => (col === 'all' || w.collection === col) && (avail === 'all' || (avail === 'available') === (w.status === 'available'))
  );
  if (sort === 'title') return [...list].sort((a, b) => a.title.localeCompare(b.title));
  if (sort === 'status') return [...list].sort((a, b) => STATUS[a.status].rank - STATUS[b.status].rank);
  return list;
}

function Chip({ pressed, onClick, children }) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      onClick={onClick}
      className="inline-flex min-h-10 cursor-pointer items-center gap-2 rounded-[2px] border border-line bg-transparent px-4 font-sans text-[13px] font-semibold tracking-[.02em] whitespace-nowrap text-ink transition-colors duration-400 ease-gallery hover:border-ink aria-pressed:border-ink aria-pressed:bg-ink aria-pressed:text-paper"
    >
      {children}
    </button>
  );
}

export default function ShopPage() {
  const [filters, setFilters] = useState(DEFAULTS);
  const cards = useMemo(() => filterWorks(filters), [filters]);
  const filtered = filters.col !== 'all' || filters.avail !== 'all' || filters.sort !== 'curated';
  const set = (key) => (value) => setFilters((f) => ({ ...f, [key]: value }));
  const reset = () => setFilters(DEFAULTS);

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
  }, [filters, motion]);

  return (
    <>
      <PageIntro
        labelledBy="shop-h"
        crumbs={[{ label: 'Shop' }]}
        mandala={<PageMandala className="-top-[260px] -right-[240px] w-[760px] opacity-55" />}
      >
        <div className="col-[1/8] max-lg:col-span-full">
          <p data-intro className="eyebrow">
            The shop · Original works
          </p>
          <h1 id="shop-h" data-intro-line className="heading-1 mt-5">
            <Line>Paintings to</Line>
            <Line className="pl-[12%]">
              <Accent>live</Accent> with.
            </Line>
          </h1>
        </div>
        <div className="col-[9/13] self-end max-lg:col-span-full max-lg:mt-8">
          <p data-intro className="lead">
            Every original is one of a kind. Sold and archived works stay here too, marked clearly, so you can see the whole practice and commission something similar.
          </p>
          <p data-intro className="mt-6 flex flex-wrap gap-6 text-[13px]/5 font-semibold tracking-[.02em]">
            <span>
              <span className="mr-1.5 font-display text-[32px] font-normal">{WORKS.length}</span>works
            </span>
            <span className="text-success">
              <span className="mr-1.5 font-display text-[32px] font-normal">{availableWorks().length}</span>available now
            </span>
          </p>
          <div data-intro className="mt-5">
            <TextLink to="/order" arrow data-cursor="explore">
              Ready to order? Choose your works
            </TextLink>
          </div>
        </div>
      </PageIntro>

      <div data-intro className="sticky top-0 z-40 border-y border-divider bg-ivory">
        <div className="wrap flex flex-wrap items-center justify-between gap-x-8 gap-y-4 py-3.5 max-sm:gap-3">
          <div role="group" aria-label="Filter by collection" className="flex gap-2 overflow-x-auto p-0.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {CHIPS.map((c) => (
              <Chip key={c.id} pressed={filters.col === c.id} onClick={() => set('col')(c.id)}>
                {c.title} <span className="font-medium tabular-nums opacity-70">{c.count}</span>
              </Chip>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-3 max-sm:w-full">
            <label htmlFor="f-avail" className="meta font-semibold text-ink!">
              Show
            </label>
            <Select id="f-avail" value={filters.avail} onChange={(e) => set('avail')(e.target.value)}>
              <option value="all">Everything</option>
              <option value="available">Available now</option>
              <option value="other">Sold, archived &amp; inquiry</option>
            </Select>
            <label htmlFor="f-sort" className="meta font-semibold text-ink!">
              Sort
            </label>
            <Select id="f-sort" value={filters.sort} onChange={(e) => set('sort')(e.target.value)}>
              <option value="curated">Curated order</option>
              <option value="status">Available first</option>
              <option value="title">Title A–Z</option>
            </Select>
            <span aria-live="polite" className="meta tabular-nums">
              {cards.length} {cards.length === 1 ? 'work' : 'works'}
            </span>
            {filtered && (
              <button type="button" onClick={reset} className="inline-flex h-11 cursor-pointer items-center border-0 bg-transparent px-1 font-sans text-sm font-semibold text-cobalt">
                Reset
              </button>
            )}
          </div>
        </div>
      </div>

      <section aria-label="Artworks" className="pt-[clamp(64px,8vw,120px)] pb-[clamp(96px,11vw,160px)]">
        <div className="wrap">
          <div
            ref={gridRef}
            className="grid grid-cols-12 items-start gap-x-8 gap-y-28 max-lg:grid-cols-2 max-lg:gap-x-6 max-lg:gap-y-16 max-sm:grid-cols-1"
          >
            {cards.map((work, i) => (
              <ArtworkCard key={work.id} work={work} className={slotFor(i)} />
            ))}
            {cards.length === 0 && (
              <div className="col-span-full flex flex-col items-start gap-5 border-y border-divider py-24">
                <p className="eyebrow">No matches</p>
                <p className="font-display text-[clamp(32px,4vw,52px)] leading-[1.1] font-light">
                  Nothing matches — <span className="italic">yet.</span>
                </p>
                <p className="lead">Try another collection, or tell me what you were hoping to find. Many paintings begin exactly that way.</p>
                <div className="flex flex-wrap gap-4">
                  <Button variant="secondary" onClick={reset}>
                    Show Everything
                  </Button>
                  <Button to="/commission" data-cursor="talk">
                    Commission a Piece
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <CommissionBand
        id="shop-cta-h"
        eyebrow="Not quite it?"
        title="The right painting might not exist *yet.*"
        lead="Share an idea, a room or a wall, and we’ll shape something personal together."
      />
    </>
  );
}
