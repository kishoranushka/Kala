import { getWork } from '@/data/works';
import { CONTACT } from '@/data/site';
import ArtLink from '@/components/art/ArtLink';
import Button from '@/components/ui/Button';
import StatusBadge from '@/components/ui/StatusBadge';
import { Accent, Line } from '@/components/ui/Typography';
import { HeroMandala } from '../HomeMandalas';

/* 00 · The unfolding canvas */
export default function HeroSection() {
  const work = getWork('krishna');

  return (
    <section data-hero aria-labelledby="hero-h" className="relative overflow-hidden pt-10 pb-[72px] max-lg:pt-6 max-lg:pb-14 max-sm:pt-2 max-sm:pb-10">
      <HeroMandala className="pointer-events-none absolute -top-[300px] -right-[360px] w-[1180px] opacity-60 max-xl:-top-[220px] max-xl:w-[900px] max-sm:-top-[140px] max-sm:-right-[320px] max-sm:w-[620px] max-sm:opacity-45" />

      <div className="wrap">
        <div className="grid-12 items-start">
          <div data-h-copy className="relative z-[2] col-[1/7] pt-24 max-lg:col-span-full max-lg:pt-12 max-sm:pt-8">
            <p data-h-eyebrow className="eyebrow">
              Original paintings · Mandalas · Commissions
            </p>
            <h1
              id="hero-h"
              className="mt-8 font-display text-[clamp(54px,7vw,104px)] leading-[.95] font-light tracking-[-.015em] max-lg:text-[clamp(50px,10.5vw,100px)] max-sm:mt-6 max-sm:text-[clamp(44px,13.4vw,64px)]"
            >
              <Line>Art that lives</Line>
              <Line className="pl-[16%] max-sm:pl-[12%]">
                <Accent>beyond</Accent>
              </Line>
              <Line>the canvas.</Line>
            </h1>

            <div className="mt-12 max-w-[560px] pl-[16%] max-lg:max-w-[620px] max-sm:mt-7 max-sm:pl-0">
              <p data-h-fade className="max-w-[42ch] text-lg/[30px] text-soft">
                {CONTACT.artist} paints original canvases and mandalas, and makes personal pieces for the walls people live with every day.
              </p>
              <div data-h-fade className="mt-9 flex flex-wrap gap-x-4 gap-y-3">
                <Button to="/shop" arrow data-magnetic data-cursor="explore" className="max-xs:flex-[1_1_100%]">
                  Explore the Art
                </Button>
                <Button to="/commission" variant="secondary" data-magnetic data-cursor="talk" className="max-xs:flex-[1_1_100%]">
                  Commission a Piece
                </Button>
              </div>
            </div>

            <div data-h-fade className="mt-24 flex items-center gap-3.5 max-lg:mt-14 max-sm:mt-10">
              <span data-cue className="h-12 w-px bg-secondary" />
              <span className="eyebrow">Scroll into the atlas</span>
            </div>
          </div>

          <div data-h-art className="relative col-[7/13] pt-14 max-lg:col-span-full max-lg:mt-12 max-sm:mt-10 max-sm:pt-8">
            <div data-h-panel aria-hidden="true" className="absolute top-0 -right-[240px] -bottom-6 left-[10%] bg-wall max-lg:-right-10 max-lg:-left-10 max-sm:-right-5 max-sm:bottom-0 max-sm:-left-5" />
            <span
              data-h-vert
              aria-hidden="true"
              className="absolute top-[120px] -right-7 text-[11px] font-semibold tracking-[.24em] text-muted uppercase [writing-mode:vertical-rl] max-lg:hidden"
            >
              Plate I · The unfolding canvas
            </span>
            <ArtLink
              work={work}
              reveal={false}
              priority
              data-h-canvas
              shadow="shadow-float"
              className="mx-auto w-[74%] -rotate-[1.2deg] max-lg:w-[70%] max-lg:max-w-[540px] max-sm:w-[86%] motion-reduce:rotate-0"
            />
            <div
              data-h-under
              className="relative mx-auto mt-10 flex w-[74%] items-end justify-between gap-4 pb-10 max-lg:w-[70%] max-lg:max-w-[540px] max-sm:mt-7 max-sm:w-[86%] max-sm:pb-8 max-xs:flex-col max-xs:items-start"
            >
              <div className="flex flex-col gap-1">
                <span className="eyebrow">Plate I · Devotional</span>
                <span className="font-display text-2xl/[30px] font-medium italic">{work.title}</span>
                <span className="meta">[Medium] · [Size] · [Year]</span>
              </div>
              <div className="flex flex-col items-end gap-1 text-right max-xs:items-start max-xs:text-left">
                <StatusBadge status={work.status} leading="leading-[inherit]" />
                <span className="price">{work.price}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
