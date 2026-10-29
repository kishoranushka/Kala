/* Copy and layout for the Home page sections. Bracketed text is for the artist to replace. */

/* the atlas index: "all" plus four collections */
export const ATLAS_FILTERS = [
  { id: 'all', label: 'All works' },
  { id: 'devotional', label: 'Devotional' },
  { id: 'mandala', label: 'Mandala Studies' },
  { id: 'portraits', label: 'Portraits' },
  { id: 'murals', label: 'Murals' },
];

/* six works hung salon-style on the 12-column wall; the scroll parallax (`speed`) staggers them */
export const ATLAS_WORKS = [
  { id: 'om', speed: 0.4, large: true, eyebrow: 'Pl. 02 · Mandala Studies', meta: '[Medium] · [Size] · [Year]', slot: 'col-[1/6] max-lg:col-auto' },
  { id: 'child', speed: 1.3, eyebrow: 'Pl. 03 · Portraits', meta: '[Medium] · [Size]', cta: 'Commission a Portrait', slot: 'col-[7/10] max-lg:col-auto' },
  { id: 'ganesha', speed: 0.8, eyebrow: 'Pl. 04 · Devotional', meta: '[Medium] · [Size]', cta: 'Commission something similar', slot: 'col-[10/13] max-lg:col-auto' },
  { id: 'mural', speed: 0.5, wide: true, large: true, eyebrow: 'Pl. 05 · Murals', meta: 'Painted on site · [Location]', cta: 'Commission a Wall', slot: 'col-[2/8] max-lg:col-span-full' },
  { id: 'krishna', speed: 1.5, eyebrow: 'Pl. 01 · Devotional', meta: '[Medium] · [Size]', slot: 'col-[9/12] max-lg:col-auto' },
  { id: 'chalk', speed: 1, eyebrow: 'Pl. 06 · Murals', meta: 'Wall mural · [Location]', cta: 'Commission a Wall', slot: 'col-[4/7] max-lg:col-auto' },
];

export const PATTERN_STEPS = [
  { num: 'I', title: 'The centre', note: '[Where a painting begins for you.]' },
  { num: 'II', title: 'The repeat', note: '[What repetition gives the work.]' },
  { num: 'III', title: 'The edge', note: '[How you know a piece is finished.]' },
];

/* labels pinned around the pattern mandala (desktop and tablet) */
export const PATTERN_LABELS = [
  { text: 'I · The centre', left: '58%', top: '46%', rule: 56 },
  { text: 'II · The repeat', left: '66%', top: '28%', rule: 40 },
  { text: 'III · The edge', left: '78%', top: '8%', rule: 32 },
];

export const COMMISSION_WAYS = [
  { title: 'An idea', note: 'A feeling, a memory, a colour you can’t stop thinking about.' },
  { title: 'A reference image', note: 'A photograph, a sketch, a painting you love.' },
  { title: 'A room', note: 'The space it will live in: its light, its people.' },
  { title: 'A wall', note: 'A blank stretch of plaster waiting for a story.' },
];

export const LEDGER_WORKS = ['chalk', 'mural', 'ganesha', 'child'];

export const MARQUEE = [
  { text: 'Original paintings' },
  { text: 'Mandalas', italic: true },
  { text: 'Commissions' },
  { text: 'Art that lives beyond the canvas', italic: true },
];

/* section headings on Home run a touch larger at the low end than inner pages */
export const HOME_H2 = 'mt-5 font-display text-[clamp(38px,4.4vw,64px)] leading-[1.06] tracking-[-.01em]';
