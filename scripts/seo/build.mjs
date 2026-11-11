/* Post-build SEO step (runs after `vite build`, see package.json):
   - dist/<route>.html for every page, collection and painting, each with its own <title>,
     description, canonical, Open Graph / Twitter card, robots and JSON-LD, plus the page's text
     in #seo-static so crawlers that don't run JavaScript (most AI crawlers) can read it;
   - dist/sitemap.xml (with image entries), dist/llms.txt and dist/llms-full.txt.
   Everything comes from src/data/works.json + src/seo/copy.json through src/seo/meta.js. */

import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadEnv } from 'vite';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');

/* the sale switch (VITE_SALE_*, see src/data/sale.js) from .env / .env.local, like `vite build` sees it.
   Set before meta.js loads, since sale.js reads it once. Vercel's own env wins. */
for (const [k, v] of Object.entries(loadEnv('production', ROOT, 'VITE_SALE_'))) if (process.env[k] === undefined) process.env[k] = v;
const { createSeo } = await import('../../src/seo/meta.js');
const { POLICIES, UPDATED } = await import('../../src/data/policies.js');
const DIST = join(ROOT, 'dist');
const readJson = (p) => JSON.parse(readFileSync(join(ROOT, p), 'utf8'));

const data = readJson('src/data/works.json');
const copy = readJson('src/seo/copy.json');

/* built (hashed) URL of each source image: dist/assets/<name>-<hash>.webp */
const assets = readdirSync(join(DIST, 'assets'));
const imageUrl = (file) => {
  if (!file) return null;
  const dot = file.lastIndexOf('.');
  const name = file.slice(0, dot).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const re = new RegExp(`^${name}-[A-Za-z0-9_-]{8}\\${file.slice(dot)}$`);
  const hit = assets.find((a) => re.test(a));
  return hit ? `/assets/${hit}` : null;
};
const ogImage = (key) => (existsSync(join(ROOT, 'public', 'og', `${key}.jpg`)) ? `/og/${key}.jpg` : null);

const seo = createSeo({ data, copy, imageUrl, ogImage });
const { site: S, abs } = seo;

const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const jsonForScript = (o) => JSON.stringify(o).replace(/</g, '\\u003c');

function head(m) {
  const tags = [
    `<title>${esc(m.title)}</title>`,
    `<meta name="description" content="${esc(m.description)}" />`,
    `<meta name="robots" content="${m.robots}" />`,
    `<link rel="canonical" href="${m.canonical}" />`,
    `<meta property="og:type" content="${m.ogType}" />`,
    `<meta property="og:url" content="${m.canonical}" />`,
    `<meta property="og:title" content="${esc(m.title)}" />`,
    `<meta property="og:description" content="${esc(m.description)}" />`,
    `<meta property="og:image" content="${m.image}" />`,
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
    `<meta property="og:image:alt" content="${esc(m.imageAlt)}" />`,
    `<meta name="twitter:title" content="${esc(m.title)}" />`,
    `<meta name="twitter:description" content="${esc(m.description)}" />`,
    `<meta name="twitter:image" content="${m.image}" />`,
    `<meta name="twitter:image:alt" content="${esc(m.imageAlt)}" />`,
  ];
  if (m.product) {
    tags.push(
      `<meta property="product:price:amount" content="${m.product.price}" />`,
      `<meta property="product:price:currency" content="${m.product.currency}" />`,
      `<meta property="product:availability" content="${m.product.availability}" />`
    );
  }
  tags.push(`<script type="application/ld+json" id="seo-jsonld">${jsonForScript(m.jsonLd)}</script>`);
  return tags.join('\n    ');
}

const NAV = [
  ['/', 'Home'],
  ['/shop', 'Shop'],
  ['/collections', 'Collections'],
  ['/commission', 'Commission'],
  ['/walls', 'Wall murals'],
  ['/archive', 'Archive'],
  ['/artist', 'The Artist'],
  ['/contact', 'Contact'],
];

/* the full text of a policy page (src/data/policies.js), so it reads without JavaScript */
const richHtml = (s) => esc(s).replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, text, href) => `<a href="${href}">${text}</a>`);
function policyHtml(p) {
  const block = (b) => (typeof b === 'string' ? `<p>${richHtml(b)}</p>` : `<ul>${b.list.map((li) => `<li>${richHtml(li)}</li>`).join('')}</ul>`);
  return [
    `<p>${esc(p.lead)}</p>`,
    `<p>Last updated ${esc(UPDATED)}</p>`,
    `<ul>${p.summary.map((s) => `<li>${esc(s)}</li>`).join('')}</ul>`,
    ...p.sections.map((s) => `<h2 id="${s.id}">${esc(s.title)}</h2>${s.body.map(block).join('')}`),
  ].join('');
}

function body(m) {
  const art = m.path.match(/^\/artwork\/([^/]+)$/);
  const w = art && seo.works.find((x) => x.id === art[1]);
  const img = w && imageUrl(w.image);
  const out = [
    `<div id="seo-static">`,
    `<header><a href="/">${esc(S.brand)}</a><nav aria-label="Main">${NAV.map(([h, t]) => `<a href="${h}">${esc(t)}</a>`).join(' · ')}</nav></header>`,
    `<main>`,
    `<h1>${esc(m.h1)}</h1>`,
  ];
  if (img) out.push(`<img src="${img}" alt="${esc(w.alt)}" width="${w.w}" height="${w.h}" />`);
  if (!w) out.push(`<p>${esc(m.description)}</p>`);
  m.intro.forEach((p) => out.push(`<p>${esc(p)}</p>`));
  const policy = POLICIES[m.path];
  if (policy) out.push(policyHtml(policy));
  if (m.facts?.length) out.push(`<dl>${m.facts.map(([k, v]) => `<dt>${esc(k)}</dt><dd>${esc(v)}</dd>`).join('')}</dl>`);
  if (m.links.length) {
    out.push(`<ul>${m.links.map((l) => `<li><a href="${esc(l.href)}">${esc(l.text)}</a>${l.note ? ` — ${esc(l.note)}` : ''}</li>`).join('')}</ul>`);
  }
  out.push(`</main>`, `<footer><p>${esc(S.brand)} · <a href="mailto:${S.email}">${S.email}</a> · ${S.sameAs.map((u) => `<a href="${u}">${esc(u.replace(/^https:\/\/(www\.)?/, ''))}</a>`).join(' · ')}</p></footer>`, `</div>`);
  return out.join('');
}

/* ------------------------------------------------------------------ pages */
const template = readFileSync(join(DIST, 'index.html'), 'utf8');
if (!template.includes('<!--seo:head-->') || !template.includes('<!--seo:body-->')) {
  throw new Error('[seo] dist/index.html is missing the <!--seo:head--> / <!--seo:body--> markers');
}
const render = (m) =>
  template.replace(/<!--seo:head-->[\s\S]*?<!--\/seo:head-->/, head(m)).replace('<!--seo:body-->', body(m));

const paths = seo.paths();
for (const path of paths) {
  const m = seo.meta(path);
  /* /shop → dist/shop.html, served at /shop by Vercel's cleanUrls (and by vite preview) */
  const file = path === '/' ? join(DIST, 'index.html') : `${join(DIST, ...path.slice(1).split('/'))}.html`;
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, render(m));
}

/* ------------------------------------------------------------------ sitemap */
const indexable = paths.map((p) => seo.meta(p)).filter((m) => !m.noindex);
const priority = (p) => (p === '/' ? '1.0' : p === '/shop' ? '0.9' : p.startsWith('/artwork/') ? '0.8' : p.startsWith('/collections') ? '0.7' : POLICIES[p] ? '0.3' : '0.6');
const sitemap = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">',
  ...indexable.map((m) => {
    const art = m.path.match(/^\/artwork\/([^/]+)$/);
    const w = art && seo.works.find((x) => x.id === art[1]);
    const imgs = w ? [imageUrl(w.image), w.room?.image ? imageUrl(w.room.image) : null].filter(Boolean) : [];
    return [
      '  <url>',
      `    <loc>${m.canonical}</loc>`,
      `    <changefreq>${m.path.startsWith('/artwork/') ? 'monthly' : 'weekly'}</changefreq>`,
      `    <priority>${priority(m.path)}</priority>`,
      ...imgs.map((u) => `    <image:image><image:loc>${abs(u)}</image:loc></image:image>`),
      '  </url>',
    ].join('\n');
  }),
  '</urlset>',
  '',
].join('\n');
writeFileSync(join(DIST, 'sitemap.xml'), sitemap);

/* ------------------------------------------------------------------ llms.txt */
const url = (p) => abs(p);
const factsOf = (w) => [w.medium, seo.isPlaceholder(w.size) ? '' : w.size, w.year].filter(Boolean).join(', ');
const buyable = seo.works.filter(seo.isBuyable);
const others = seo.works.filter((w) => !seo.isBuyable(w));

const llms = [
  `# ${S.brand}`,
  '',
  `> ${S.summary} Original paintings can be bought online and ship free within India; paintings, portraits, wall murals and wearables can be commissioned by enquiry.`,
  '',
  'Key facts:',
  `- Artist: ${S.artist}, India-based painter and mural artist. Instagram ${S.sameAs[0]} · YouTube ${S.sameAs[1]}`,
  '- Every painting is a one-of-a-kind original (no prints). Each painting page shows medium, size, year, framing and status: available, inquiry only, sold or archived.',
  '- Buying: add works to the cart and pay online on the order page (UPI, card or netbanking via Razorpay). Shipping is free and India-only; for orders from abroad, use the contact page.',
  `- Commissions: custom paintings, portraits, hand-painted wall murals (homes, offices, cafés, schools) and painted wearables (t-shirts, jackets, shoes). Contact: ${S.email}`,
  '- Orders can be tracked at /track with the order reference and email.',
  '',
  '## Main pages',
  '',
  ...['/shop', '/collections', '/commission', '/walls', '/artist', '/archive', '/contact'].map((p) => {
    const m = seo.meta(p);
    return `- [${m.shortTitle}](${url(p)}): ${m.description}`;
  }),
  '',
  '## Collections',
  '',
  ...seo.collections.map((c) => `- [${c.title}](${url(`/collections/${c.id}`)}): ${copy.collections?.[c.id]?.description ?? ''}`),
  '',
  '## Paintings available to buy online',
  '',
  ...buyable.map((w) => `- [${w.title}](${url(`/artwork/${w.id}`)}): ${factsOf(w)}. ${seo.priceText(w)}, free shipping in India. ${w.alt}.`),
  '',
  '## Other works (enquire, sold or archived)',
  '',
  ...others.map((w) => `- [${w.title}](${url(`/artwork/${w.id}`)}): ${factsOf(w)}. ${seo.statusLine(w)}.`),
  '',
  '## Optional',
  '',
  `- [Full catalogue for LLMs](${url('/llms-full.txt')}): every work with all its details in one file`,
  `- [Sitemap](${url('/sitemap.xml')})`,
  '',
].join('\n');
writeFileSync(join(DIST, 'llms.txt'), llms);

const full = [
  `# ${S.brand}: full catalogue`,
  '',
  `> ${S.summary}`,
  '',
  `Website: ${S.url} · Email: ${S.email} · Instagram: ${S.sameAs[0]} · YouTube: ${S.sameAs[1]}`,
  '',
  '## How buying works',
  '',
  '- Each painting is a single original; once sold it moves to the archive.',
  '- Works marked "Available" with a price can be bought online at /order: pay with UPI, card or netbanking (Razorpay). Works are held for you for 20 minutes during checkout.',
  '- Shipping is free within India; the artist packs every painting. Orders from outside India: use the contact page.',
  '- "Inquiry only" works: write via /commission or /contact. Sold and archived works can inspire a commission in the same spirit.',
  '- Track an order at /track with the order reference and the email used.',
  '',
  '## Commissions',
  '',
  '- Custom paintings for a room, portraits of people you love, hand-painted wall murals for homes, offices, cafés, schools and studios, and painted wearables (t-shirts, jackets, shoes).',
  `- Start at ${url('/commission')} (or ${url('/walls')} for murals).`,
  '',
  ...seo.collections.flatMap((c) => [
    `## ${c.num}. ${c.title}`,
    '',
    copy.collections?.[c.id]?.description ?? '',
    `URL: ${url(`/collections/${c.id}`)}`,
    '',
    ...seo.works
      .filter((w) => w.collection === c.id)
      .flatMap((w) => {
        const img = imageUrl(w.image);
        return [
          `### ${w.title}`,
          '',
          `- URL: ${url(`/artwork/${w.id}`)}`,
          `- Plate: ${w.plate}`,
          `- Medium: ${w.medium}`,
          seo.isPlaceholder(w.size) ? null : `- Size: ${w.size}`,
          w.year ? `- Year: ${w.year}` : null,
          w.framing ? `- ${w.status === 'archived' ? 'Site' : 'Framing'}: ${w.framing}` : null,
          `- Status: ${seo.statusLine(w)}`,
          img ? `- Image: ${abs(img)}` : null,
          `- Description: ${w.alt}.`,
          `- Summary: ${seo.workCopy(w).description}`,
          '',
        ].filter((l) => l !== null);
      }),
  ]),
].join('\n');
writeFileSync(join(DIST, 'llms-full.txt'), full);

console.log(`[seo] ${paths.length} pages pre-rendered, sitemap (${indexable.length} urls), llms.txt, llms-full.txt`);
const missingOg = paths.map((p) => seo.meta(p)).filter((m) => m.image.endsWith('/og/default.jpg') && !['/', '/track'].includes(m.path) && !POLICIES[m.path]);
if (missingOg.length) console.warn(`[seo] no social card yet for ${missingOg.map((m) => m.path).join(', ')} — run: npm run og`);
