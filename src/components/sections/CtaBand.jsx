import { PageMandala } from '@/components/mandala/Mandala';
import Button from '@/components/ui/Button';
import { SplitWords } from '@/components/ui/Typography';

/* the dark closing band of an inner page: a title on the left, a line and one action on the right.
   Title markup: *word* sets a word in italics. */
export default function CtaBand({ id, eyebrow, title, lead, to = '/commission', label = 'Start a Commission' }) {
  return (
    <section aria-labelledby={id} className="inverse relative overflow-hidden bg-primary py-[clamp(88px,10vw,140px)] text-on-primary">
      <PageMandala
        stroke="rgb(255 254 250 / .3)"
        accentClass="stroke-secondary-on-dark"
        outerSpin={90}
        innerSpin={-70}
        className="top-1/2 -right-[180px] -mt-[360px] w-[720px] max-sm:-right-[260px] max-sm:-mt-[260px] max-sm:w-[520px]"
      />
      <div className="wrap relative z-1 grid-12 items-end">
        <div className="col-[1/8] max-lg:col-span-full">
          <p data-eyebrow className="eyebrow m-0">
            {eyebrow}
          </p>
          <SplitWords id={id} text={title} className="heading-2 mt-5 mb-0 font-light" />
        </div>
        <div data-cap className="col-[9/13] max-lg:col-span-full max-lg:mt-7">
          <p className="lead mt-0 mb-7 text-on-primary-soft!">{lead}</p>
          <Button variant="light" to={to} arrow data-magnetic data-cursor="talk">
            {label}
          </Button>
        </div>
      </div>
    </section>
  );
}
