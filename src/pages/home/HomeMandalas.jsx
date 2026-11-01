import { Petals, useSvgId } from '@/components/mandala/Mandala';

/* The pastel mandala rising from the top of the home hero.
   Illustration colours live here (they are paint, not UI): change them to recolour the bloom. */
const PAINT = {
  line: '#DCCFBD',
  bead: '#D2C3AC',
  white: '#FFFEFA',
  sky: '#C9DAEF',
  mint: '#CAE7E0',
  rose: '#F2C6BF',
  peach: '#F6D5B4',
  straw: '#F3E4AC',
  blush: '#ECB8BC',
  sage: '#CCDFC5',
  lilac: '#DCCFEB',
  cream: '#FBF7F0',
};

const P = {
  p0: 'M0,-500 C87.4,-524.2 84.6,-614.4 0,-610 C-84.6,-614.4 -87.4,-524.2 0,-500Z',
  p2: 'M0,-360 C58,-391.9 36,-448.9 0,-474 C-36,-448.9 -58,-391.9 0,-360Z',
  p2i: 'M0,-386 C18,-403.9 11.2,-435.9 0,-450 C-11.2,-435.9 -18,-403.9 0,-386Z',
  p3: 'M0,-262 C76,-291 73.6,-399.3 0,-394 C-73.6,-399.3 -76,-291 0,-262Z',
  p3i: 'M0,-286 C30,-310.1 18.6,-353.1 0,-372 C-18.6,-353.1 -30,-310.1 0,-286Z',
  p3g: 'M0,-318 C15,-338.7 9.3,-375.7 0,-392 C-9.3,-375.7 -15,-338.7 0,-318Z',
  p5: 'M0,-140 C52,-167.4 32.2,-216.4 0,-238 C-32.2,-216.4 -52,-167.4 0,-140Z',
  p5i: 'M0,-160 C16,-175.1 9.9,-202.1 0,-214 C-9.9,-202.1 -16,-175.1 0,-160Z',
  p7: 'M0,-56 C32.3,-69.6 31.3,-120.5 0,-118 C-31.3,-120.5 -32.3,-69.6 0,-56Z',
};

/* `count` beads on a circle of `radius`, starting at `start` degrees from twelve o'clock */
function Beads({ count, radius, start = 0, r, fill }) {
  const fills = Array.isArray(fill) ? fill : [fill];
  return Array.from({ length: count }, (_, i) => {
    const a = ((start + (360 / count) * i) * Math.PI) / 180;
    return <circle key={i} cx={+(Math.sin(a) * radius).toFixed(1)} cy={+(-Math.cos(a) * radius).toFixed(1)} r={r} fill={fills[i % fills.length]} />;
  });
}

/* one bloom layer: fades and opens on load (data-ml), then turns (data-spin) */
function Layer({ spin, children }) {
  return (
    <g data-ml>
      {spin ? <g data-spin={spin}>{children}</g> : children}
    </g>
  );
}

export function HeroDome() {
  const id = useSvgId();
  const ref = (k) => `#${id}${k}`;
  return (
    <svg viewBox="-560 -560 1120 1120" aria-hidden="true" focusable="false" className="block size-full overflow-visible">
      <defs>
        <radialGradient id={`${id}glow`}>
          <stop offset="0" stopColor={PAINT.peach} stopOpacity=".55" />
          <stop offset=".55" stopColor={PAINT.rose} stopOpacity=".18" />
          <stop offset="1" stopColor="#F6F2EB" stopOpacity="0" />
        </radialGradient>
        {Object.entries(P).map(([k, d]) => (
          <path key={k} id={`${id}${k}`} d={d} />
        ))}
      </defs>
      <circle r="660" fill={`url(#${id}glow)`} />

      <Layer spin={-360}>
        <g fill="none" stroke={PAINT.line} strokeWidth="2">
          <Petals href={ref('p0')} count={20} />
        </g>
        <Beads count={20} radius={560} start={9} r={4} fill={PAINT.bead} />
      </Layer>

      <Layer spin={240}>
        <circle r="512" fill="none" stroke={PAINT.line} strokeWidth="1.5" strokeDasharray="2 10" />
        <Beads count={72} radius={494} r={4.2} fill={[PAINT.bead, PAINT.blush]} />
      </Layer>

      <Layer spin={-200}>
        <g fill={PAINT.sky} stroke={PAINT.white} strokeWidth="5">
          <Petals href={ref('p2')} count={24} start={7.5} />
        </g>
        <g fill={PAINT.mint}>
          <Petals href={ref('p2i')} count={24} start={7.5} />
        </g>
        <Beads count={24} radius={480} start={7.5} r={4.5} fill={PAINT.bead} />
      </Layer>

      <Layer spin={160}>
        <g fill={PAINT.rose} stroke={PAINT.white} strokeWidth="5">
          <Petals href={ref('p3')} count={16} />
        </g>
        <g fill={PAINT.peach}>
          <Petals href={ref('p3i')} count={16} />
        </g>
        <g fill={PAINT.straw} stroke={PAINT.white} strokeWidth="3">
          <Petals href={ref('p3g')} count={16} start={11.25} />
        </g>
        <Beads count={16} radius={300} r={3.8} fill={PAINT.white} />
        <Beads count={16} radius={322} r={3.4} fill={PAINT.white} />
        <Beads count={16} radius={342} r={3} fill={PAINT.white} />
      </Layer>

      <Layer spin={-300}>
        <circle r="262" fill={PAINT.straw} stroke={PAINT.white} strokeWidth="5" />
        <circle r="236" fill={PAINT.cream} />
        <Beads count={48} radius={249} r={4.6} fill={PAINT.bead} />
      </Layer>

      <Layer spin={-140}>
        <g fill={PAINT.peach} stroke={PAINT.white} strokeWidth="4">
          <Petals href={ref('p5')} count={12} start={15} />
        </g>
        <g fill={PAINT.sage}>
          <Petals href={ref('p5i')} count={12} start={15} />
        </g>
        <Beads count={12} radius={222} r={4} fill={PAINT.lilac} />
        <Beads count={24} radius={152} start={7.5} r={2.6} fill={PAINT.bead} />
      </Layer>

      <Layer spin={200}>
        <circle r="140" fill={PAINT.blush} stroke={PAINT.white} strokeWidth="5" />
        <Beads count={32} radius={127} r={3.6} fill={PAINT.white} />
      </Layer>

      <Layer spin={120}>
        <g fill={PAINT.mint} stroke={PAINT.white} strokeWidth="4">
          <Petals href={ref('p7')} count={8} start={22.5} />
        </g>
      </Layer>

      <Layer>
        <circle r="56" fill={PAINT.lilac} stroke={PAINT.white} strokeWidth="4" />
        <Beads count={18} radius={44} r={3} fill={PAINT.straw} />
        <circle r="18" fill={PAINT.straw} stroke={PAINT.white} strokeWidth="3" />
        <circle r="6" fill={PAINT.blush} />
      </Layer>
    </svg>
  );
}
