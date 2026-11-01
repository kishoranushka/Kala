import { PageMandala } from '@/components/mandala/Mandala';
import { SplitWords } from '@/components/ui/Typography';
import Button from '@/components/ui/Button';

/* the closing invitation on a dark band */
export default function BandSection() {
  return (
    <section aria-labelledby="band-h" className="inverse relative overflow-hidden bg-primary py-[clamp(96px,11vw,150px)] text-on-primary">
      <PageMandala
        stroke="rgb(255 254 250 / .32)"
        accentClass="stroke-secondary-on-dark"
        outerSpin={160}
        innerSpin={-120}
        className="top-1/2 -right-[260px] size-[820px] -translate-y-1/2 max-sm:size-[520px]"
      />
      <div className="wrap">
        <div className="relative z-1 max-w-[820px]">
          <p data-eyebrow className="eyebrow-lg m-0">
            Commissions · Walls · Wearables · Collaborations
          </p>
          <SplitWords id="band-h" text="Got a wall, an idea, or just a *thought?*" className="heading-section mt-3.5 mb-0 text-[clamp(44px,6vw,92px)]!" />
          <p data-cap className="lead-lg mt-5 mb-0">
            Tell me about it and I’ll get back to you.
          </p>
          <div data-cap className="mt-9 flex flex-wrap gap-3.5">
            <Button variant="paper" to="/commission" arrow data-cursor="talk" className="max-sm:flex-auto">
              Commission a piece
            </Button>
            <Button variant="ghost" to="/contact" className="max-sm:flex-auto">
              Say hello
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
