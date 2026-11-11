/* Social cards (Open Graph / Twitter, 1200×630) and app icons.
   `npm run og` — renders each card as HTML in Edge headless (real Cormorant/Manrope from Google Fonts),
   then compresses to JPEG with sharp. Output goes to public/og/ and public/ (committed, served as-is).
   Re-run after adding or editing paintings, then build. `npm run og -- krishna peacock` renders only those keys.

   Cards: one per painting (/og/<id>.jpg), one per collection (/og/collection-<id>.jpg) and the main pages. */

import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import sharp from 'sharp';
import { createSeo } from '../../src/seo/meta.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const IMAGES = join(ROOT, 'src', 'assets', 'images');
const OUT = join(ROOT, 'public', 'og');
const readJson = (p) => JSON.parse(readFileSync(join(ROOT, p), 'utf8'));
const data = readJson('src/data/works.json');
const copy = readJson('src/seo/copy.json');
const seo = createSeo({ data, copy });

const EDGE = [
  process.env.EDGE_PATH,
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
].find((p) => p && existsSync(p));
if (!EDGE) throw new Error('[og] Edge/Chrome not found — set EDGE_PATH');

const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
/* *word* → the orange italic accent used across the site */
const accent = (s) => esc(s).replace(/\*(.+?)\*/g, '<em>$1</em>');
const fileUrl = (name) => pathToFileURL(join(IMAGES, name)).href;

const MARK = `<svg viewBox="-60 -60 120 120" width="44" height="44"><g fill="none" stroke="#22211F" stroke-width="2.4"><circle r="56"/><circle r="42" stroke-dasharray="1 5"/>${[0, 45, 90, 135, 180, 225, 270, 315]
  .map((r) => `<path d="M0,-54 C10,-46 10,-36 0,-28 C-10,-36 -10,-46 0,-54Z" transform="rotate(${r})"/>`)
  .join('')}<circle r="20"/></g><circle r="7" fill="#C9531F"/></svg>`;

function cardHtml({ images, eyebrow, title, meta, status }) {
  const long = title.replace(/\*/g, '').length;
  const size = long > 34 ? 50 : long > 24 ? 58 : 68;
  return `<!doctype html><html><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,500;1,300&family=Manrope:wght@500;600&display=block" rel="stylesheet">
<style>
  *{box-sizing:border-box} html,body{margin:0;width:1200px;height:630px;overflow:hidden}
  body{display:flex;background:#f6f2eb;color:#22211f;font-family:Manrope,sans-serif}
  .art{width:560px;height:630px;flex:none;background:#ece5d9;display:flex;align-items:center;justify-content:center;gap:20px;padding:56px 48px}
  .art img{display:block;min-width:0;max-width:100%;max-height:100%;object-fit:contain;box-shadow:0 22px 44px -22px rgba(34,33,31,.55);outline:10px solid #fffefa}
  .art.many{gap:32px;padding:56px 44px}
  .art.many img{flex:1 1 0;max-height:360px}
  .art.many img:nth-child(2){max-height:430px}
  .txt{flex:1;display:flex;flex-direction:column;padding:56px 64px 48px}
  .brand{display:flex;align-items:center;gap:16px}
  .word{font:500 30px/1 'Cormorant Garamond',serif;letter-spacing:.34em}
  .by{font:500 14px/1 Manrope;color:#6b645a;letter-spacing:.04em}
  .mid{margin:auto 0}
  .eyebrow{font:600 15px/1.2 Manrope;letter-spacing:.2em;text-transform:uppercase;color:#c9531f}
  h1{margin:20px 0 0;font:300 ${size}px/1.02 'Cormorant Garamond',serif;letter-spacing:-.01em}
  h1 em{font-style:italic;color:#c9531f}
  .meta{margin-top:22px;font:500 19px/1.4 Manrope;color:#4a4741}
  .status{display:inline-block;margin-top:20px;padding:9px 16px;border:1.5px solid #22211f;border-radius:6px;font:600 16px/1 Manrope}
  .foot{display:flex;justify-content:space-between;align-items:center;padding-top:18px;border-top:1px solid rgba(34,33,31,.16);font:500 15px/1 Manrope;color:#6b645a}
</style></head><body>
<div class="art${images.length > 1 ? ' many' : ''}">${images.map((i) => `<img src="${fileUrl(i)}">`).join('')}</div>
<div class="txt">
  <div class="brand">${MARK}<span class="word">KALA</span><span class="by">by Anushka Kishor</span></div>
  <div class="mid">
    ${eyebrow ? `<div class="eyebrow">${esc(eyebrow)}</div>` : ''}
    <h1>${accent(title)}</h1>
    ${meta ? `<div class="meta">${esc(meta)}</div>` : ''}
    ${status ? `<div class="status">${esc(status)}</div>` : ''}
  </div>
  <div class="foot"><span>kala.anushkakishor.in</span><span>Original, hand-painted</span></div>
</div></body></html>`;
}

/* ------------------------------------------------------------------ the cards */
const W = new Map(seo.works.map((w) => [w.id, w]));
const img = (id) => W.get(id)?.image;
const cards = {
  default: { images: [img('radhakrishna'), img('om'), img('peacock')], eyebrow: 'Paintings · mandalas · murals', title: 'Colour, devotion & a *little chaos.*', meta: 'Hand-painted canvases, mandalas and murals by Anushka Kishor' },
  shop: { images: [img('krishna'), img('buddha'), img('peacock')], eyebrow: 'The shop', title: 'Paintings to take *home.*', meta: 'One-of-a-kind originals · free shipping in India' },
  collections: { images: [img('child'), img('radhakrishna'), img('om')], eyebrow: 'The Collector’s Index', title: 'Five chapters of *work.*', meta: 'Devotional · Mandala · Portraits · Murals · Small works' },
  archive: { images: [img('flute'), img('om'), img('elephant')], eyebrow: 'The archive', title: 'The *uncollectable* collection', meta: 'Sold paintings and walls that stay where they were painted' },
  walls: { images: [img('mural')], eyebrow: 'Wall murals', title: 'Your walls, painted *by hand.*', meta: 'Homes · offices · cafés · schools · studios' },
  artist: { images: ['artist-with-peacock.webp'], eyebrow: 'The artist', title: 'Hello, I’m *Anushka Kishor.*', meta: 'Painter, mural artist and maker of wearable art' },
  commission: { images: ['child-sketch.webp', 'jacket-butterfly-back.webp'], eyebrow: 'Commissions', title: 'Begin with an *idea.*', meta: 'Paintings · portraits · murals · painted wearables' },
  contact: { images: ['artist-cobalt-wall.webp'], eyebrow: 'Contact', title: 'Say *hello.*', meta: 'Questions, commissions and collaborations' },
  order: { images: [img('peacock'), img('krishna'), img('buddha')], eyebrow: 'Order an original', title: 'Choose a *work.*', meta: 'Pay with UPI, card or netbanking · free shipping in India' },
  track: { images: ['escape-key-easel.webp'], eyebrow: 'Your order', title: 'Where is my *painting?*', meta: 'Track it with your order reference and email' },
};
for (const c of seo.collections) {
  const ids = [c.lead, ...seo.works.filter((w) => w.collection === c.id && w.id !== c.lead).map((w) => w.id)];
  const n = seo.works.filter((w) => w.collection === c.id).length;
  const images = c.id === 'murals' ? [img(c.lead)] : ids.slice(0, 3).map(img);
  cards[`collection-${c.id}`] = { images, eyebrow: `Chapter ${c.num}`, title: c.title, meta: `${n} ${n === 1 ? 'work' : 'works'} by Anushka Kishor` };
}
for (const w of seo.works) {
  const coll = seo.collections.find((c) => c.id === w.collection);
  const facts = [w.medium, seo.isPlaceholder(w.size) ? '' : w.size, w.year].filter(Boolean).join(' · ');
  cards[w.id] = { images: [w.image], eyebrow: `Pl. ${w.plate}${coll ? ` · ${coll.title}` : ''}`, title: w.title, meta: facts, status: seo.statusLine(w) };
}

/* ------------------------------------------------------------------ render */
const only = process.argv.slice(2);
const keys = Object.keys(cards).filter((k) => !only.length || only.includes(k));
mkdirSync(OUT, { recursive: true });
const tmp = mkdtempSync(join(tmpdir(), 'kala-og-'));

try {
  for (const key of keys) {
    const card = cards[key];
    const missing = card.images.filter((i) => !i || !existsSync(join(IMAGES, i)));
    if (missing.length) {
      console.warn(`[og] ${key}: missing image(s), skipped`);
      continue;
    }
    const html = join(tmp, `${key}.html`);
    const png = join(tmp, `${key}.png`);
    writeFileSync(html, cardHtml(card));
    execFileSync(EDGE, [
      '--headless=new',
      '--disable-gpu',
      '--hide-scrollbars',
      '--force-device-scale-factor=1',
      '--allow-file-access-from-files',
      '--virtual-time-budget=6000',
      '--window-size=1200,630',
      `--user-data-dir=${join(tmp, 'profile')}`,
      `--screenshot=${png}`,
      pathToFileURL(html).href,
    ], { stdio: 'ignore' });
    await sharp(png).resize(1200, 630, { fit: 'cover', position: 'left top' }).jpeg({ quality: 84, mozjpeg: true }).toFile(join(OUT, `${key}.jpg`));
    console.log(`[og] ${key}.jpg`);
  }

  /* ---------------------------------------------------------------- icons (only on a full run) */
  if (!only.length) {
    const petals = (stroke, sw) =>
      `<g fill="none" stroke="${stroke}" stroke-width="${sw}"><circle r="46"/>${[0, 45, 90, 135, 180, 225, 270, 315]
        .map((r) => `<path d="M0,-44 C9,-36 9,-26 0,-19 C-9,-26 -9,-36 0,-44Z" transform="rotate(${r})"/>`)
        .join('')}</g><circle r="9" fill="#C9531F"/>`;
    const fav = readFileSync(join(ROOT, 'public', 'favicon.svg'));
    /* full-bleed square (iOS and Android round the corners themselves), mark inside the safe zone */
    const square = (scale) =>
      Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="-60 -60 120 120"><rect x="-60" y="-60" width="120" height="120" fill="#22211F"/><g transform="scale(${scale})">${petals('#C9B79C', 3)}</g></svg>`);
    const icons = [
      ['favicon-32.png', fav, 32],
      ['icon-192.png', fav, 192],
      ['icon-512.png', fav, 512],
      ['apple-touch-icon.png', square(0.86), 180],
      ['icon-maskable-512.png', square(0.72), 512],
    ];
    for (const [name, svg, size] of icons) {
      await sharp(svg, { density: 72 * Math.ceil(size / 120) * 2 }).resize(size, size).png().toFile(join(ROOT, 'public', name));
      console.log(`[og] ${name}`);
    }
  }
} finally {
  rmSync(tmp, { recursive: true, force: true });
}
