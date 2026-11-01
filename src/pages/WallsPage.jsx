import { Link } from 'react-router-dom';
import cx from '@/utils/cx';
import { PHOTOS, getWork } from '@/data/works';
import { PageMandala } from '@/components/mandala/Mandala';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import Button from '@/components/ui/Button';
import { Line, SplitWords } from '@/components/ui/Typography';
import CtaBand from '@/components/sections/CtaBand';

const SPACES = ['Homes', 'Offices', 'Cafés', 'Schools', 'Studios'];

const PAINTED = [
  { id: 'mural', alt: 'The mandala wall mural, close up', slot: 'col-[1/8]', ratio: 'aspect-[1166/656]' },
  { id: 'chalk', alt: 'A chalkboard-black mural reading Think Out of the Box with a lightbulb full of gears; Anushka stands beside it', slot: 'col-[8/13]', ratio: 'aspect-[1159/960]' },
];

const STEPS = [
  { title: 'Share', text: 'Send photos of the wall, its size, and the feeling you want in the room.' },
  { title: 'Talk', text: 'We settle the idea, colours and timing together.' },
  { title: 'Sketch & quote', text: 'I draw the design and share a quote before anything is painted.' },
  { title: 'Paint on site', text: 'I come and paint the wall by hand. [How long a typical wall takes.]' },
];

export default function WallsPage() {
  const mural = getWork('mural');
  return (
    <>
      <section aria-labelledby="wl-h" className="relative overflow-hidden pt-[clamp(40px,6vw,88px)] pb-[clamp(56px,7vw,104px)]">
        <PageMandala className="-top-[260px] -right-[240px] w-[760px] opacity-85 max-sm:-top-[240px] max-sm:-right-[260px] max-sm:w-[520px]" />
        <div className="wrap relative z-1">
          <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Wall murals' }]} />
          <div className="mt-7 grid-12 items-center">
            <div className="col-[1/7] max-lg:col-span-full">
              <p data-intro className="eyebrow m-0">
                Wall murals
              </p>
              <h1 id="wl-h" data-intro-line className="heading-1 mt-5 mb-0">
                <Line>Your walls,</Line>{' '}
                <Line>
                  painted by <span className="text-secondary italic">hand.</span>
                </Line>
              </h1>
              <p data-intro className="lead mt-6 mb-0">
                Hire me to paint a mural for your home, office, café, school or studio. [Add the cities you can travel to, and roughly how big a wall you take on.]
              </p>
              <ul data-intro aria-label="Spaces I paint" className="m-0 mt-7 flex list-none flex-wrap gap-2 p-0">
                {SPACES.map((s) => (
                  <li key={s} className="rounded-full border border-chip bg-surface/60 px-3.5 py-1.5 text-[13px]/5 font-medium text-soft">
                    {s}
                  </li>
                ))}
              </ul>
              <div data-intro className="mt-8 flex flex-wrap gap-4">
                <Button to="/commission" arrow data-magnetic data-cursor="talk">
                  Plan a Wall With Me
                </Button>
                <Button variant="secondary" to="#painted">
                  See the walls
                </Button>
              </div>
            </div>
            <div className="relative col-[7/13] pb-[60px] max-lg:col-span-full max-lg:mt-10">
              <figure data-intro className="m-0 aspect-[1166/656] w-[92%] overflow-hidden rounded-ui shadow-float">
                <img src={mural.img} alt="A half-mandala painted on a pale wall in crimson, saffron, yellow, lilac and turquoise, with large teal leaves" fetchpriority="high" className="block size-full object-cover" />
              </figure>
              <figure data-intro className="absolute right-0 bottom-0 m-0 aspect-[720/1280] w-[30%] rotate-3 overflow-hidden rounded-ui border-6 border-surface shadow-float max-sm:w-[34%]">
                <img src={PHOTOS.paintingMural.img} alt={PHOTOS.paintingMural.alt} className="block size-full object-cover" />
              </figure>
            </div>
          </div>
        </div>
      </section>

      <section id="painted" aria-labelledby="painted-h" className="py-[clamp(48px,6vw,88px)]">
        <div className="wrap">
          <p data-eyebrow className="eyebrow m-0">
            Painted so far
          </p>
          <SplitWords id="painted-h" text="Walls that tell a *story.*" className="heading-2 mt-5 mb-0 font-light" />
          <div data-stagger className="mt-[clamp(40px,5vw,64px)] grid grid-cols-12 gap-7 max-lg:grid-cols-1">
            {PAINTED.map(({ id, alt, slot, ratio }) => {
              const w = getWork(id);
              return (
                <figure key={id} className={cx('m-0 flex flex-col max-lg:col-span-full', slot)}>
                  <Link to={`/artwork/${id}`} data-cursor="view" className={cx('block overflow-hidden rounded-ui bg-wall shadow-hang', ratio)}>
                    <img src={w.img} alt={alt} loading="lazy" className="block size-full object-cover" />
                  </Link>
                  <figcaption className="mt-4">
                    <b className="block font-display text-[28px]/8 font-medium">{w.title}</b>
                    <span className="mt-1 block text-[13px] text-muted">[Location · Year · Wall size]</span>
                  </figcaption>
                </figure>
              );
            })}
          </div>
        </div>
      </section>

      <section aria-labelledby="how-h" className="pt-[clamp(48px,6vw,88px)] pb-[clamp(96px,11vw,150px)]">
        <div className="wrap">
          <p data-eyebrow className="eyebrow m-0">
            How a wall comes together
          </p>
          <SplitWords id="how-h" text="Four steps, one *wall.*" className="heading-2 mt-5 mb-0 font-light" />
          <ol data-stagger className="m-0 mt-[clamp(40px,5vw,64px)] grid list-none grid-cols-4 gap-8 p-0 max-lg:grid-cols-2 max-sm:grid-cols-1">
            {STEPS.map((s, i) => (
              <li key={s.title} className="relative pt-7 before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-line">
                <span className="font-display text-[44px] leading-none text-secondary italic">{String(i + 1).padStart(2, '0')}</span>
                <b className="mt-3.5 block font-display text-[26px]/[30px] font-medium">{s.title}</b>
                <p className="mt-2 mb-0 text-[15px]/6 text-soft">{s.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <CtaBand
        id="wb-h"
        eyebrow="Have a wall in mind?"
        title="Let’s give it a *story.*"
        lead="Tell me about the space, and send a photo if you can."
        label="Start a Wall Enquiry"
      />
    </>
  );
}
