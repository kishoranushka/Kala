import { CONTACT } from '@/data/site';
import { PHOTOS } from '@/data/works';
import { FlowerGlyph } from '@/components/mandala/Mandala';
import { SplitWords } from '@/components/ui/Typography';
import { ArrowLink } from '@/components/sections/SectionHead';

const MOMENTS = [
  { photo: PHOTOS.exhibition, title: 'Exhibited', note: '[Show, city, year]', position: '50% 30%' },
  { photo: PHOTOS.childSketch, title: 'It starts with a line', note: 'A sketch before the paint' },
  { photo: PHOTOS.outdoors, title: 'Painted outdoors', note: 'Little Buddha, brush still in hand', position: '50% 35%' },
];

const OFF_CANVAS = [
  { photo: PHOTOS.gown, shape: 'aspect-[2/3]' },
  { photo: PHOTOS.faceClose, shape: 'aspect-[3/2] max-sm:col-span-full max-sm:-order-1' },
  { photo: PHOTOS.faceRose, shape: 'aspect-[2/3]' },
];

export default function MeetSection() {
  const first = CONTACT.artist.split(' ')[0];
  return (
    <section aria-labelledby="meet-h" className="bg-page py-[clamp(96px,11vw,150px)]">
      <div className="wrap">
        <div className="grid grid-cols-12 items-center gap-8 max-lg:grid-cols-1">
          <div className="relative col-[1/6] max-lg:col-span-full max-lg:max-w-[440px]">
            <div data-reveal className="relative z-1 aspect-[1139/1600] overflow-hidden rounded-[999px_999px_28px_28px] shadow-[0_40px_70px_-40px_rgba(34,33,31,.45)]">
              <img src={PHOTOS.withPeacock.img} alt={PHOTOS.withPeacock.alt} loading="lazy" className="block size-full object-cover" />
            </div>
            <FlowerGlyph tint="peach" className="absolute top-[12%] -right-9 z-2 size-[120px] max-sm:-right-3 max-sm:size-[90px]" />
          </div>
          <div className="col-[7/13] max-lg:col-span-full max-lg:mt-6">
            <p data-eyebrow className="eyebrow-lg m-0">
              The artist
            </p>
            <SplitWords id="meet-h" text={`Hi, I’m *${first}.*`} className="heading-section mt-3.5 mb-0" />
            <p data-cap className="lead-lg mt-5 mb-0">
              [Two or three lines in your words: where you’re from, how you started painting, and what you love to paint.]
            </p>
            <div data-cap className="mt-7">
              <ArrowLink to="/artist">More about me</ArrowLink>
            </div>
            <div data-stagger className="mt-10 grid grid-cols-3 gap-4 max-sm:gap-2.5">
              {MOMENTS.map((m) => (
                <figure key={m.title} className="m-0">
                  <div className="aspect-[3/4] overflow-hidden rounded-ui bg-mat">
                    <img src={m.photo.img} alt={m.photo.alt} loading="lazy" className="block size-full object-cover" style={m.position ? { objectPosition: m.position } : undefined} />
                  </div>
                  <figcaption className="mt-2.5 text-[13px]/[19px] text-muted max-sm:text-xs/[17px]">
                    <b className="block font-semibold text-primary">{m.title}</b>
                    {m.note}
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-[clamp(80px,9vw,128px)] grid grid-cols-12 items-end gap-8 border-t border-divider pt-[clamp(56px,6vw,80px)] max-lg:grid-cols-1">
          <div className="col-[1/5] max-lg:col-span-full">
            <p data-eyebrow className="eyebrow-lg m-0">
              Off the canvas
            </p>
            <h3 data-cap className="heading-section mt-3.5 mb-0 text-[clamp(32px,3.4vw,48px)]!">
              Face paint &amp; <em>costume.</em>
            </h3>
            <p data-cap className="mt-4 mb-0 max-w-[34ch] text-base/[26px] text-muted">
              Art doesn’t stop at paper. [One line about this work: what the look was for, and whether you take bookings.]
            </p>
          </div>
          <div data-stagger className="col-[5/13] grid grid-cols-[.667fr_1.5fr_.667fr] items-end gap-4 max-lg:col-span-full max-sm:grid-cols-2 max-sm:gap-2.5">
            {OFF_CANVAS.map(({ photo, shape }) => (
              <figure key={photo.alt} className={`m-0 overflow-hidden rounded-ui bg-mat ${shape}`}>
                <img src={photo.img} alt={photo.alt} loading="lazy" className="block size-full object-cover" />
              </figure>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
