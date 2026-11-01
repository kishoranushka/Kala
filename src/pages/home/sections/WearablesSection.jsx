import cx from '@/utils/cx';
import { PHOTOS } from '@/data/works';
import { PageMandala } from '@/components/mandala/Mandala';
import { SplitWords } from '@/components/ui/Typography';
import Button from '@/components/ui/Button';
import { Chips } from '@/components/sections/SectionHead';

const LOOKS = [PHOTOS.jacketBack, PHOTOS.jacketWorn, PHOTOS.jacketBench];

export default function WearablesSection() {
  return (
    <section id="wearables" data-chapter="Wearables" aria-labelledby="wear-h" className="relative overflow-hidden bg-page py-[clamp(96px,11vw,150px)]">
      <PageMandala className="-bottom-[360px] -left-[300px] w-[760px] opacity-70" />
      <div className="wrap grid grid-cols-12 items-center gap-8 max-lg:grid-cols-1">
        <div className="relative z-1 col-[1/6] max-lg:col-span-full">
          <p data-eyebrow className="eyebrow-lg m-0">
            Custom painted wearables
          </p>
          <SplitWords id="wear-h" text="Wear the *art.*" className="heading-section mt-3.5 mb-0" />
          <p data-cap className="lead-lg mt-5 mb-0">
            Your own design, hand-painted on a t-shirt, a jacket, a pair of shoes, or anything else you’d like to wear. Tell me the piece and the idea, and I’ll paint
            it for you. [Add turnaround time and a starting price.]
          </p>
          <Chips label="Things I paint on" items={['T-shirts', 'Jackets', 'Shoes', '& more']} />
          <div data-cap className="mt-8 flex flex-wrap gap-3.5">
            <Button variant="solid" to="/commission" arrow data-cursor="talk">
              Order a custom piece
            </Button>
          </div>
        </div>
        <div data-stagger className="col-[7/13] grid grid-cols-3 items-start gap-4 max-lg:col-span-full max-lg:mt-6 max-sm:gap-2.5">
          {LOOKS.map((p, i) => (
            <figure key={p.alt} className={cx('m-0 aspect-[3/4] overflow-hidden rounded-ui bg-mat', i === 1 && 'mt-14 max-sm:mt-7')}>
              <img src={p.img} alt={p.alt} loading="lazy" className="block size-full object-cover" />
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
