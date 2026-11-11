/* Local-only painting editor for KALA.
   Vite plugin with `apply: 'serve'`: it exists only while `npm run dev` runs and is never part of `vite build`,
   so nothing here reaches the live site. Open http://localhost:5173/__admin

   Endpoints (all under /__admin):
     GET  /              the editor page (scripts/admin/index.html)
     GET  /api/data      { collections, works, images }
     POST /api/works     body { works } → validates and rewrites src/data/works.json
     POST /api/upload    raw image bytes (?name=slug) → web-sized WebP in src/assets/images, returns { file, w, h } */
import { readFile, readdir, writeFile, access } from 'node:fs/promises';
import path from 'node:path';

const ROOT = process.cwd();
const DATA_FILE = path.join(ROOT, 'src/data/works.json');
const IMAGE_DIR = path.join(ROOT, 'src/assets/images');
const PAGE = path.join(ROOT, 'scripts/admin/index.html');
const STATUSES = ['available', 'inquiry', 'sold', 'archived'];
const MAX_EDGE = 1400;
const MAX_UPLOAD = 40 * 1024 * 1024;

const exists = (p) => access(p).then(() => true, () => false);
const readData = async () => JSON.parse(await readFile(DATA_FILE, 'utf8'));
const listImages = async () => (await readdir(IMAGE_DIR)).filter((f) => /\.(webp|jpe?g|png)$/i.test(f)).sort();

function send(res, status, body) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(body));
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let size = 0;
    req.on('data', (c) => {
      size += c.length;
      if (size > MAX_UPLOAD) {
        reject(new Error('File is too large (40 MB max).'));
        req.destroy();
      } else chunks.push(c);
    });
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}

/* source files (outside the data) that mention a painting id, e.g. getWork('mural') */
async function usagesOf(id) {
  const hits = [];
  const walk = async (dir) => {
    for (const entry of await readdir(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) await walk(full);
      else if (/\.(jsx?|tsx?)$/.test(entry.name) && !full.endsWith(path.join('data', 'works.js'))) {
        const text = await readFile(full, 'utf8');
        if (text.includes(`'${id}'`) || text.includes(`"${id}"`)) hits.push(path.relative(ROOT, full).replaceAll('\\', '/'));
      }
    }
  };
  await walk(path.join(ROOT, 'src'));
  return hits;
}

/* the request comes from a page on this dev server, on this machine */
function sameOrigin(req) {
  const host = String(req.headers.host || '');
  const origin = req.headers.origin;
  if (!/^(localhost|127\.0\.0\.1|\[::1\])(:\d+)?$/i.test(host)) return false;
  if (req.headers['sec-fetch-site'] && req.headers['sec-fetch-site'] !== 'same-origin') return false;
  if (!origin) return false;
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

const FIELD_ORDER = ['id', 'plate', 'title', 'collection', 'status', 'price', 'medium', 'size', 'year', 'framing', 'archiveNo', 'image', 'w', 'h', 'crop', 'room', 'ship', 'alt', 'note', 'details'];

function clean(work) {
  const w = { ...work };
  for (const k of ['archiveNo']) if (!w[k]) delete w[k];
  if (!w.crop) delete w.crop;
  if (!w.room?.image) delete w.room;
  if (w.ship) {
    const ship = Object.fromEntries(['weight', 'length', 'breadth', 'height'].filter((k) => Number(w.ship[k]) > 0).map((k) => [k, Number(w.ship[k])]));
    if (Object.keys(ship).length) w.ship = ship;
    else delete w.ship;
  }
  w.w = Number(w.w);
  w.h = Number(w.h);
  if (Array.isArray(w.details)) w.details = w.details.filter((d) => d.label && d.origin).map((d) => ({ label: d.label, origin: d.origin, scale: Number(d.scale) || 2 }));
  return Object.fromEntries([...FIELD_ORDER.filter((k) => w[k] !== undefined), ...Object.keys(w).filter((k) => !FIELD_ORDER.includes(k))].map((k) => [k, w[k]]));
}

async function validate(works, data) {
  const problems = [];
  const images = new Set(await listImages());
  const collections = new Set(data.collections.map((c) => c.id));
  const seen = new Set();
  works.forEach((w, i) => {
    const name = w.title || `Painting #${i + 1}`;
    if (!/^[a-z0-9-]+$/.test(w.id || '')) problems.push(`${name}: the ID must be lowercase letters, numbers or dashes.`);
    else if (seen.has(w.id)) problems.push(`${name}: another painting already uses the ID “${w.id}”.`);
    seen.add(w.id);
    if (!w.title?.trim()) problems.push(`Painting #${i + 1}: add a title.`);
    if (!STATUSES.includes(w.status)) problems.push(`${name}: choose a status.`);
    if (!collections.has(w.collection)) problems.push(`${name}: choose a collection.`);
    if (!images.has(w.image)) problems.push(`${name}: add the painting’s photo.`);
    if (!(w.w > 0 && w.h > 0)) problems.push(`${name}: the photo’s width and height are missing.`);
    if (w.room?.image && !images.has(w.room.image)) problems.push(`${name}: the second photo is missing from src/assets/images.`);
  });
  const removed = data.works.filter((old) => !seen.has(old.id));
  for (const old of removed) {
    const used = await usagesOf(old.id);
    if (used.length) problems.push(`“${old.title}” can’t be removed: the site shows it by name in ${used.join(', ')}. Mark it Sold or Archived instead.`);
  }
  for (const c of data.collections) if (!seen.has(c.lead)) problems.push(`“${c.lead}” leads the ${c.title} collection, so it can’t be removed.`);
  return problems;
}

async function uploadImage(req, res, url) {
  const slug = (url.searchParams.get('name') || 'painting').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'painting';
  const buf = await readBody(req);
  if (!buf.length) return send(res, 400, { error: 'No file received.' });
  let file = `${slug}.webp`;
  for (let n = 2; await exists(path.join(IMAGE_DIR, file)); n++) file = `${slug}-${n}.webp`;
  const { default: sharp } = await import('sharp');
  const info = await sharp(buf)
    .rotate()
    .resize({ width: MAX_EDGE, height: MAX_EDGE, fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 72, effort: 6 })
    .toFile(path.join(IMAGE_DIR, file));
  send(res, 200, { file, w: info.width, h: info.height });
}

export default function worksAdmin() {
  return {
    name: 'kala-works-admin',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use('/__admin', async (req, res) => {
        const url = new URL(req.url, 'http://local');
        /* Only the editor itself may change files. Without this, any website open in the browser while
           `npm run dev` runs could POST here (CSRF) and rewrite works.json, e.g. the prices. */
        if (req.method !== 'GET' && !sameOrigin(req)) return send(res, 403, { error: 'Requests must come from the editor page.' });
        try {
          if (req.method === 'GET' && (url.pathname === '/' || url.pathname === '')) {
            res.setHeader('Content-Type', 'text/html; charset=utf-8');
            return res.end(await readFile(PAGE, 'utf8'));
          }
          if (req.method === 'GET' && url.pathname === '/api/data') {
            const data = await readData();
            return send(res, 200, { ...data, images: await listImages() });
          }
          if (req.method === 'POST' && url.pathname === '/api/works') {
            if (!String(req.headers['content-type']).startsWith('application/json')) return send(res, 415, { error: 'Expected JSON.' });
            const { works } = JSON.parse((await readBody(req)).toString('utf8'));
            if (!Array.isArray(works)) return send(res, 400, { error: 'Expected a list of paintings.' });
            const data = await readData();
            const cleaned = works.map(clean);
            const problems = await validate(cleaned, data);
            if (problems.length) return send(res, 422, { error: 'Not saved', problems });
            await writeFile(DATA_FILE, JSON.stringify({ ...data, works: cleaned }, null, 2) + '\n', 'utf8');
            return send(res, 200, { ok: true, works: cleaned });
          }
          if (req.method === 'POST' && url.pathname === '/api/upload') return await uploadImage(req, res, url);
          send(res, 404, { error: 'Not found' });
        } catch (err) {
          server.config.logger.error(`[works-admin] ${err.stack || err}`);
          send(res, 500, { error: err.message || String(err) });
        }
      });
      server.httpServer?.once('listening', () => {
        setTimeout(() => server.config.logger.info('  ➜  Painting editor: /__admin  (local only)'), 50);
      });
    },
  };
}
