import { Link } from 'react-router-dom';
import cx from '@/utils/cx';
import { CONTACT } from '@/data/site';
import { PHOTOS, STUDIO, getWork, ratioOf } from '@/data/works';
import { usePageMotion } from '@/motion/MotionContext';
import InverseSection from '@/components/sections/InverseSection';
import PageTop from '@/components/sections/PageTop';
import Button from '@/components/ui/Button';
import TextLink from '@/components/ui/TextLink';
import { Line, SplitWords } from '@/components/ui/Typography';

/* the studio row: works and photographs at varied sizes, dropping to different heights */
const LANDSCAPE = [
  { work: 'chalk', width: 'clamp(280px,34vw,520px)', caption: 'On a wall, beside the work', alt: 'The artist beside her Think Out of the Box chalkboard mural' },
  { work: 'ganesha', width: 'clamp(200px,20vw,300px)', drop: 80, caption: 'Devotional, in saffron', alt: 'Ganesha in blue and saffron on black' },
  { photo: 'lotus', ratio: '4 / 5', position: '50% 60%', width: 'clamp(240px,26vw,400px)', caption: 'Where the work begins' },
  { work: 'om', width: 'clamp(260px,30vw,460px)', drop: 40, caption: 'Dot by dot', alt: 'The Om Mandala in dot work on ultramarine' },
  { work: 'child', width: 'clamp(220px,22vw,340px)', caption: 'A personal piece', alt: 'The child portrait in rose and violet' },
  { work: 'krishna', width: 'clamp(260px,28vw,420px)', drop: 120, caption: 'Colour first, then line', alt: 'Krishna and Radha in cobalt, teal and saffron' },
  { photo: 'paints', width: 'clamp(320px,38vw,600px)', drop: 24, caption: 'The paint table' },
  { work: 'vitthal', width: 'clamp(240px,24vw,360px)', drop: 96, caption: 'Gold on indigo', alt: 'Vitthal in saffron and gold on indigo' },
];

const METHOD = [
  { num: 'I', title: 'Observe', work: 'child', scale: 2, origin: '50% 36%', alt: 'Close-up of the child portrait’s face', note: '[How you look before you paint: references, sketches, memory.]' },
  { num: 'II', title: 'Layer', work: 'ganesha', scale: 2.4, origin: '52% 28%', alt: 'Close-up of Ganesha’s eye and blue brushwork', note: '[What you paint with, and how a surface builds up.]', className: 'mt-24 max-sm:mt-0 max-sm:ml-[12%]' },
  { num: 'III', title: 'Resolve', work: 'om', scale: 2.6, origin: '50% 48%', alt: 'Close-up of the dot work around the Om', note: '[How you know a piece is finished.]', className: 'mt-10 max-lg:mt-0 max-sm:mr-[12%]' },
];

const MAKES = ['Paintings', 'Mandalas', 'Wall murals', 'Painted wearables', 'Face paint'];

const MILESTONES = [
  { year: '[Year]', title: '[Milestone]', note: '[A line about it]' },
  { year: '[Year]', title: '[Milestone]', note: '[A line about it]' },
  { year: '[Year]', title: '[Milestone]', note: '[A line about it]' },
  { year: 'Now', title: 'Taking commissions', note: 'Paintings, portraits and walls.' },
];

/* desktop: the studio row drifts sideways as you scroll past it, and the portrait steps forward */
function artistMotion({ gsap, one, d, canScroll }) {
  if (!canScroll || !d.desktop) return;
  const track = one('[data-drift]');
  if (track) {
    const wrap = track.parentNode;
    gsap.fromTo(
      track,
      { x: 0 },
      {
        x: () => -Math.max(0, track.scrollWidth - wrap.clientWidth),
        ease: 'none',
        scrollTrigger: { trigger: wrap, start: 'top 85%', end: 'bottom 10%', scrub: true, invalidateOnRefresh: true },
      }
    );
  }
  const portrait = one('[data-portrait]');
  if (portrait) gsap.to(portrait, { y: -60, ease: 'none', scrollTrigger: { trigger: portrait, start: 'top 60%', end: 'bottom top', scrub: true } });
}

function Numbered({ num, size = 'text-[32px]', title }) {
  return (
    <span className="flex items-baseline gap-3.5">
      <span className={cx('font-display text-secondary italic', size)}>{num}</span>
      <span className="art-title">{title}</span>
    </span>
  );
}

function LandscapeItem({ item, index }) {
  const work = item.work && getWork(item.work);
  const photo = item.photo && STUDIO[item.photo];
  const frame = 'relative block overflow-hidden rounded-ui bg-wall shadow-hang';
  const image = (
    <img
      src={(work ?? photo).img}
      alt={item.alt ?? photo.alt}
      loading="lazy"
      className={cx('block size-full object-cover', work?.crop && 'crop-ig')}
      style={{ objectPosition: item.position }}
    />
  );

  return (
    <figure className="m-0 shrink-0 max-lg:snap-start" style={{ width: item.width, marginBottom: item.drop }}>
      {work ? (
        <Link to={`/artwork/${work.id}`} data-cursor="view" aria-label={`View ${work.title}`} className={frame} style={{ aspectRatio: ratioOf(work) }}>
          {image}
        </Link>
      ) : (
        <div className={frame} style={{ aspectRatio: item.ratio ?? ratioOf(photo) }}>
          {image}
        </div>
      )}
      <figcaption className="meta mt-3.5">
        <span className="font-bold text-secondary">0{index + 1}</span> · {item.caption}
      </figcaption>
    </figure>
  );
}

export default function ArtistPage() {
  usePageMotion(artistMotion);
  const escape = getWork('escape');

  return (
    <>
      {/* ============================== HELLO */}
      <PageTop labelledBy="ar-h" crumbs={[{ label: 'The Artist' }]} bodyClassName="mt-6 grid-12">
        <div className="relative z-2 col-[1/6] self-center max-lg:col-span-full">
          <p data-intro className="eyebrow m-0">
            The artist
          </p>
          <h1 id="ar-h" data-intro-line className="heading-1 mt-5 mb-0">
            <Line>Hello, I’m</Line>
            <Line>
              <span className="font-normal text-secondary italic">{CONTACT.artist}.</span>
            </Line>
          </h1>
          <p data-intro className="lead mt-7 mb-0">
            [One or two sentences in your own words: who you are, what you paint, and where you paint it.]
          </p>
          <ul data-intro aria-label="What I make" className="m-0 mt-7 flex list-none flex-wrap gap-2 p-0">
            {MAKES.map((m) => (
              <li key={m} className="rounded-full border border-[#CFC6B8] bg-surface/60 px-3.5 py-1.5 text-[13px]/5 font-medium text-soft">
                {m}
              </li>
            ))}
          </ul>
          <div data-intro className="mt-8 flex flex-wrap items-center gap-x-7 gap-y-4">
            <Button to="/commission" data-magnetic data-cursor="talk">
              Commission Me
            </Button>
            <TextLink to={CONTACT.instagram} arrow>
              Follow {CONTACT.instagramHandle}
            </TextLink>
          </div>
          <p data-intro className="mt-9 mb-0 font-display text-[28px]/[34px] italic">
            Think beyond the frame.
          </p>
        </div>
        <div className="relative col-[6/13] pt-6 pb-[72px] max-lg:col-span-full max-lg:mt-10 max-lg:max-w-[640px] max-sm:pb-12">
          <figure data-intro className="relative z-1 m-0 ml-[24%] aspect-[3/4] w-[58%] overflow-hidden rounded-ui bg-wall shadow-float max-sm:ml-[18%] max-sm:w-[70%]">
            <img src={PHOTOS.park.img} alt={PHOTOS.park.alt} fetchpriority="high" className="block size-full object-cover object-[50%_45%]" />
          </figure>
          <figure data-intro className="absolute top-0 right-0 z-2 m-0 aspect-[3/4] w-[28%] rotate-4 overflow-hidden rounded-ui border-6 border-surface bg-wall shadow-float max-sm:w-[34%]">
            <img src={PHOTOS.pot.img} alt={PHOTOS.pot.alt} loading="lazy" className="block size-full object-cover" />
          </figure>
          <figure data-intro data-portrait className="absolute bottom-0 left-0 z-2 m-0 aspect-[3/4] w-[36%] -rotate-4 overflow-hidden rounded-ui border-6 border-surface bg-wall shadow-float max-sm:bottom-6 max-sm:w-[42%]">
            <img src={PHOTOS.cobalt.img} alt={PHOTOS.cobalt.alt} loading="lazy" className="block size-full object-cover object-[50%_30%]" />
          </figure>
          <span data-intro aria-hidden="true" className="absolute right-[4%] bottom-4 font-display text-[22px]/7 text-muted italic max-sm:hidden">
            Painter · Muralist · Maker
          </span>
        </div>
      </PageTop>

      {/* ============================== THE STUDIO AS A LANDSCAPE */}
      <section aria-labelledby="land-h" className="pt-[clamp(64px,8vw,120px)] pb-[clamp(96px,11vw,160px)]">
        <div className="wrap mb-[clamp(48px,6vw,80px)] flex flex-wrap items-end justify-between gap-6">
          <div>
            <p data-eyebrow className="eyebrow">
              01 · The studio as a landscape
            </p>
            <SplitWords id="land-h" text="Walls, canvases, and the *places* between." className="heading-2 mt-5 max-w-[14ch] font-light" />
          </div>
          <p data-cap className="meta my-[1em] max-w-[32ch]">
            Scroll on: the row drifts with you. On a phone, swipe it.
          </p>
        </div>
        <div
          role="region"
          aria-label="Works and studio, a horizontal row"
          tabIndex={0}
          className="overflow-hidden max-lg:snap-x max-lg:snap-mandatory max-lg:overflow-x-auto max-lg:[scrollbar-width:thin]"
        >
          <div data-drift className="flex w-max items-end gap-8 px-16 max-lg:px-10 max-sm:gap-5 max-sm:px-5">
            {LANDSCAPE.map((item, i) => (
              <LandscapeItem key={i} item={item} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ============================== MATERIALS, MEMORY AND METHOD */}
      <section aria-labelledby="method-h" className="pb-[clamp(96px,11vw,160px)]">
        <div className="wrap">
          <div className="mb-[clamp(56px,7vw,96px)] max-w-[760px]">
            <p data-eyebrow className="eyebrow">
              02 · Materials, memory and method
            </p>
            <SplitWords id="method-h" text="Three movements in every *painting.*" className="heading-2 mt-5 font-light" />
          </div>
          <div className="grid grid-cols-3 items-start gap-8 max-lg:grid-cols-2 max-sm:grid-cols-1">
            {METHOD.map((m) => {
              const work = getWork(m.work);
              return (
                <figure key={m.num} data-cap className={cx('m-0', m.className)}>
                  <div data-reveal data-noinner className="relative aspect-[4/5] overflow-hidden rounded-ui bg-wall shadow-hang">
                    <img
                      src={work.img}
                      alt={m.alt}
                      loading="lazy"
                      className="absolute inset-0 size-full object-cover"
                      style={{ transform: `scale(${m.scale})`, transformOrigin: m.origin }}
                    />
                  </div>
                  <figcaption className="mt-5">
                    <Numbered num={m.num} title={m.title} />
                    <p className="meta mt-2.5 text-sm/[22px] text-soft!">{m.note}</p>
                  </figcaption>
                </figure>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============================== TWO PRACTICES (dark) */}
      <InverseSection aria-labelledby="two-h" className="py-[clamp(96px,11vw,160px)]">
        <div className="wrap">
          <div className="grid-12">
            <div className="col-[1/7] self-center max-lg:col-span-full">
              <p data-eyebrow className="eyebrow">
                03 · Two practices
              </p>
              <SplitWords id="two-h" text="A little logic. ~A~ ~lot~ ~of~ ~imagination.~" className="heading-2 mt-5 font-light" />
              <p data-cap className="lead mt-7">
                [A short paragraph in your words: building software by day, painting by passion, and what each one teaches the other.]
              </p>
              <p data-cap className="mt-10 max-w-[26ch] font-display text-[clamp(24px,2.4vw,32px)] leading-[1.35] italic">
                “Logic creates structure; art creates room for interpretation.”
              </p>
            </div>
            <div className="col-[8/13] max-lg:col-span-full max-lg:mt-14 max-lg:max-w-[440px]">
              <Link
                to={`/artwork/${escape.id}`}
                data-cursor="view"
                data-reveal
                aria-label={`View ${escape.title}`}
                className="relative block overflow-hidden rounded-ui bg-wall shadow-[0_40px_80px_-40px_rgba(0,0,0,.6)]"
                style={{ aspectRatio: ratioOf(STUDIO.easel) }}
              >
                <img
                  src={STUDIO.easel.img}
                  alt="The Escape Key Exists for a Reason on its small wooden easel: a figure climbs out of a dark keyboard, lifting the Esc key"
                  loading="lazy"
                  className="block size-full object-cover"
                />
              </Link>
              <p className="meta mt-4 text-on-primary-muted!">{escape.title} · 2026. Both practices, on one small canvas.</p>
            </div>
          </div>
        </div>
      </InverseSection>

      {/* ============================== ALONG THE WAY */}
      <section aria-labelledby="tl-h" className="py-[clamp(96px,11vw,160px)]">
        <div className="wrap">
          <div className="grid-12">
            <div className="col-[1/5]">
              <p data-eyebrow className="eyebrow">
                04 · Along the way
              </p>
              <SplitWords id="tl-h" text="Milestones, *kept* honestly." className="heading-2 mt-5 font-light" />
              <p data-cap className="meta mt-5 max-w-[30ch]">
                Only what’s true goes here: a first mural, a first commission, a show. Leave it short if it’s short.
              </p>
            </div>
            <ol data-stagger className="col-[6/13] m-0 list-none p-0">
              {MILESTONES.map((m, i) => (
                <li key={i} className="grid grid-cols-[160px_1fr] items-baseline gap-8 border-b border-divider py-7 max-sm:grid-cols-1 max-sm:gap-2">
                  <span className="font-display text-[40px] leading-none font-light text-secondary">{m.year}</span>
                  <span>
                    <span className="art-title block">{m.title}</span>
                    <span className="meta">{m.note}</span>
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* ============================== A PERSONAL NOTE */}
      <section aria-labelledby="note-h" className="pb-[clamp(96px,11vw,160px)]">
        <div className="wrap max-w-[980px]">
          <p data-eyebrow id="note-h" className="eyebrow">
            05 · A personal note
          </p>
          <SplitWords
            as="p"
            text="[A few warm lines to whoever is reading: why you *paint.]*"
            className="mt-6 font-display text-[clamp(30px,3.6vw,52px)] leading-[1.2] font-light"
          />
          <p data-cap className="mt-8 font-display text-[28px] text-secondary italic">
            — {CONTACT.artist}
          </p>
          <div data-cap className="mt-12 flex flex-wrap gap-4">
            <Button to="/shop" arrow data-magnetic data-cursor="explore">
              Explore the Art
            </Button>
            <Button variant="secondary" to="/commission" data-magnetic data-cursor="talk">
              Commission a Piece
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
