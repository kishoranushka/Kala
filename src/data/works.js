/* KALA — artwork and collection records shared by every page.
   The paintings themselves live in works.json — edit them with the local editor
   (`npm run dev`, then open http://localhost:5173/__admin) or by hand.
   Status is one of: available · sold · archived · inquiry  (a business state — never inferred from price). */

import DATA from './works.json';

/* every image in src/assets/images, by file name (e.g. 'peacock.webp') */
const IMAGES = Object.fromEntries(
  Object.entries(import.meta.glob('../assets/images/*.{webp,jpg,jpeg,png}', { eager: true, import: 'default' })).map(([p, url]) => [p.split('/').pop(), url]),
);
const img = (file) => {
  if (!IMAGES[file]) console.warn(`[works] missing image: src/assets/images/${file}`);
  return IMAGES[file];
};

/* every status pairs a word with a shape, never colour alone (see StatusBadge) */
export const STATUS = {
  available: { label: 'Available', rank: 0 },
  inquiry: { label: 'Inquiry only', rank: 1 },
  sold: { label: 'Sold', rank: 2 },
  archived: { label: 'Archived', rank: 3 },
};

/* forgiving about how a status was typed: "Sold", "Inquiry Only", "inquiry"… */
const normalizeStatus = (s) => {
  const key = String(s ?? '').trim().toLowerCase().replace(/\s*only$/, '');
  return STATUS[key] ? key : 'inquiry';
};

export const COLLECTIONS = DATA.collections;

export const WORKS = DATA.works.map(({ image, room, ...w }) => ({
  ...w,
  status: normalizeStatus(w.status),
  img: img(image),
  ...(room?.image ? { room: { ...room, img: img(room.image) } } : {}),
}));

/* photographs of the artist and her work off the canvas (real, not artworks) */
export const PHOTOS = {
  exhibition: { img: img('exhibition-wall.webp'), w: 900, h: 1600, alt: 'Two of Anushka’s framed paintings, Radha and Krishna above an orange-and-blue Ganesha, hung at an exhibition beside her artist card' },
  withPeacock: { img: img('artist-with-peacock.webp'), w: 1139, h: 1600, alt: 'Anushka Kishor smiling, holding up her peacock painting, with more of her paintings spread on the table in front of her' },
  outdoors: { img: img('little-buddha-outdoors.webp'), w: 1125, h: 1500, alt: 'Anushka sitting on a rock outdoors, holding up a small painting of a smiling monk on a lotus' },
  childSketch: { img: img('child-sketch.webp'), alt: 'A red line sketch of a child with hands on cheeks on a white canvas board, brushes and paints on the desk behind' },
  faceClose: { img: img('face-paint-closeup.webp'), alt: 'Close-up of Anushka in face paint: blue glitter across one cheek, bold black eyeliner and lips, painted stitches at the corner of the mouth' },
  faceRose: { img: img('face-paint-blue-rose.webp'), alt: 'Anushka in the same face paint and black gloves, holding a blue rose' },
  gown: { img: img('costume-rose-gown.webp'), alt: 'Anushka in a corridor, looking back over her shoulder, wearing a black gown with a long sheer train covered in black roses' },
  jacketBack: { img: img('jacket-butterfly-back.webp'), alt: 'The back of an olive jacket hand-painted with a large monarch butterfly in orange, yellow and teal' },
  jacketWorn: { img: img('jacket-worn.webp'), alt: 'Anushka wearing the olive jacket off one shoulder, a painted butterfly on the sleeve and a painted leaf collar' },
  jacketBench: { img: img('jacket-park-bench.webp'), alt: 'Anushka sitting on a park bench with the painted butterfly jacket draped beside her' },
  paintingMural: { img: img('painting-mural.webp'), alt: 'Anushka in a red jacket painting a colourful mandala mural high on a white wall' },
  park: { img: img('artist-park.webp'), alt: 'Anushka sitting on a stone post in a park, in a black top and wide blue jeans, smiling, with an ivy-covered slope behind her' },
  pot: { img: img('artist-painted-pot.webp'), alt: 'Anushka holding a hand-painted pot in red, yellow and black, in front of a geometric wall painted in pink, sky blue, grey and black' },
  cobalt: { img: img('artist-cobalt-wall.webp'), alt: 'Anushka smiling in front of a cobalt-blue wall, a marigold tucked behind her ear, wearing her hand-painted olive jacket' },
  whiteTop: { img: img('artist-white-top.webp'), alt: 'Anushka smiling at the camera in a white top, owl earrings, against a pale wall' },
};

/* Instagram reels — swap each url for the reel's own link (instagram.com/reel/…) */
const REEL_URL = 'https://www.instagram.com/chaotic_kishor/reels/';
export const REELS = [
  { cover: img('little-buddha-outdoors.webp'), title: '[Reel title]', url: REEL_URL, alt: 'Anushka outdoors holding a small painting of a smiling monk on a lotus' },
  { cover: img('child-sketch.webp'), title: '[Reel title]', url: REEL_URL, alt: 'A red line sketch of a child with hands on cheeks on a white canvas, brushes and paints on the desk' },
  { cover: img('face-paint-closeup.webp'), title: '[Reel title]', url: REEL_URL, alt: 'Close-up of Anushka in face paint: blue glitter on one cheek, bold black liner and lips' },
  { cover: img('little-elephant.webp'), title: '[Reel title]', url: REEL_URL, alt: 'Watercolour of a little blue elephant blowing hearts' },
  { cover: img('painting-mural.webp'), title: '[Reel title]', url: REEL_URL, alt: 'Anushka in a red jacket painting a colourful mandala mural high on a white wall' },
  { cover: img('costume-rose-gown.webp'), title: '[Reel title]', url: REEL_URL, alt: 'Anushka in a corridor in a black gown with a long sheer train covered in black roses' },
  { cover: img('jacket-worn.webp'), title: '[Reel title]', url: REEL_URL, alt: 'Anushka wearing an olive jacket with a hand-painted monarch butterfly on the sleeve' },
  { cover: img('buddha-with-lotus.webp'), title: '[Reel title]', url: REEL_URL, alt: 'Green Buddha with a coral lotus' },
];

/* studio photographs (real, not artworks) */
export const STUDIO = {
  paints: { img: img('studio-paint-table.webp'), w: 1280, h: 540, alt: 'Acrylic paint pots, two brushes and an unpainted terracotta pot on a green cloth' },
  lotus: { img: img('studio-lotus-sketchbook.webp'), w: 720, h: 1280, alt: 'A sketchbook with two red lotus line drawings beside dot-painted terracotta pots' },
  easel: { img: img('escape-key-easel.webp'), w: 1705, h: 1800, alt: 'The Escape Key painting on a small wooden easel beside two ceramic bells' },
};

/* ------------------------------------------------------------------ helpers */
const worksById = new Map(WORKS.map((w) => [w.id, w]));
const collectionsById = new Map(COLLECTIONS.map((c) => [c.id, c]));

export const getWork = (id) => worksById.get(id);
export const getCollection = (id) => collectionsById.get(id);
export const worksIn = (collectionId) => WORKS.filter((w) => w.collection === collectionId);
export const availableWorks = () => WORKS.filter((w) => w.status === 'available');

export const isAvailable = (w) => w.status === 'available';
export const ratioOf = (w) => `${w.w} / ${w.h}`;
export const metaLine = (w) => `${w.medium} · ${w.size}`;
export const plateLabel = (w) => `Pl. ${w.plate} · ${getCollection(w.collection).title}`;
export const pad2 = (n) => String(n).padStart(2, '0');

/* what to offer instead of a price when a work can't be bought */
export function priceLine(w) {
  if (w.status === 'available') return w.price;
  if (w.status === 'sold') return 'Commission something similar';
  if (w.status === 'inquiry') return 'Enquire about this work';
  return 'Commission a wall';
}
