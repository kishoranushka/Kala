import { useEffect, useRef, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import cx from '@/utils/cx';
import { CONTACT } from '@/data/site';
import { WORKS, getWork, isAvailable, plateLabel, ratioOf } from '@/data/works';
import { useBag } from '@/context/BagContext';
import { cartOffLabel } from '@/components/art/CartButton';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import Button from '@/components/ui/Button';
import Disclosure from '@/components/ui/Disclosure';
import Icon from '@/components/ui/Icon';
import InverseSection from '@/components/sections/InverseSection';
import Notice from '@/components/ui/Notice';
import StatusBadge from '@/components/ui/StatusBadge';
import TextLink from '@/components/ui/TextLink';
import Toast from '@/components/ui/Toast';
import { RingMandala } from '@/components/mandala/Mandala';
import { SplitWords } from '@/components/ui/Typography';
import BagDrawer from './BagDrawer';
import FullscreenViewer from './FullscreenViewer';

/* Full view, the painting's detail crops, and (when photographed) the work in its room */
function viewsOf(work) {
  const views = [{ label: 'Full', origin: '50% 50%', scale: 1 }, ...work.details].map((v) => ({
    ...v,
    img: work.img,
    crop: work.crop,
    w: work.w,
    h: work.h,
    alt: work.alt,
  }));
  if (work.room) {
    views.push({ label: work.room.label, origin: '50% 50%', scale: 1, ...work.room, crop: false, alt: `${work.title}, ${work.room.label.toLowerCase()}` });
  }
  return views;
}

/* works from the same collection first */
const relatedTo = (work) =>
  WORKS.filter((w) => w.id !== work.id)
    .sort((a, b) => (b.collection === work.collection) - (a.collection === work.collection))
    .slice(0, 3);

const ITALIC_NOTE = 'font-display text-2xl/[30px] italic';

/* works that can't be bought still show the cart button, disabled, with the reason */
function CartOff({ work }) {
  return (
    <Button block disabled aria-label={`Add to cart is unavailable: this work is ${cartOffLabel(work)}`} className="cursor-not-allowed opacity-42 before:hidden">
      Add to Cart · {cartOffLabel(work)}
    </Button>
  );
}

function StatusActions({ work, inBag, adding, onAdd, onOpenBag }) {
  if (work.status === 'available') {
    return (
      <>
        {inBag ? (
          <>
            <Notice tone="ok" role="status">
              This original is in your cart.
            </Notice>
            <Button block onClick={onOpenBag}>
              View Cart
            </Button>
          </>
        ) : (
          <div>
            <Button block data-magnetic onClick={onAdd} aria-busy={adding}>
              {adding ? 'Adding…' : 'Add to Cart'}
            </Button>
            <span
              aria-hidden="true"
              className="-mt-0.5 block h-0.5 origin-left bg-link transition-transform duration-700 ease-gallery"
              style={{ transform: `scaleX(${adding ? 1 : 0})` }}
            />
          </div>
        )}
        <Button variant="secondary" block to={`/order?work=${work.id}`} data-cursor="explore">
          Order This Work
        </Button>
        <TextLink to="/contact" data-cursor="talk" className="self-start">
          Ask a question about it
        </TextLink>
        <p className="meta mt-1">One original, so there is only ever one. Add your details and pay securely on the order page.</p>
      </>
    );
  }
  if (work.status === 'sold') {
    return (
      <>
        <CartOff work={work} />
        <p className={ITALIC_NOTE}>This painting has found its home.</p>
        <Button block to="/commission" data-magnetic data-cursor="talk">
          Commission Something Similar
        </Button>
        <Button variant="secondary" block to="/shop">
          See Available Works
        </Button>
      </>
    );
  }
  if (work.status === 'inquiry') {
    return (
      <>
        <CartOff work={work} />
        <p className={ITALIC_NOTE}>Shown as an example of personal work.</p>
        <p className="meta">Pieces like this are made for someone. Tell me what you have in mind.</p>
        <Button block to="/commission" data-magnetic data-cursor="talk">
          Enquire About This Work
        </Button>
      </>
    );
  }
  return (
    <>
      <CartOff work={work} />
      <p className={ITALIC_NOTE}>Murals stay where they were painted.</p>
      <Button block to="/commission" data-magnetic data-cursor="talk">
        Commission a Wall
      </Button>
      <Button variant="secondary" block to="/archive">
        See the Archive
      </Button>
    </>
  );
}

function ArtworkView({ work }) {
  const { bag, add, openDrawer } = useBag();
  const [viewIndex, setViewIndex] = useState(0);
  const [adding, setAdding] = useState(false);
  const [toast, setToast] = useState(false);
  const [viewer, setViewer] = useState(false);
  const viewerButton = useRef(null);
  const timers = useRef({});

  useEffect(() => {
    const t = timers.current;
    return () => Object.values(t).forEach(clearTimeout);
  }, []);

  const views = viewsOf(work);
  const current = views[viewIndex] ?? views[0];
  const story = work.details[0] ?? { origin: '50% 50%', scale: 1.6 };
  const available = isAvailable(work);
  const inBag = available && bag.includes(work.id);

  const addToBag = () => {
    if (adding || inBag) return;
    setAdding(true);
    timers.current.add = setTimeout(() => {
      add(work.id);
      setAdding(false);
      setToast(true);
      clearTimeout(timers.current.toast);
      timers.current.toast = setTimeout(() => setToast(false), 4500);
    }, 700);
  };
  const viewBag = () => {
    setToast(false);
    openDrawer();
  };

  return (
    <>
      {/* ============================== ENTER THE CANVAS */}
      <section aria-labelledby="aw-title" className="pt-[clamp(24px,3vw,40px)] pb-[clamp(96px,11vw,160px)]">
        <div className="wrap">
          <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Shop', to: '/shop' }, { label: work.title }]} />
          <div className="mt-6 grid grid-cols-12 items-start gap-x-8">
            <div className="col-[1/8] max-lg:col-span-full">
              <div data-intro-wipe className="relative flex justify-center overflow-hidden bg-wall p-[clamp(28px,5vw,72px)]">
                <RingMandala
                  stroke="var(--color-oak)"
                  spin={240}
                  rings={[186]}
                  className="absolute top-1/2 left-1/2 w-[140%] -translate-x-1/2 -translate-y-1/2 opacity-50"
                />
                <div
                  data-intro-img
                  data-tilt
                  data-cursor="view"
                  className="relative max-w-full overflow-hidden shadow-float"
                  style={{ aspectRatio: `${current.w} / ${current.h}`, width: `min(100%, calc(76vh * ${(current.w / current.h).toFixed(3)}))` }}
                >
                  <img
                    src={current.img}
                    alt={current.alt}
                    fetchpriority="high"
                    className={cx('block size-full object-cover transition-transform duration-1100 ease-gallery', current.crop && 'crop-ig')}
                    style={{ transform: `scale(${current.scale})`, transformOrigin: current.origin }}
                  />
                </div>
              </div>

              <div data-intro className="flex flex-wrap items-end justify-between gap-4">
                <div role="group" aria-label="Choose a view" className="mt-5 flex flex-wrap items-start gap-4">
                  {views.map((v, i) => (
                    <button
                      key={v.label}
                      type="button"
                      aria-pressed={i === viewIndex}
                      onClick={() => setViewIndex(i)}
                      className="group flex cursor-pointer flex-col items-start gap-2 border-0 bg-transparent p-0 font-sans text-xs/4 font-semibold text-muted aria-pressed:text-primary"
                    >
                      <span className="relative size-[72px] overflow-hidden shadow-[0_0_0_1px_var(--color-divider)] transition-shadow duration-400 ease-gallery group-aria-pressed:shadow-[0_0_0_2px_var(--color-page),0_0_0_3px_var(--color-primary)] max-sm:size-[60px]">
                        <img
                          src={v.img}
                          alt=""
                          loading="lazy"
                          className={cx('block size-full object-cover', v.crop && 'crop-ig')}
                          style={{ transform: `scale(${v.scale})`, transformOrigin: v.origin }}
                        />
                      </span>
                      {v.label}
                    </button>
                  ))}
                </div>
                <button
                  ref={viewerButton}
                  type="button"
                  onClick={() => setViewer(true)}
                  className="inline-flex h-11 cursor-pointer items-center gap-2 border-0 bg-transparent p-0 font-sans text-sm font-semibold text-primary"
                >
                  <Icon name="expand" />
                  View full screen
                </button>
              </div>
              <p data-intro className="meta mt-4">
                Colours may vary slightly on screen. Details are crops of the same photograph; room views are real photographs of the work.
              </p>
            </div>

            <aside aria-label="About this work" className="sticky top-24 col-[9/13] max-lg:static max-lg:col-span-full max-lg:mt-12">
              <p data-intro className="eyebrow">
                {plateLabel(work)}
              </p>
              <h1 id="aw-title" data-intro className="mt-4 font-display text-[clamp(40px,4.6vw,68px)] leading-none font-light tracking-[-.015em]">
                {work.title}
              </h1>
              <p data-intro className="meta mt-3">
                by {CONTACT.artist}
              </p>
              <dl data-intro className="my-7 grid grid-cols-[auto_1fr] gap-x-6 gap-y-2.5 border-y border-divider py-5 text-sm/[22px] [&_dd]:m-0 [&_dd]:font-semibold [&_dt]:font-medium [&_dt]:text-muted">
                <dt>Medium</dt>
                <dd>{work.medium}</dd>
                <dt>Dimensions</dt>
                <dd>{work.size}</dd>
                <dt>Year</dt>
                <dd>{work.year}</dd>
                <dt>{work.status === 'archived' ? 'Site' : 'Framing'}</dt>
                <dd>{work.framing}</dd>
              </dl>
              <div data-intro className="flex items-center justify-between gap-4">
                <StatusBadge status={work.status} />
                {available && <span className="price text-[22px]">{work.price}</span>}
              </div>

              <div data-intro className="mt-6 flex flex-col gap-3">
                <StatusActions work={work} inBag={inBag} adding={adding} onAdd={addToBag} onOpenBag={viewBag} />
              </div>

              <div data-intro className="mt-8">
                <Disclosure title="Shipping & delivery">[Shipping details to be supplied: where you ship, how paintings are packed, and how long it usually takes.]</Disclosure>
                <Disclosure title="Framing & care">[Framing and care notes to be supplied.]</Disclosure>
                <Disclosure title="Returns">[Returns policy to be supplied.]</Disclosure>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* ============================== THE STORY */}
      <section aria-labelledby="story-h" className="pb-[clamp(96px,11vw,160px)]">
        <div className="wrap">
          <div className="grid-12 items-center">
            <div className="col-[1/6] self-center max-lg:col-span-full">
              <p data-eyebrow className="eyebrow">
                About this work
              </p>
              <h2 id="story-h" data-cap className="heading-2 mt-5 font-light">
                {work.title}
              </h2>
              <p data-cap className="mt-7 max-w-[30ch] font-display text-[clamp(24px,2.4vw,32px)] leading-[1.35] italic">
                {work.note}
              </p>
              <div data-line className="mt-8 h-px w-16 bg-secondary" />
            </div>
            <div className="col-[7/13] max-lg:col-span-full max-lg:mt-12">
              <div data-reveal data-noinner data-cursor="view" className="relative aspect-[4/5] overflow-hidden rounded-ui bg-wall shadow-hang">
                <img
                  src={work.img}
                  alt={`Detail of ${work.title}`}
                  loading="lazy"
                  className={cx('block size-full object-cover', work.crop && 'crop-ig')}
                  style={{ transform: `scale(${story.scale})`, transformOrigin: story.origin }}
                />
              </div>
              <p data-cap className="meta mt-3.5">
                Detail · {work.title}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============================== RELATED */}
      <InverseSection aria-labelledby="rel-h" className="py-[clamp(88px,10vw,144px)]">
        <div className="wrap">
          <div className="mb-[clamp(48px,6vw,80px)] flex flex-wrap items-end justify-between gap-6">
            <div>
              <p data-eyebrow className="eyebrow">
                Keep looking
              </p>
              <SplitWords id="rel-h" text="More to *live* with." className="heading-2 mt-5 font-light" />
            </div>
            <TextLink to="/shop" tone="inverse" arrow>
              All works
            </TextLink>
          </div>
          <div data-stagger className="grid grid-cols-3 items-start gap-8 max-lg:grid-cols-2 max-sm:grid-cols-1">
            {relatedTo(work).map((r, i) => (
              <Link
                key={r.id}
                to={`/artwork/${r.id}`}
                data-cursor="view"
                aria-label={`View ${r.title}`}
                className={cx(
                  'group flex flex-col gap-3.5 text-left text-on-primary',
                  i === 1 && 'mt-[72px] max-lg:mt-12 max-sm:mt-0',
                  i === 2 && 'max-lg:hidden'
                )}
              >
                <span className="relative overflow-hidden rounded-ui bg-wall shadow-hang" style={{ aspectRatio: ratioOf(r) }}>
                  <img
                    src={r.img}
                    alt=""
                    loading="lazy"
                    className={cx('block size-full object-cover transition-transform duration-1400 ease-gallery group-hover:scale-[1.04]', r.crop && 'crop-ig')}
                  />
                </span>
                <span className="flex items-baseline justify-between gap-3">
                  <span className="eyebrow">{plateLabel(r)}</span>
                  <StatusBadge status={r.status} marker={false} tone="text-on-primary" />
                </span>
                <span className="art-title">{r.title}</span>
              </Link>
            ))}
          </div>
        </div>
      </InverseSection>

      {/* ============================== MOBILE BUY BAR */}
      {available && !inBag && (
        <div className="fixed right-0 bottom-0 left-0 z-55 hidden items-center justify-between gap-4 bg-surface px-5 py-3 shadow-[0_-12px_32px_-16px_rgba(34,33,31,.3)] max-lg:flex">
          <span className="flex min-w-0 flex-col">
            <span className="truncate font-display text-xl/6 font-medium">{work.title}</span>
            <span className="price">{work.price}</span>
          </span>
          <Button onClick={addToBag} aria-busy={adding}>
            {adding ? 'Adding…' : 'Add to Cart'}
          </Button>
        </div>
      )}

      {toast && (
        <Toast action="View cart" onAction={viewBag}>
          Added to your cart
        </Toast>
      )}
      <BagDrawer />
      {viewer && (
        <FullscreenViewer
          work={work}
          onClose={() => {
            setViewer(false);
            viewerButton.current?.focus();
          }}
        />
      )}
    </>
  );
}

export default function ArtworkPage() {
  const { id } = useParams();
  const work = getWork(id);
  if (!work) return <Navigate to="/shop" replace />;
  return <ArtworkView key={work.id} work={work} />;
}
