import { Link } from 'react-router-dom';
import cx from '@/utils/cx';
import { getWork } from '@/data/works';
import { FlowerGlyph } from '@/components/mandala/Mandala';
import Icon from '@/components/ui/Icon';
import SectionHead from '@/components/sections/SectionHead';

/* the five ways in: one large dark card, four soft tinted ones */
const PATHS = [
  {
    key: 'buy', to: '/shop', cursor: 'explore', num: '01 · MOST LOVED', title: 'Buy a painting', go: 'Shop paintings', tint: 'peach',
    text: 'Original, hand-painted pieces, each one a one-off. Pick one and it’s yours.',
    look: 'col-[1/7] row-span-2 min-h-[620px] bg-primary text-on-primary hover:text-on-primary max-lg:col-span-full max-lg:row-auto max-lg:min-h-[560px] max-sm:min-h-[520px]',
  },
  {
    key: 'commission', to: '/commission', cursor: 'talk', num: '02', title: 'Commission an artwork', go: 'Start a commission', tint: 'rose',
    text: 'A painting made just for you, or your design painted on a t-shirt, jacket or shoes.',
    look: 'col-[7/10] bg-tint-rose text-primary hover:text-primary max-lg:col-auto',
  },
  {
    key: 'walls', to: '/walls', num: '03', title: 'Paint my walls', go: 'See wall art', tint: 'sage',
    text: 'Murals for homes, offices, cafés, schools and studios.',
    look: 'col-[10/13] bg-tint-sage text-primary hover:text-primary max-lg:col-auto',
  },
  {
    key: 'collab', to: '/contact', num: '04', title: 'Collaborate', go: 'Pitch an idea', tint: 'straw',
    text: 'Brands, events, workshops, shoots. Let’s make something together.',
    look: 'col-[7/10] bg-tint-straw text-primary hover:text-primary max-lg:col-auto',
  },
  {
    key: 'hello', to: '/contact', num: '05', title: 'Just say hello', go: 'Write to me', tint: 'sky',
    text: 'A thought, a question, a story. My inbox is open.',
    look: 'col-[10/13] bg-tint-sky text-primary hover:text-primary max-lg:col-auto',
  },
];

/* three paintings fanned across the top of the large card; they spread on hover */
const FAN = [
  'translate-x-[-118%] -rotate-10 scale-[.86] group-hover:translate-x-[-128%] group-hover:-rotate-14 group-hover:scale-[.88]',
  'translate-x-[18%] rotate-9 scale-[.86] group-hover:translate-x-[28%] group-hover:rotate-13 group-hover:scale-[.88]',
  'z-1 -translate-x-1/2 -rotate-2 group-hover:rotate-0 group-hover:-translate-y-2',
];

function Fan() {
  const works = ['butterfly', 'elephant', 'sunflower'].map(getWork);
  return (
    <div aria-hidden="true" className="absolute inset-x-8 top-10 -z-1 h-[58%] max-sm:inset-x-5 max-sm:top-7 max-sm:h-[52%]">
      {works.map((w, i) => (
        <img
          key={w.id}
          src={w.img}
          alt=""
          loading="lazy"
          className={cx(
            'absolute top-0 left-1/2 h-full w-auto max-w-[56%] rounded-ui bg-surface object-cover p-2 shadow-[0_30px_50px_-24px_rgba(0,0,0,.7)] transition-transform duration-1000 ease-gallery',
            FAN[i]
          )}
        />
      ))}
    </div>
  );
}

function PathCard({ path }) {
  const buy = path.key === 'buy';
  return (
    <Link
      to={path.to}
      data-cursor={path.cursor}
      className={cx(
        'group relative isolate flex min-h-[290px] flex-col justify-end overflow-hidden rounded-ui p-8 no-underline',
        'transition-[transform,box-shadow] duration-700 ease-gallery hover:-translate-y-1.5 hover:shadow-[0_34px_60px_-34px_rgba(34,33,31,.45)]',
        'max-sm:min-h-[230px] max-sm:p-[26px] max-sm:pt-[78px]',
        path.look
      )}
    >
      {buy && <Fan />}
      <FlowerGlyph
        tint={path.tint}
        className={cx(
          'absolute transition-transform duration-1400 ease-gallery group-hover:scale-108 group-hover:rotate-90',
          buy
            ? 'right-7 bottom-7 size-[84px] text-on-primary/75 max-sm:hidden'
            : 'top-6 right-6 size-[68px] max-sm:top-5 max-sm:right-5 max-sm:size-[46px]'
        )}
      />
      <span className="text-xs/4 font-bold tracking-[.14em] opacity-70">{path.num}</span>
      <h3
        className={cx(
          'mt-2.5 mb-0 font-display leading-[1.04] tracking-[-.01em]',
          buy ? 'text-[clamp(46px,4.6vw,68px)] font-light' : 'text-[clamp(32px,2.8vw,42px)] font-normal'
        )}
      >
        {path.title}
      </h3>
      <p className="mt-2.5 mb-0 max-w-[32ch] text-[15px]/[23px] opacity-85">{path.text}</p>
      <span className="mt-[22px] inline-flex items-center gap-2 text-[15px]/5 font-semibold transition-[gap] duration-500 ease-gallery group-hover:gap-3.5">
        {path.go} <Icon name="arrow" size={18} strokeWidth={1.8} />
      </span>
    </Link>
  );
}

export default function PathsSection() {
  return (
    <section id="paths" aria-labelledby="paths-h" className="pt-[clamp(88px,10vw,140px)] pb-[clamp(72px,8vw,120px)]">
      <div className="wrap">
        <SectionHead
          id="paths-h"
          eyebrow="Five ways in"
          title="What brings you *here?*"
          aside={
            <p data-cap className="lead-lg m-0 max-w-[34ch]! text-muted!">
              Take a painting home, have one made for you, or bring colour to a whole wall.
            </p>
          }
        />
        <div data-stagger className="grid grid-cols-12 gap-5 max-lg:grid-cols-2 max-sm:grid-cols-1 max-sm:gap-3.5">
          {PATHS.map((p) => (
            <PathCard key={p.key} path={p} />
          ))}
        </div>
      </div>
    </section>
  );
}
