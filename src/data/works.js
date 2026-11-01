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
import radhaBlueImg from '@/assets/images/radha-and-krishna-in-blue.jpg';
import exhibitionImg from '@/assets/images/exhibition-wall.jpg';
import buddhaImg from '@/assets/images/buddha-with-lotus.jpg';
import sunflowerImg from '@/assets/images/sunflower.jpg';
import butterflyImg from '@/assets/images/blue-butterfly.jpg';
import elephantImg from '@/assets/images/little-elephant.jpg';
import peacockImg from '@/assets/images/peacock.jpg';
import artistPeacockImg from '@/assets/images/artist-with-peacock.jpg';
import littleBuddhaImg from '@/assets/images/little-buddha.jpg';
import littleBuddhaOutdoorsImg from '@/assets/images/little-buddha-outdoors.jpg';
import catImg from '@/assets/images/happy-cat.jpg';
import lightningImg from '@/assets/images/lightning.jpg';
import bicycleImg from '@/assets/images/bicycle-with-flowers.jpg';
import childSketchImg from '@/assets/images/child-sketch.jpg';
import faceCloseImg from '@/assets/images/face-paint-closeup.jpg';
import faceRoseImg from '@/assets/images/face-paint-blue-rose.jpg';
import gownImg from '@/assets/images/costume-rose-gown.jpg';
import jacketBackImg from '@/assets/images/jacket-butterfly-back.jpg';
import jacketWornImg from '@/assets/images/jacket-worn.jpg';
import jacketBenchImg from '@/assets/images/jacket-park-bench.jpg';
import paintingMuralImg from '@/assets/images/painting-mural.jpg';
import artistParkImg from '@/assets/images/artist-park.jpg';
import artistPotImg from '@/assets/images/artist-painted-pot.jpg';
import artistCobaltImg from '@/assets/images/artist-cobalt-wall.jpg';
import artistWhiteImg from '@/assets/images/artist-white-top.jpg';

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
  { id: 'devotional', num: 'I', title: 'Devotional', lead: 'radhakrishna', intro: '[Two or three lines in your words about the devotional paintings: what draws you to these figures and how you paint them.]' },
  { id: 'mandala', num: 'II', title: 'Mandala Studies', lead: 'om', intro: '[Two or three lines in your words about the mandala and dot-work pieces.]' },
  { id: 'portraits', num: 'III', title: 'Portraits', lead: 'child', intro: '[Two or three lines in your words about portraits and personal pieces.]' },
  { id: 'murals', num: 'IV', title: 'Murals', lead: 'mural', intro: '[Two or three lines in your words about painting walls: homes, schools, studios.]' },
  { id: 'small', num: 'V', title: 'Small Works', lead: 'cat', intro: '[Two or three lines in your words about little canvases and sketchbook pages: quick, personal, often funny.]' },
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
    img: childImg, w: 928, h: 1206,
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
  {
    id: 'radhakrishna', plate: '12', title: 'Radha and Krishna in Blue', collection: 'devotional', status: 'inquiry',
    price: '₹ 00,000', medium: '[Medium]', size: '[Size]', year: '[Year]', framing: 'Framed, black frame with white mount',
    img: radhaBlueImg, w: 1120, h: 1579,
    room: { img: exhibitionImg, w: 900, h: 1600, label: 'At the exhibition' },
    alt: 'Radha with closed eyes, a red tilak and a crown of golden dots, a sweep of cream and gold behind her, and a small blue Krishna playing the flute in the corner, on a bright blue ground',
    note: '[A few lines in your words: what this painting is about, and where it was shown.]',
    details: [{ label: 'Detail I', origin: '56% 44%', scale: 2.2 }, { label: 'Detail II', origin: '18% 22%', scale: 2.6 }],
  },
  {
    id: 'buddha', plate: '13', title: 'Buddha with Lotus', collection: 'devotional', status: 'available',
    price: '₹ 00,000', medium: 'Acrylic on canvas', size: '[Size]', year: '2022', framing: '[Framing]',
    img: buddhaImg, w: 1148, h: 1400,
    alt: 'Half of a serene green Buddha face with closed eyes and a long blue earlobe, a coral lotus below, on a dark green shimmering ground, signed Anushka 28/06/22',
    note: '[A few lines in your words about this painting.]',
    details: [{ label: 'Detail I', origin: '30% 30%', scale: 2.2 }, { label: 'Signature', origin: '88% 92%', scale: 3 }],
  },
  {
    id: 'sunflower', plate: '14', title: 'Sunflower', collection: 'small', status: 'available',
    price: '₹ 00,000', medium: '[Medium]', size: '[Size]', year: '[Year]', framing: '[Framing]',
    img: sunflowerImg, w: 1290, h: 1800,
    alt: 'A close-up sunflower: long saffron and lemon petals around a dark seed head flecked with green, on deep navy',
    note: '[A few lines in your words about this painting.]',
    details: [{ label: 'Detail I', origin: '30% 64%', scale: 2.2 }, { label: 'Detail II', origin: '66% 40%', scale: 2.2 }],
  },
  {
    id: 'butterfly', plate: '15', title: 'Blue Butterfly', collection: 'small', status: 'available',
    price: '₹ 00,000', medium: '[Medium]', size: '[Size]', year: '[Year]', framing: '[Framing]',
    img: butterflyImg, w: 1209, h: 1800,
    alt: 'A large black butterfly with blue-and-white wing panels and dotted edges, resting by blue tulips on bands of green',
    note: '[A few lines in your words about this painting.]',
    details: [{ label: 'Detail I', origin: '50% 40%', scale: 2.2 }, { label: 'Detail II', origin: '76% 84%', scale: 2.4 }],
  },
  {
    id: 'elephant', plate: '16', title: 'Little Elephant', collection: 'small', status: 'available',
    price: '₹ 00,000', medium: 'Watercolour on paper', size: '[Size]', year: '[Year]', framing: '[Framing]',
    img: elephantImg, w: 1077, h: 1400,
    alt: 'A watercolour baby elephant in blue with a yellow ear, curled up with its trunk raised, blowing three red hearts, over a blue sky melting into orange and pink',
    note: '[A few lines in your words about this painting.]',
    details: [{ label: 'Detail I', origin: '50% 40%', scale: 2.2 }, { label: 'Detail II', origin: '58% 26%', scale: 2.6 }],
  },
  {
    id: 'peacock', plate: '17', title: 'Peacock', collection: 'small', status: 'available',
    price: '₹ 00,000', medium: '[Medium]', size: '[Size]', year: '[Year]', framing: '[Framing]',
    img: peacockImg, w: 644, h: 744,
    room: { img: artistPeacockImg, w: 1139, h: 1600, label: 'In the artist’s hands' },
    alt: 'A royal-blue peacock with a golden beak against a yellow ground and swirling green tail feathers with blue-and-orange eyes',
    note: '[A few lines in your words about this painting.]',
    details: [{ label: 'Detail I', origin: '62% 56%', scale: 2 }, { label: 'Detail II', origin: '80% 24%', scale: 2.2 }],
  },
  {
    id: 'babybuddha', plate: '18', title: 'Little Buddha', collection: 'small', status: 'available',
    price: '₹ 00,000', medium: '[Medium]', size: '[Size]', year: '[Year]', framing: '[Framing]',
    img: littleBuddhaImg, w: 1264, h: 1400,
    room: { img: littleBuddhaOutdoorsImg, w: 1125, h: 1500, label: 'Painted outdoors' },
    alt: 'A smiling little monk in blue robes sitting on a pink lotus, white rays around him on a sky-blue ground, signed Anushka',
    note: '[A few lines in your words about this painting.]',
    details: [{ label: 'Detail I', origin: '50% 34%', scale: 2.2 }, { label: 'Signature', origin: '86% 94%', scale: 3 }],
  },
  {
    id: 'cat', plate: '19', title: 'Happy Cat', collection: 'small', status: 'available',
    price: '₹ 00,000', medium: '[Medium] on wood', size: '[Size]', year: '2024', framing: '[Framing]',
    img: catImg, w: 1222, h: 1400,
    alt: 'A grinning ginger cat with closed eyes, a red heart nose and long white whiskers, sitting tall against a speckled cobalt-blue ground, signed Anushka',
    note: '[A few lines in your words about this painting.]',
    details: [{ label: 'Detail I', origin: '50% 34%', scale: 2.2 }, { label: 'Signature', origin: '88% 90%', scale: 3 }],
  },
  {
    id: 'lightning', plate: '20', title: 'Lightning', collection: 'small', status: 'available',
    price: '₹ 00,000', medium: 'Watercolour in a sketchbook', size: '[Size]', year: '2021', framing: 'Unframed',
    img: lightningImg, w: 1080, h: 1080,
    alt: 'A sketchbook page of branching yellow-white lightning over a smoky orange and red sky, with paint tubes and brushes beside it',
    note: '[A few lines in your words about this painting.]',
    details: [{ label: 'Detail I', origin: '50% 46%', scale: 2 }, { label: 'Signature', origin: '72% 86%', scale: 2.6 }],
  },
  {
    id: 'bicycle', plate: '21', title: 'Bicycle with Flowers', collection: 'small', status: 'available',
    price: '₹ 00,000', medium: '[Medium]', size: '[Size]', year: '2021', framing: 'Unframed',
    img: bicycleImg, w: 1080, h: 607,
    alt: 'A rust-orange bicycle with a basket of white and blue flowers against a deep blue wash, styled with foam roses and brushes',
    note: '[A few lines in your words about this painting.]',
    details: [{ label: 'Detail I', origin: '50% 30%', scale: 2.2 }, { label: 'Detail II', origin: '62% 72%', scale: 2.2 }],
  },
];

/* photographs of the artist and her work off the canvas (real, not artworks) */
export const PHOTOS = {
  exhibition: { img: exhibitionImg, w: 900, h: 1600, alt: 'Two of Anushka’s framed paintings, Radha and Krishna above an orange-and-blue Ganesha, hung at an exhibition beside her artist card' },
  withPeacock: { img: artistPeacockImg, w: 1139, h: 1600, alt: 'Anushka Kishor smiling, holding up her peacock painting, with more of her paintings spread on the table in front of her' },
  outdoors: { img: littleBuddhaOutdoorsImg, w: 1125, h: 1500, alt: 'Anushka sitting on a rock outdoors, holding up a small painting of a smiling monk on a lotus' },
  childSketch: { img: childSketchImg, alt: 'A red line sketch of a child with hands on cheeks on a white canvas board, brushes and paints on the desk behind' },
  faceClose: { img: faceCloseImg, alt: 'Close-up of Anushka in face paint: blue glitter across one cheek, bold black eyeliner and lips, painted stitches at the corner of the mouth' },
  faceRose: { img: faceRoseImg, alt: 'Anushka in the same face paint and black gloves, holding a blue rose' },
  gown: { img: gownImg, alt: 'Anushka in a corridor, looking back over her shoulder, wearing a black gown with a long sheer train covered in black roses' },
  jacketBack: { img: jacketBackImg, alt: 'The back of an olive jacket hand-painted with a large monarch butterfly in orange, yellow and teal' },
  jacketWorn: { img: jacketWornImg, alt: 'Anushka wearing the olive jacket off one shoulder, a painted butterfly on the sleeve and a painted leaf collar' },
  jacketBench: { img: jacketBenchImg, alt: 'Anushka sitting on a park bench with the painted butterfly jacket draped beside her' },
  paintingMural: { img: paintingMuralImg, alt: 'Anushka in a red jacket painting a colourful mandala mural high on a white wall' },
  park: { img: artistParkImg, alt: 'Anushka sitting on a stone post in a park, in a black top and wide blue jeans, smiling, with an ivy-covered slope behind her' },
  pot: { img: artistPotImg, alt: 'Anushka holding a hand-painted pot in red, yellow and black, in front of a geometric wall painted in pink, sky blue, grey and black' },
  cobalt: { img: artistCobaltImg, alt: 'Anushka smiling in front of a cobalt-blue wall, a marigold tucked behind her ear, wearing her hand-painted olive jacket' },
  whiteTop: { img: artistWhiteImg, alt: 'Anushka smiling at the camera in a white top, owl earrings, against a pale wall' },
};

/* Instagram reels — swap each url for the reel's own link (instagram.com/reel/…) */
const REEL_URL = 'https://www.instagram.com/chaotic_kishor/reels/';
export const REELS = [
  { cover: littleBuddhaOutdoorsImg, title: '[Reel title]', url: REEL_URL, alt: 'Anushka outdoors holding a small painting of a smiling monk on a lotus' },
  { cover: childSketchImg, title: '[Reel title]', url: REEL_URL, alt: 'A red line sketch of a child with hands on cheeks on a white canvas, brushes and paints on the desk' },
  { cover: faceCloseImg, title: '[Reel title]', url: REEL_URL, alt: 'Close-up of Anushka in face paint: blue glitter on one cheek, bold black liner and lips' },
  { cover: elephantImg, title: '[Reel title]', url: REEL_URL, alt: 'Watercolour of a little blue elephant blowing hearts' },
  { cover: paintingMuralImg, title: '[Reel title]', url: REEL_URL, alt: 'Anushka in a red jacket painting a colourful mandala mural high on a white wall' },
  { cover: gownImg, title: '[Reel title]', url: REEL_URL, alt: 'Anushka in a corridor in a black gown with a long sheer train covered in black roses' },
  { cover: jacketWornImg, title: '[Reel title]', url: REEL_URL, alt: 'Anushka wearing an olive jacket with a hand-painted monarch butterfly on the sleeve' },
  { cover: buddhaImg, title: '[Reel title]', url: REEL_URL, alt: 'Green Buddha with a coral lotus' },
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
