import { Petals, useSvgId } from '@/components/mandala/Mandala';

/* the large line mandala unfolding behind the hero */
export function HeroMandala({ className }) {
  const id = useSvgId();
  return (
    <svg data-h-mandala viewBox="-500 -500 1000 1000" aria-hidden="true" fill="none" stroke="#C9B79C" strokeWidth="1" className={className}>
      <defs>
        <path id={`${id}a`} d="M0,-440 C40,-404 46,-364 0,-332 C-46,-364 -40,-404 0,-440Z" />
        <path id={`${id}b`} d="M0,-262 C30,-238 30,-212 0,-192 C-30,-212 -30,-238 0,-262Z" />
        <path id={`${id}c`} d="M0,-120 C40,-92 32,-70 0,-60 C-32,-70 -40,-92 0,-120Z" />
      </defs>
      <g data-spin="180">
        <circle r="486" />
        <circle r="470" strokeDasharray="1 9" />
        <circle r="446" />
        <Petals href={`#${id}a`} count={16} />
        <circle r="330" />
      </g>
      <g data-spin="-120">
        <circle r="300" strokeWidth="3" strokeLinecap="round" strokeDasharray="0 15.7" className="stroke-secondary" opacity=".55" />
        <circle r="268" />
        <Petals href={`#${id}b`} count={12} />
        <circle r="190" />
      </g>
      <g data-spin="80">
        <circle r="150" strokeDasharray="2 6" />
        <circle r="124" />
        <Petals href={`#${id}c`} count={8} />
        <circle r="58" />
        <circle r="20" />
      </g>
    </svg>
  );
}

/* the painted mandala of "Inside the pattern": petals unfold one by one as it scrolls into place */
export function PatternMandala() {
  const id = useSvgId();
  const outer = `#${id}s`;
  const inner = `#${id}r`;
  return (
    <svg data-pat-mandala viewBox="-360 -360 720 720" aria-hidden="true" className="block w-full max-w-[860px] max-lg:mx-auto">
      <defs>
        <path id={`${id}s`} d="M0,-322 C60,-272 64,-212 0,-172 C-64,-212 -60,-272 0,-322Z" />
        <g id={`${id}p`}>
          <path d="M0,-322 C60,-272 64,-212 0,-172 C-64,-212 -60,-272 0,-322Z" className="fill-primary" stroke="#C9B79C" strokeWidth="1.2" />
          <path d="M0,-300 C34,-268 36,-226 0,-196 C-36,-226 -34,-268 0,-300Z" fill="none" stroke="#C9B79C" strokeWidth=".6" opacity=".6" />
          <circle cy="-290" r="5" className="fill-secondary" />
        </g>
        <path id={`${id}r`} d="M0,-160 C34,-132 34,-102 0,-82 C-34,-102 -34,-132 0,-160Z" />
      </defs>
      <g data-spin="240">
        <circle r="352" fill="rgba(255,255,255,0.025)" stroke="#C9B79C" strokeWidth=".6" opacity=".7" />
        <circle r="338" fill="none" stroke="#C9B79C" strokeWidth="3" strokeDasharray="0 10.6" strokeLinecap="round" opacity=".8" />
        <g fill="#000000" opacity=".38" transform="translate(4 6)">
          <Petals href={outer} count={12} data-petal />
        </g>
        <Petals href={`#${id}p`} count={12} data-petal />
      </g>
      <g data-spin="-160">
        <circle r="172" className="fill-primary" stroke="#C9B79C" strokeWidth="1.2" />
        <circle r="164" fill="none" stroke="#C9B79C" strokeWidth="1" strokeDasharray="1 6" />
        <g fill="#000000" opacity=".38" transform="translate(3 4)">
          <Petals href={inner} count={16} data-petal2 />
        </g>
        <g className="fill-primary" stroke="#C9B79C" strokeWidth="1">
          <Petals href={inner} count={16} data-petal2 />
        </g>
      </g>
      <g data-spin="60">
        <circle r="80" className="fill-secondary" />
        <circle r="64" fill="none" stroke="#F1E6CF" strokeWidth="3" strokeDasharray="0 8.4" strokeLinecap="round" />
        <circle r="32" fill="#C9B79C" />
        <circle r="11" className="fill-primary" />
      </g>
    </svg>
  );
}

/* a single paper mandala that turns with the reader */
export function QuietMandala() {
  const id = useSvgId();
  return (
    <svg
      data-quiet-mandala
      viewBox="-100 -100 200 200"
      aria-hidden="true"
      className="block w-full max-w-[260px] drop-shadow-[0_18px_22px_rgba(34,33,31,.16)]"
    >
      <defs>
        <path id={`${id}a`} d="M0,-92 C22,-72 24,-50 0,-36 C-24,-50 -22,-72 0,-92Z" />
        <path id={`${id}b`} d="M0,-58 C14,-46 14,-34 0,-24 C-14,-34 -14,-46 0,-58Z" />
      </defs>
      <circle r="96" fill="#FFFEFA" />
      <circle r="90" fill="none" stroke="#C9B79C" strokeWidth=".8" />
      <g fill="#EAE4DA" stroke="#C9B79C" strokeWidth=".8">
        <Petals href={`#${id}a`} count={8} />
      </g>
      <circle r="38" fill="#FFFEFA" stroke="#C9B79C" strokeWidth=".8" />
      <g data-spin="-70" fill="#F6F2EB" stroke="#C9B79C" strokeWidth=".8">
        <Petals href={`#${id}b`} count={8} start={22.5} />
      </g>
      <circle r="10" className="fill-secondary" />
    </svg>
  );
}

/* the small six-spoked flower between marquee phrases */
export function MarqueeGlyph() {
  return (
    <svg width="22" height="22" viewBox="-12 -12 24 24" fill="none" strokeWidth="1.2" className="shrink-0 stroke-secondary">
      <circle r="10" />
      <circle r="3" />
      <path d="M0,-10 L0,10 M-8.7,-5 L8.7,5 M-8.7,5 L8.7,-5" />
    </svg>
  );
}
