import { CONTACT } from '@/data/site';
import { getWork, pad2 } from '@/data/works';
import { RingMandala } from '@/components/mandala/Mandala';
import InverseSection from '@/components/sections/InverseSection';
import Button from '@/components/ui/Button';
import { SplitWords } from '@/components/ui/Typography';
import { COMMISSION_WAYS } from '../homeContent';

/* 05 · Commissions (final dark chapter) */
export default function CommissionInviteSection() {
  const child = getWork('child');

  return (
    <InverseSection id="commission" data-chapter="05 · Commissions" aria-labelledby="com-h" className="pt-[clamp(96px,11vw,160px)] pb-[clamp(72px,8vw,120px)]">
      <RingMandala data-com-mandala className="absolute top-10 -left-[240px] w-[900px] opacity-10" />
      <div className="wrap relative">
        <div className="grid-12 items-center">
          <div className="relative col-[1/6] max-lg:col-span-full max-lg:mb-14 max-lg:max-w-[440px] max-sm:mr-[12%] max-sm:max-w-none">
            <div data-com-art data-cursor="talk" className="relative overflow-hidden shadow-[0_40px_80px_-40px_rgba(0,0,0,.6)]" style={{ aspectRatio: `${child.w} / ${child.h}` }}>
              <img
                src={child.img}
                alt="A sleeping child resting their chin in both hands, painted in rose, vermilion and magenta over a violet ground"
                loading="lazy"
                className="block size-full object-cover"
              />
            </div>
            <p data-cap className="mt-4 text-[13px]/5 font-medium text-on-inverse-muted">
              Child Portrait · personal pieces start with a conversation
            </p>
          </div>

          <div className="col-[7/13] max-lg:col-span-full">
            <p data-eyebrow className="eyebrow">
              05 · Commissions
            </p>
            <SplitWords
              id="com-h"
              text="A painting begins with a *conversation*."
              className="mt-5 max-w-[12ch] font-display text-[clamp(42px,5.2vw,76px)] leading-[1.02] font-light tracking-[-.015em]"
            />
            <p data-cap className="mt-7 max-w-[46ch] text-lg/[30px] text-on-inverse-muted">
              A custom piece can start with almost anything. Share what you have and we’ll shape it together. I read every message personally.
            </p>
            <ol data-stagger className="mt-12 grid list-none grid-cols-2 gap-x-8 border-t border-hairline p-0 max-sm:grid-cols-1">
              {COMMISSION_WAYS.map((way, i) => (
                <li key={way.title} className="border-b border-hairline py-[22px]">
                  <span className="block text-xs font-semibold tracking-[.06em] text-on-inverse-muted tabular-nums">{pad2(i + 1)}</span>
                  <span className="mt-1.5 block font-display text-[26px]/8 font-medium">{way.title}</span>
                  <span className="mt-1 block text-sm/[22px] text-on-inverse-muted">{way.note}</span>
                </li>
              ))}
            </ol>
            <div data-cap className="mt-12 flex flex-wrap items-center gap-6">
              <Button variant="light" to="/commission" arrow data-magnetic data-cursor="talk">
                Start a Commission
              </Button>
              <span className="text-sm/[22px] text-on-inverse-muted">
                or write to{' '}
                <a href="#commission" data-cursor="talk" className="font-semibold underline">
                  {CONTACT.email}
                </a>
              </span>
            </div>
            <p data-cap className="mt-6 max-w-[52ch] text-xs/[18px] text-on-inverse-muted">
              Every commission is shaped in conversation. Pricing and timelines are agreed per project, and sending an idea doesn’t commit either of us.
            </p>
          </div>
        </div>
      </div>
    </InverseSection>
  );
}
