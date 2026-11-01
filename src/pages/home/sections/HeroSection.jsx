import { Link } from 'react-router-dom';
import cx from '@/utils/cx';
import { CONTACT } from '@/data/site';
import { getWork } from '@/data/works';
import { Line } from '@/components/ui/Typography';
import Button from '@/components/ui/Button';
import Icon from '@/components/ui/Icon';
import { HeroDome } from '../HomeMandalas';

const PIECE_IMG =
  'block h-auto w-full rounded-ui bg-surface p-2.5 shadow-[0_2px_4px_rgba(34,33,31,.08),0_50px_80px_-36px_rgba(34,33,31,.55)] transition-transform duration-900 ease-gallery';

/* a painting floating in front of the mandala; data-float makes it bob, data-piece makes it rise in */
function Piece({ work, className, imgClassName, children, label = true }) {
  return (
    <Link
      to={`/artwork/${work.id}`}
      data-piece
      data-cursor="view"
      aria-label={label ? `View ${work.title}` : undefined}
      className={cx('group block text-inherit no-underline hover:text-inherit', className)}
    >
      <div data-float>
        <img src={work.img} alt={work.alt} className={cx(PIECE_IMG, imgClassName)} />
      </div>
      {children}
    </Link>
  );
}

export default function HeroSection() {
  const hero = getWork('radhakrishna');
  const left = getWork('peacock');
  const right = getWork('babybuddha');

  return (
    <section
      data-hero
      aria-labelledby="hero-h"
      className={cx(
        'relative isolate overflow-hidden bg-page text-primary',
        /* a soft wash keeps the copy readable over the bloom, and the bottom fades into the page */
        'before:pointer-events-none before:absolute before:inset-0 before:z-1 before:bg-[radial-gradient(ellipse_46%_60%_at_22%_56%,rgb(246_242_235/.92)_0%,rgb(246_242_235/.7)_55%,rgb(246_242_235/0)_100%)]',
        'max-lg:before:bg-[radial-gradient(ellipse_80%_40%_at_40%_26%,rgb(246_242_235/.92)_0%,rgb(246_242_235/.6)_60%,rgb(246_242_235/0)_100%)]',
        'after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:z-1 after:h-[120px] after:bg-linear-to-b after:from-page/0 after:to-page'
      )}
    >
      <div aria-hidden="true" className="pointer-events-none absolute top-0 left-1/2 z-0 aspect-square w-[clamp(940px,84vw,1220px)] -translate-1/2 opacity-90 max-lg:w-[1000px] max-sm:w-[760px]">
        <div data-mandala-scroll className="size-full">
          <div data-mandala-move className="size-full">
            <HeroDome />
          </div>
        </div>
      </div>

      <div className="wrap relative grid min-h-[clamp(660px,58vw,860px)] grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] items-center gap-12 pt-[72px] pb-[72px] max-lg:min-h-0 max-lg:grid-cols-1 max-lg:gap-6 max-lg:pt-14 max-lg:pb-16 max-sm:pt-12">
        <div className="relative z-3">
          <p data-intro className="m-0 inline-flex items-center gap-2.5 rounded-full border border-divider bg-surface/85 py-2 pr-4 pl-2.5 text-[13px]/[18px] font-semibold tracking-[.02em]">
            <i aria-hidden="true" className="mr-[30px] block size-2.5 rounded-full bg-secondary shadow-[14px_0_0_#E9A9A0,28px_0_0_#9DB8DC]" />
            Original paintings · Commissions · Wall murals
          </p>
          <h1 id="hero-h" data-intro-line aria-label="Colour, devotion and a little chaos." className="heading-hero mt-7 mb-0">
            <Line className="!pb-[.06em]" aria-hidden="true">Colour,</Line>
            <Line className="!pb-[.06em]" aria-hidden="true">devotion &amp; a</Line>
            <Line className="!pb-[.06em]" aria-hidden="true">
              little <em>chaos</em>.
            </Line>
          </h1>
          <p data-intro className="lead-lg mt-5 mb-0">
            Hand-painted canvases, mandalas and murals by {CONTACT.artist}, made to bring colour to your walls.
          </p>
          <div data-intro className="mt-9 flex flex-wrap gap-3.5">
            <Button variant="solid" to="/shop" arrow data-magnetic className="max-sm:flex-auto">
              Shop paintings
            </Button>
            <Button variant="ghost" to="/commission" data-cursor="talk" className="max-sm:flex-auto">
              Commission a piece
            </Button>
          </div>
          <div data-intro className="mt-7 flex flex-wrap gap-x-7 gap-y-2 text-sm/5">
            {[
              ['/walls', 'home', 'Paint my wall'],
              [CONTACT.instagram, 'instagram', CONTACT.instagramHandle],
            ].map(([to, icon, text]) => {
              const external = to.startsWith('http');
              const Tag = external ? 'a' : Link;
              return (
                <Tag
                  key={text}
                  {...(external ? { href: to, target: '_blank', rel: 'noopener' } : { to })}
                  className="inline-flex min-h-11 items-center gap-2 text-muted no-underline transition-colors duration-400 ease-gallery hover:text-primary"
                >
                  <Icon name={icon} size={18} strokeWidth={1.6} />
                  {text}
                </Tag>
              );
            })}
          </div>
        </div>

        <div className="relative z-2 flex min-h-[560px] items-center justify-center self-stretch max-lg:mt-2 max-lg:min-h-[520px] max-sm:mt-0 max-sm:min-h-[400px]">
          <div data-piece-move className="relative z-2 w-[clamp(240px,22vw,330px)] max-lg:w-[280px] max-sm:w-[200px]">
            <Piece
              work={left}
              className="absolute bottom-[-6%] left-[-38%] -z-1 w-[46%] -rotate-11 max-sm:left-[-44%] max-sm:w-1/2"
              imgClassName="group-hover:scale-105"
            />
            <Piece
              work={right}
              className="absolute top-[-8%] right-[-30%] -z-1 w-[40%] rotate-9 max-sm:right-[-36%] max-sm:w-[44%]"
              imgClassName="group-hover:scale-105"
            />
            <Piece work={hero} label={false} className="relative -rotate-3" imgClassName="group-hover:scale-[1.02] group-hover:rotate-2">
              <span className="absolute bottom-[-22px] left-1/2 inline-flex -translate-x-1/2 rotate-3 items-center gap-2 rounded-ui bg-surface px-4 py-[9px] text-[13px]/[18px] font-semibold whitespace-nowrap text-primary shadow-[0_14px_30px_-16px_rgba(34,33,31,.45)] max-sm:px-3.5 max-sm:py-2 max-sm:text-xs">
                <b className="font-display text-[17px] font-medium italic">{hero.title}</b> · View
              </span>
            </Piece>
          </div>
        </div>
      </div>
    </section>
  );
}
