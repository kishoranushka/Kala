import { useId } from 'react';
import cx from '@/utils/cx';

/* Hand-drawn style mandalas built from rotated petal paths. Groups marked data-spin turn forever. */

export const PETAL_LARGE = 'M0,-280 C30,-250 34,-214 0,-190 C-34,-214 -30,-250 0,-280Z';
export const PETAL_SMALL = 'M0,-150 C22,-128 22,-106 0,-92 C-22,-106 -22,-128 0,-150Z';

/* a unique, selector-safe id for <defs> */
export function useSvgId() {
  return useId().replace(/:/g, '');
}

/* `count` copies of a <defs> shape, evenly rotated around the centre */
export function Petals({ href, count, start = 0, ...props }) {
  const step = 360 / count;
  return Array.from({ length: count }, (_, i) => {
    const angle = start + step * i;
    return <use key={i} href={href} transform={angle ? `rotate(${angle})` : undefined} {...props} />;
  });
}

/* the line mandala used across the site: twelve outer petals, eight inner, an accent dot ring.
   `stroke` takes any CSS colour (theme variables included); the dot ring uses `accentClass`. */
export function PageMandala({
  className,
  style,
  stroke = 'var(--color-oak)',
  outerSpin = 200,
  innerSpin = -130,
  accentRing = true,
  accentClass = 'stroke-secondary',
  absolute = true,
}) {
  const id = useSvgId();
  return (
    <svg
      viewBox="-300 -300 600 600"
      aria-hidden="true"
      focusable="false"
      fill="none"
      strokeWidth="1"
      className={cx('pointer-events-none block overflow-visible', absolute && 'absolute', className)}
      style={{ stroke, ...style }}
    >
      <defs>
        <path id={`${id}a`} d={PETAL_LARGE} />
        <path id={`${id}b`} d={PETAL_SMALL} />
      </defs>
      <g data-spin={outerSpin}>
        <circle r="292" />
        <circle r="270" strokeDasharray="1 8" />
        <Petals href={`#${id}a`} count={12} />
        <circle r="186" />
      </g>
      <g data-spin={innerSpin}>
        {accentRing && <circle r="160" strokeWidth="3" strokeLinecap="round" strokeDasharray="0 12.6" className={accentClass} opacity=".5" />}
        <Petals href={`#${id}b`} count={8} />
        <circle r="80" />
        <circle r="30" />
      </g>
    </svg>
  );
}

/* the small eight-petal flower on cards and beside photos. It turns slowly (CSS) and
   colours its outline with currentColor; the three fills are pastel paint. */
const GLYPH_PETAL = 'M0,-14 C14,-22.4 8.7,-37.4 0,-44 C-8.7,-37.4 -14,-22.4 0,-14Z';
export const GLYPH_TINTS = {
  peach: ['#F6D5B4', '#F2C6BF', '#FFFEFA'],
  rose: ['#F2C6BF', '#F6D5B4', '#FFFEFA'],
  sage: ['#CCDFC5', '#F3E4AC', '#ECB8BC'],
  straw: ['#F3E4AC', '#F6D5B4', '#ECB8BC'],
  sky: ['#C9DAEF', '#DCCFEB', '#F3E4AC'],
};
export function FlowerGlyph({ tint = 'peach', className }) {
  const [petal, heart, dot] = GLYPH_TINTS[tint];
  return (
    <svg viewBox="-50 -50 100 100" aria-hidden="true" focusable="false" className={cx('text-glyph', className)}>
      <g className="glyph-spin">
        {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
          <path key={a} d={GLYPH_PETAL} transform={`rotate(${a})`} fill={petal} stroke="currentColor" strokeWidth="2.5" />
        ))}
        <circle r="15" fill={heart} stroke="currentColor" strokeWidth="2.5" />
        <circle r="5" fill={dot} />
      </g>
    </svg>
  );
}

/* a single turning ring of twelve petals — the watermark on dark chapters, menus and the viewing room */
export function RingMandala({ className, stroke = 'var(--color-on-primary)', spin = 200, rings = [186, 120, 60], style, ...props }) {
  const id = useSvgId();
  return (
    <svg viewBox="-300 -300 600 600" aria-hidden="true" fill="none" strokeWidth="1" className={cx('pointer-events-none', className)} style={{ stroke, ...style }} {...props}>
      <defs>
        <path id={id} d={PETAL_LARGE} />
      </defs>
      <g data-spin={spin}>
        <circle r="292" />
        <circle r="270" strokeDasharray="1 8" />
        {rings.map((r) => (
          <circle key={r} r={r} />
        ))}
        <Petals href={`#${id}`} count={12} />
      </g>
    </svg>
  );
}
