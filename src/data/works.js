/* KALA — artwork and collection records shared by every page.
   Replace bracketed values with real details. Status is one of:
   available · sold · archived · inquiry  (a business state — never inferred from price). */

import krishnaImg from '@/assets/images/krishna-and-radha.jpg';
import omImg from '@/assets/images/om-mandala.jpg';
import childImg from '@/assets/images/child-portrait.jpg';
import ganeshaImg from '@/assets/images/ganesha.jpg';
import muralImg from '@/assets/images/mandala-wall-mural.jpg';
import chalkImg from '@/assets/images/think-out-of-the-box.jpg';
import vitthalImg from '@/assets/images/vitthal.jpg';
import fluteImg from '@/assets/images/flute-and-veena.jpg';
import fluteRoomImg from '@/assets/images/flute-and-veena-room.jpg';
import krishnaChildImg from '@/assets/images/krishna-and-a-child.jpg';
import escapeImg from '@/assets/images/escape-key.jpg';
import escapeEaselImg from '@/assets/images/escape-key-easel.jpg';
import bloomImg from '@/assets/images/just-bloom.jpg';
import paintsImg from '@/assets/images/studio-paint-table.jpg';
import lotusImg from '@/assets/images/studio-lotus-sketchbook.jpg';
import artistPortraitImg from '@/assets/images/artist-portrait.png';

import chalkFilm from '@/assets/films/think-out-of-the-box.mp4';
import chalkPoster from '@/assets/films/think-out-of-the-box-poster.jpg';
import childFilm from '@/assets/films/child-portrait.mp4';
import childPoster from '@/assets/films/child-portrait-poster.jpg';
import escapeFilm from '@/assets/films/escape-key.mp4';
import escapePoster from '@/assets/films/escape-key-poster.jpg';
import ganeshaFilm from '@/assets/films/ganesha.mp4';
import ganeshaPoster from '@/assets/films/ganesha-poster.jpg';
import krishnaFilm from '@/assets/films/krishna-and-radha.mp4';
import krishnaPoster from '@/assets/films/krishna-and-radha-poster.jpg';
import krishnaChildFilm from '@/assets/films/krishna-and-a-child.mp4';
import krishnaChildPoster from '@/assets/films/krishna-and-a-child-poster.jpg';
import muralFilm from '@/assets/films/mandala-wall-mural.mp4';
import muralPoster from '@/assets/films/mandala-wall-mural-poster.jpg';
import omFilm from '@/assets/films/om-mandala.mp4';
import omPoster from '@/assets/films/om-mandala-poster.jpg';
import vitthalFilm from '@/assets/films/vitthal.mp4';
import vitthalPoster from '@/assets/films/vitthal-poster.jpg';
import studioFilm from '@/assets/films/studio.mp4';
import studioPoster from '@/assets/films/studio-poster.jpg';
import sketchFilm from '@/assets/films/sketchbook.mp4';
import sketchPoster from '@/assets/films/sketchbook-poster.jpg';
import dotsFilm from '@/assets/films/dot-rings.mp4';
import dotsPoster from '@/assets/films/dot-rings-poster.jpg';
import easelFilm from '@/assets/films/on-the-easel.mp4';
import easelPoster from '@/assets/films/on-the-easel-poster.jpg';

/* every status pairs a word with a shape, never colour alone (see StatusBadge) */
export const STATUS = {
  available: { label: 'Available', rank: 0 },
  inquiry: { label: 'Inquiry only', rank: 1 },
  sold: { label: 'Sold', rank: 2 },
  archived: { label: 'Archived', rank: 3 },
};

export const COLLECTIONS = [
  { id: 'devotional', num: 'I', title: 'Devotional', lead: 'krishna', intro: '[Two or three lines in your words about the devotional paintings: what draws you to these figures and how you paint them.]' },
  { id: 'mandala', num: 'II', title: 'Mandala Studies', lead: 'om', intro: '[Two or three lines in your words about the mandala and dot-work pieces.]' },
  { id: 'portraits', num: 'III', title: 'Portraits', lead: 'child', intro: '[Two or three lines in your words about portraits and personal pieces.]' },
  { id: 'murals', num: 'IV', title: 'Murals', lead: 'mural', intro: '[Two or three lines in your words about painting walls: homes, schools, studios.]' },
  { id: 'small', num: 'V', title: 'Small Works', lead: 'escape', intro: '[Two or three lines in your words about little canvases and sketchbook pages: quick, personal, often funny.]' },
];

export const WORKS = [
  {
    id: 'krishna', plate: '01', title: 'Krishna and Radha', collection: 'devotional', status: 'available',
    price: '₹ 00,000', medium: '[Medium]', size: '[Size]', year: '[Year]', framing: '[Framing]',
    img: krishnaImg, w: 969, h: 1190, crop: true,
    alt: 'Krishna in a striped saffron turban with a peacock feather, his cobalt-blue face beside Radha’s green-and-white face, against a mottled ochre ground',
    note: '[A few lines in your words: what started this painting, and what you wanted it to hold.]',
    details: [{ label: 'Detail I', origin: '34% 24%', scale: 2.2 }, { label: 'Detail II', origin: '68% 64%', scale: 2.2 }],
  },
  {
    id: 'om', plate: '02', title: 'Om Mandala', collection: 'mandala', status: 'available',
    price: '₹ 00,000', medium: '[Medium]', size: '[Size]', year: '[Year]', framing: '[Framing]',
    img: omImg, w: 1168, h: 954,
    alt: 'A dot-work mandala on deep ultramarine: a glowing saffron Om at the centre, ringed with yellow, white and blue dots and pale blue fan motifs',
    note: '[A few lines in your words: how long the dot work took, and why the Om sits at its centre.]',
    details: [{ label: 'Detail I', origin: '50% 48%', scale: 2.6 }, { label: 'Detail II', origin: '24% 42%', scale: 3 }],
  },
  {
    id: 'child', plate: '03', title: 'Child Portrait', collection: 'portraits', status: 'inquiry',
    price: '', medium: '[Medium]', size: '[Size]', year: '[Year]', framing: '[Framing]',
    img: childImg, w: 928, h: 1206, archiveNo: '006',
    alt: 'A sleeping child resting their chin in both hands, painted in rose, vermilion and magenta over a violet ground, with small sculpted roses at the edges',
    note: '[A few lines in your words about this portrait and the kind of personal pieces you make.]',
    details: [{ label: 'Detail I', origin: '50% 36%', scale: 2.1 }, { label: 'Detail II', origin: '50% 80%', scale: 2.2 }],
  },
  {
    id: 'ganesha', plate: '04', title: 'Ganesha', collection: 'devotional', status: 'sold',
    price: '', medium: '[Medium]', size: '[Size]', year: '[Year]', framing: '[Framing]',
    img: ganeshaImg, w: 834, h: 1201, archiveNo: '009',
    alt: 'A stylised Ganesha in soft cobalt and periwinkle blue, a raised saffron hand and great curves of orange and vermilion against black, with a red hibiscus in the corner',
    note: '[A few lines in your words about this Ganesha.]',
    details: [{ label: 'Detail I', origin: '52% 28%', scale: 2.4 }, { label: 'Detail II', origin: '86% 88%', scale: 2.6 }],
  },
  {
    id: 'mural', plate: '05', title: 'Mandala Wall Mural', collection: 'murals', status: 'archived',
    price: '', medium: 'Wall mural', size: '[Wall size]', year: '[Year]', framing: 'Painted on site · [Location]',
    img: muralImg, w: 1166, h: 656, archiveNo: '011',
    alt: 'A half-mandala painted on a pale wall, rising in layered petals of crimson, saffron, yellow, lilac and turquoise, with large teal leaves at its edges',
    note: '[A few lines in your words: whose wall this was and how long it took.]',
    details: [{ label: 'Detail I', origin: '50% 92%', scale: 2.4 }, { label: 'Detail II', origin: '36% 30%', scale: 2.4 }],
  },
  {
    id: 'chalk', plate: '06', title: 'Think Out of the Box', collection: 'murals', status: 'archived',
    price: '', medium: 'Wall mural', size: '[Wall size]', year: '[Year]', framing: 'Painted on site · [Location]',
    img: chalkImg, w: 1159, h: 960, archiveNo: '014',
    alt: 'A chalkboard-black wall mural reading Think Out of the Box in pale blue, with a glowing lightbulb full of gears and a cascade of blue, yellow and white squares; the artist stands beside it pointing to the work',
    note: '[A few lines in your words: where this wall is and what it was made for.]',
    details: [{ label: 'Detail I', origin: '28% 70%', scale: 2.2 }, { label: 'Detail II', origin: '78% 30%', scale: 2 }],
  },
  {
    id: 'vitthal', plate: '07', title: 'Vitthal', collection: 'devotional', status: 'available',
    price: '₹ 00,000', medium: '[Medium]', size: '[Size]', year: '[Year]', framing: '[Framing]',
    img: vitthalImg, w: 1005, h: 1453,
    alt: 'Vitthal with closed eyes and a white tilak, a tall saffron-and-gold crown set with blue petal jewels, and sunburst earrings, on deep indigo',
    note: '[A few lines in your words about painting Vitthal: the crown, the stillness, the indigo.]',
    details: [{ label: 'Detail I', origin: '50% 40%', scale: 2.4 }, { label: 'Detail II', origin: '50% 74%', scale: 2.1 }],
  },
  {
    id: 'flute', plate: '08', title: 'Flute and Veena', collection: 'devotional', status: 'available',
    price: '₹ 00,000', medium: '[Medium]', size: '[Size]', year: '[Year]', framing: 'Framed, black frame with mat',
    img: fluteImg, w: 471, h: 626,
    room: { img: fluteRoomImg, w: 680, h: 900, label: 'Framed, on a wall' },
    alt: 'A serene face with a red forehead mark and gold-beaded hair, a small blue Krishna playing the flute behind her and a veena across the foreground, in cobalt and sky blue',
    note: '[A few lines in your words: the two instruments, and why the blues.]',
    details: [{ label: 'Detail I', origin: '62% 42%', scale: 2.1 }, { label: 'Detail II', origin: '22% 20%', scale: 3 }],
  },
  {
    id: 'krishnachild', plate: '09', title: 'Krishna and a Child', collection: 'small', status: 'available',
    price: '₹ 00,000', medium: '[Medium]', size: '[Size]', year: '2026', framing: '[Framing]',
    img: krishnaChildImg, w: 1185, h: 1800,
    alt: 'Seen from behind, Krishna with a leaf in his hair and a child in a yellow dress lean on a railing together against a soft green ground',
    note: '[A few lines in your words about this small canvas.]',
    details: [{ label: 'Detail I', origin: '35% 22%', scale: 2.2 }, { label: 'Signature', origin: '86% 92%', scale: 3 }],
  },
  {
    id: 'escape', plate: '10', title: 'The Escape Key Exists for a Reason', collection: 'small', status: 'available',
    price: '₹ 00,000', medium: '[Medium]', size: '[Size]', year: '2026', framing: '[Framing]',
    img: escapeImg, w: 1800, h: 1310,
    room: { img: escapeEaselImg, w: 1705, h: 1800, label: 'On its easel' },
    alt: 'A small figure climbs out of a dark keyboard, lifting the Esc key like a hatch, under the words The escape key exists for a reason',
    note: '[A few lines in your words: the day this one was painted, and the joke inside it.]',
    details: [{ label: 'Detail I', origin: '44% 52%', scale: 2.4 }, { label: 'Signature', origin: '12% 88%', scale: 3 }],
  },
  {
    id: 'bloom', plate: '11', title: 'Just Bloom', collection: 'small', status: 'inquiry',
    price: '', medium: 'Sketchbook spread · [Medium]', size: '[Size]', year: '[Year]', framing: 'Unframed',
    img: bloomImg, w: 700, h: 1056,
    alt: 'An open sketchbook painted saffron orange with white lotus line drawings and the words Just Bloom in red script, styled with foam roses',
    note: '[A few lines in your words about the sketchbook and the lettering.]',
    details: [{ label: 'Detail I', origin: '52% 48%', scale: 2.2 }, { label: 'Detail II', origin: '30% 70%', scale: 2.4 }],
  },
];

/* motion studies: silent films made from the photographs above (not footage) */
export const FILMS = {
  chalk: { src: chalkFilm, poster: chalkPoster },
  child: { src: childFilm, poster: childPoster },
  escape: { src: escapeFilm, poster: escapePoster },
  ganesha: { src: ganeshaFilm, poster: ganeshaPoster },
  krishna: { src: krishnaFilm, poster: krishnaPoster },
  krishnachild: { src: krishnaChildFilm, poster: krishnaChildPoster },
  mural: { src: muralFilm, poster: muralPoster },
  om: { src: omFilm, poster: omPoster },
  vitthal: { src: vitthalFilm, poster: vitthalPoster },
  studio: { src: studioFilm, poster: studioPoster },
  sketch: { src: sketchFilm, poster: sketchPoster },
  dots: { src: dotsFilm, poster: dotsPoster },
  easel: { src: easelFilm, poster: easelPoster },
};

/* studio photographs (real, not artworks) */
export const STUDIO = {
  paints: { img: paintsImg, w: 1280, h: 540, alt: 'Acrylic paint pots, two brushes and an unpainted terracotta pot on a green cloth' },
  lotus: { img: lotusImg, w: 720, h: 1280, alt: 'A sketchbook with two red lotus line drawings beside dot-painted terracotta pots' },
  easel: { img: escapeEaselImg, w: 1705, h: 1800, alt: 'The Escape Key painting on a small wooden easel beside two ceramic bells' },
  portrait: { img: artistPortraitImg, w: 895, h: 1249, alt: 'The artist smiling, in glasses and a linen shirt, holding up a phone' },
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
