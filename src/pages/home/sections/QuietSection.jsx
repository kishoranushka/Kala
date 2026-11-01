import { SplitWords } from '@/components/ui/Typography';
import { QuietMandala } from '../HomeMandalas';

/* The quiet between paintings */
export default function QuietSection() {
  return (
    <section data-quiet aria-label="A pause" className="border-t border-divider pt-[clamp(72px,8vw,120px)] pb-[clamp(88px,11vw,160px)]">
      <div className="wrap">
        <div className="grid-12">
          <div className="col-[2/5] max-lg:col-span-full max-lg:max-w-[200px] max-sm:max-w-[150px]">
            <QuietMandala />
          </div>
          <div className="col-[6/12] self-center max-lg:col-span-full max-lg:mt-10">
            <SplitWords
              as="p"
              text="Art is something to *experience*, collect and live with."
              className="font-display text-[clamp(32px,3.6vw,52px)] leading-[1.15] font-light"
            />
            <div data-line className="mt-8 h-px w-16 bg-secondary" />
          </div>
        </div>
      </div>
    </section>
  );
}
