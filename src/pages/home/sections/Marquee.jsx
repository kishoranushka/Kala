import { Fragment } from 'react';
import { MARQUEE } from '../homeContent';
import { MarqueeGlyph } from '../HomeMandalas';

/* an endless ribbon of phrases; it speeds up and leans with the scroll */
export default function Marquee() {
  const phrases = [...MARQUEE, ...MARQUEE];
  return (
    <div aria-hidden="true" className="overflow-hidden border-y border-divider bg-page py-[22px]">
      <div data-marquee className="flex w-max will-change-transform">
        {[0, 1].map((set) => (
          <div key={set} className="flex items-center gap-10 pr-10 font-display text-[clamp(26px,3vw,44px)]/[1.1] font-light whitespace-nowrap text-primary">
            {phrases.map((p, i) => (
              <Fragment key={i}>
                <span className={p.italic ? 'italic' : undefined}>{p.text}</span>
                <MarqueeGlyph />
              </Fragment>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
