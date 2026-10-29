import cx from '@/utils/cx';
import { getWork } from '@/data/works';
import InverseSection from '@/components/sections/InverseSection';
import { SplitWords } from '@/components/ui/Typography';
import { HOME_H2, PATTERN_LABELS, PATTERN_STEPS } from '../homeContent';
import { PatternMandala } from '../HomeMandalas';

/* 02 · Inside the pattern (dark chapter) */
export default function PatternSection() {
  const om = getWork('om');

  return (
    <InverseSection id="pattern" data-chapter="02 · Inside the pattern" aria-labelledby="pattern-h" className="py-[clamp(88px,10vw,144px)]">
      <div className="wrap">
        <div className="grid-12">
          <div className="relative col-[1/8] -ml-[200px] max-xl:-ml-[140px] max-lg:col-span-full max-lg:-mx-40 max-lg:mb-12 max-sm:-mx-[220px] max-sm:mb-8">
            <PatternMandala />
            {PATTERN_LABELS.map((label) => (
              <div
                key={label.text}
                data-pat-label
                aria-hidden="true"
                className="absolute flex items-center gap-2.5 text-[11px]/4 font-semibold tracking-[.14em] text-paper uppercase max-sm:hidden"
                style={{ left: label.left, top: label.top }}
              >
                <span data-pat-rule className="h-px bg-paper" style={{ width: label.rule }} />
                {label.text}
              </div>
            ))}
          </div>

          <div className="col-[8/13] self-center max-lg:col-span-full">
            <p data-eyebrow className="eyebrow">
              02 · Inside the pattern
            </p>
            <SplitWords id="pattern-h" text="A circle, drawn *slowly,* until it holds a world." className={cx(HOME_H2, 'font-light')} />
            <p data-cap className="mt-7 max-w-[44ch] text-lg/[30px] text-on-inverse-muted">
              [In your own words: why you return to the mandala — the repetition, the patience, the way a piece builds outward. Two or three true sentences.]
            </p>

            <ol data-stagger className="mt-12 list-none border-t border-hairline p-0">
              {PATTERN_STEPS.map((step) => (
                <li key={step.num} className="grid grid-cols-[48px_1fr] border-b border-hairline py-5">
                  <span className="font-display text-2xl/[30px] text-on-inverse-muted italic">{step.num}</span>
                  <span>
                    <span className="block font-display text-2xl/[30px] font-medium">{step.title}</span>
                    <span className="mt-1 block text-sm/[22px] text-on-inverse-muted">{step.note}</span>
                  </span>
                </li>
              ))}
            </ol>

            <div data-cap className="mt-12 flex items-end gap-6">
              <div data-reveal data-noinner data-cursor="view" className="relative aspect-square w-[168px] shrink-0 overflow-hidden shadow-[0_0_0_1px_rgba(255,254,250,.18)]">
                <img
                  src={om.img}
                  alt="Close-up of the saffron Om at the centre of the Om Mandala, ringed with yellow and red dots"
                  loading="lazy"
                  className="absolute -top-[70%] -left-[70%] size-[240%] object-cover"
                />
              </div>
              <p className="max-w-[26ch] text-[13px]/5 font-medium text-on-inverse-muted">Detail · Om Mandala. The same geometry, painted by hand, one dot at a time.</p>
            </div>
          </div>
        </div>
      </div>
    </InverseSection>
  );
}
