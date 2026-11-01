import { getWork } from '@/data/works';
import { PageMandala } from '@/components/mandala/Mandala';
import { SplitWords } from '@/components/ui/Typography';
import Button from '@/components/ui/Button';
import { Chips } from '@/components/sections/SectionHead';

export default function WallsSection() {
  const mural = getWork('mural');
  const chalk = getWork('chalk');
  return (
    <section id="walls" aria-labelledby="walls-h" className="relative overflow-hidden bg-surface-alt py-[clamp(96px,11vw,150px)] text-primary">
      <PageMandala
        stroke="var(--color-sand)"
        className="-top-[380px] -right-[340px] w-[860px] opacity-95 max-sm:-top-[260px] max-sm:-right-[280px] max-sm:w-[560px]"
      />
      <div className="wrap grid grid-cols-12 items-center gap-8 max-lg:grid-cols-1">
        <div className="relative col-[1/8] pb-[12%] max-lg:col-span-full">
          <div data-reveal className="aspect-[1166/656] overflow-hidden rounded-ui shadow-wall">
            <img src={mural.img} alt={mural.alt} loading="lazy" className="block size-full object-cover" />
          </div>
          <div
            data-speed="0.6"
            className="absolute right-[-4%] bottom-0 aspect-[1159/960] w-[42%] rotate-4 overflow-hidden rounded-ui border-8 border-surface shadow-[0_30px_50px_-26px_rgba(20,22,63,.7)] max-sm:w-[48%] max-sm:border-6"
          >
            <img src={chalk.img} alt={chalk.alt} loading="lazy" className="block size-full object-cover" />
          </div>
        </div>
        <div className="col-[9/13] max-lg:col-span-full max-lg:mt-6">
          <p data-eyebrow className="eyebrow-lg m-0">
            Wall murals
          </p>
          <SplitWords id="walls-h" text="Your walls, painted by *hand.*" className="heading-section mt-3.5 mb-0" />
          <p data-cap className="lead-lg mt-5 mb-0">
            Hire me to paint a mural for your home, office, café, school or studio, [Add the cities you can travel to, and roughly how big a wall you take on.]
          </p>
          <Chips label="Spaces I paint" items={['Homes', 'Offices', 'Cafés', 'Schools', 'Studios']} />
          <div data-cap className="mt-8 flex flex-wrap gap-3.5">
            <Button variant="solid" to="/walls" arrow data-cursor="talk">
              Plan a wall with me
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
