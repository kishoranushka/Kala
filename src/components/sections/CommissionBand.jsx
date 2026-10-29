import { RingMandala } from '@/components/mandala/Mandala';
import Button from '@/components/ui/Button';
import { SplitWords } from '@/components/ui/Typography';
import InverseSection from './InverseSection';

/* the dark "not quite it?" call to commission that closes the shop */
export default function CommissionBand({ id, eyebrow, title, lead }) {
  return (
    <InverseSection aria-labelledby={id} className="py-[clamp(80px,9vw,128px)]">
      <RingMandala spin={160} className="absolute -top-[120px] -right-[200px] w-[640px] opacity-10" />
      <div className="wrap relative">
        <div className="grid-12">
          <div className="col-[1/8] max-lg:col-span-full">
            <p data-eyebrow className="eyebrow">
              {eyebrow}
            </p>
            <SplitWords id={id} text={title} className="heading-2 mt-5 font-light" />
          </div>
          <div data-cap className="col-[9/13] self-end max-lg:col-span-full max-lg:mt-8">
            <p className="lead mb-7">{lead}</p>
            <Button variant="light" to="/commission" arrow data-magnetic data-cursor="talk">
              Start a Commission
            </Button>
          </div>
        </div>
      </div>
    </InverseSection>
  );
}
