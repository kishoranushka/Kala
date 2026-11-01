import cx from '@/utils/cx';
import { CONTACT } from '@/data/site';
import { STUDIO, getWork } from '@/data/works';
import ArtLink from '@/components/art/ArtLink';
import TextLink from '@/components/ui/TextLink';
import { SplitWords } from '@/components/ui/Typography';
import { HOME_H2 } from '../homeContent';

/* each step's columns on desktop; two up on tablet, one column on phones */
const SLOTS = ['col-[1/4]', 'col-[4/7]', 'col-[7/9]', 'col-[9/13]'].map((c) => `${c} max-lg:col-auto`);

function Step({ index, word, note, children }) {
  return (
    <figure data-hs className={cx('relative m-0', SLOTS[index])}>
      {children}
      <figcaption className="mt-4 flex items-baseline gap-3">
        <span className="font-display text-2xl text-secondary italic">0{index + 1}</span>
        <span className="text-sm/[22px]">
          <b className="font-semibold">{word}</b> <span className="text-soft">{note}</span>
        </span>
      </figcaption>
    </figure>
  );
}

function Photo({ src, alt, ratio, position, ...props }) {
  return (
    <div data-reveal className={cx('relative overflow-hidden bg-wall shadow-hang', ratio)} {...props}>
      <img src={src} alt={alt} loading="lazy" className="block size-full object-cover" style={{ objectPosition: position }} />
    </div>
  );
}

/* 03 · The artist's hand — four steps from sketchbook to finished canvas */
export default function HandSection() {
  const om = getWork('om');

  return (
    <section id="hand" data-chapter="03 · The artist's hand" aria-labelledby="hand-h" className="pt-[clamp(96px,11vw,160px)] pb-[clamp(88px,10vw,144px)]">
      <div className="wrap">
        <div className="grid-12">
          <div className="col-[1/8] max-lg:col-span-full">
            <p data-eyebrow className="eyebrow">
              03 · The artist's hand
            </p>
            <SplitWords id="hand-h" text="From the first line to the *last* *layer*." className={cx(HOME_H2, 'max-w-[15ch] font-normal')} />
          </div>
          <p data-cap className="col-[9/13] self-end text-soft max-lg:col-span-full">
            [Two or three true sentences: where you paint, what you reach for first, what a day in the studio feels like.]
          </p>
        </div>

        <div className="relative mt-24 grid grid-cols-12 items-end gap-x-8 max-xl:gap-x-6 max-lg:mt-16 max-lg:grid-cols-2 max-lg:gap-y-12 max-sm:grid-cols-1 max-sm:gap-y-14">
          <div data-thread aria-hidden="true" className="absolute inset-x-0 top-[46%] border-t border-dashed border-line max-lg:hidden" />
          <Step index={0} word="Observe." note="Lotus studies in the sketchbook.">
            <Photo src={STUDIO.lotus.img} alt={STUDIO.lotus.alt} ratio="aspect-[4/5]" position="50% 60%" />
          </Step>
          <Step index={1} word="Layer." note="Paints out, a pot waiting for colour.">
            <Photo src={STUDIO.paints.img} alt={STUDIO.paints.alt} ratio="aspect-square" position="46% 50%" />
          </Step>
          <Step index={2} word="Detail." note="Dot by dot, ring by ring.">
            <div data-reveal data-noinner data-cursor="view" className="relative aspect-[3/4] overflow-hidden shadow-hang">
              <img
                data-zoom
                src={om.img}
                alt="Close-up of the dot work around the Om: blue-and-white dot eyes, yellow dots and red dot rings"
                loading="lazy"
                className="block size-full object-cover"
              />
            </div>
          </Step>
          <Step index={3} word="Resolve." note="Om Mandala, finished.">
            <ArtLink work={om} aria-label="View Om Mandala, finished" />
          </Step>
        </div>

        <div className="grid-12 mt-[clamp(64px,8vw,120px)]">
          <blockquote data-cap className="col-[2/9] m-0 p-0 max-lg:col-span-full">
            <p className="font-display text-[clamp(28px,3vw,40px)] leading-[1.3] font-normal italic">“Logic creates structure; art creates room for interpretation.”</p>
            <footer className="meta mt-5">— {CONTACT.artist}</footer>
          </blockquote>
          <div data-cap className="col-[10/13] self-end max-lg:col-span-full max-lg:mt-8">
            <TextLink to="/artist" arrow>
              Meet the artist
            </TextLink>
          </div>
        </div>
      </div>
    </section>
  );
}
