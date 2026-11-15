/* /api/admin?a=<action> — the admin panel's server (page: /admin, source admin.html + src/admin/).
   Password login (env ADMIN_PASSWORD) → signed, HttpOnly session cookie (14 days).
     GET  session          { ok }            is this browser logged in?
     POST login            { password }      → sets the cookie (8 wrong tries / 15 min per visitor → 429)
     POST logout
     GET  data             { collections, works, storage, sold, held, pinned, rebuild }
     POST save             { work, isNew }   → saves one painting, rebuilds the site
     POST delete           { id }
     POST upload           raw JPEG/PNG/WebP (?name=slug) → WebP ≤1400px in Storage → { file, w, h, url }
     POST rebuild          start a site rebuild by hand
   Every POST needs the header `X-Kala-Admin: 1` (a cross-site form can't send it) and, when the
   browser sends an Origin, it must be this site. */
import { createHash, createHmac, randomBytes, timingSafeEqual } from 'node:crypto';
import { clientKey, json, query, readJson } from './_lib/http.js';
import {
  clearFailedLogins,
  dbConfigured,
  deleteWork,
  failedLogins,
  key as dbKey,
  liveHolds,
  nextWorkPosition,
  recordFailedLogin,
  updateWork,
  upsertRows,
  workExists,
  workHasOrders,
} from './_lib/db.js';
import { PINNED, cleanWork, forgetCatalog, getCatalog, problemsOf } from './_lib/catalog.js';
import { fileExists, isFileName, storageBase, uploadFile } from './_lib/storage.js';
import { rebuildConfigured, triggerRebuild } from './_lib/deploy.js';

const COOKIE = 'kala_admin';
const SESSION_DAYS = 14;
const MAX_UPLOAD = 4.4 * 1024 * 1024; // Vercel refuses request bodies over 4.5 MB
const MAX_EDGE = 1400;

const password = () => (process.env.ADMIN_PASSWORD || '').trim();
const secret = () => (process.env.ADMIN_SESSION_SECRET || '').trim() || createHash('sha256').update(`kala-admin|${password()}|${dbKey()}`).digest('hex');
const sign = (payload) => createHmac('sha256', secret()).update(payload).digest('base64url');

function safeEqual(a, b) {
  const x = createHash('sha256').update(String(a)).digest();
  const y = createHash('sha256').update(String(b)).digest();
  return timingSafeEqual(x, y);
}

/* ------------------------------------------------------------------ session cookie */
const cookies = (req) => Object.fromEntries(String(req.headers.cookie || '').split(/;\s*/).filter(Boolean).map((c) => [c.slice(0, c.indexOf('=')), c.slice(c.indexOf('=') + 1)]));
const isLocal = (req) => /^(localhost|127\.0\.0\.1|\[::1\])(:\d+)?$/i.test(String(req.headers.host || ''));

function loggedIn(req) {
  const token = cookies(req)[COOKIE];
  if (!token || !password()) return false;
  const [exp, sig] = token.split('.');
  if (!exp || !sig || Number(exp) < Date.now()) return false;
  return safeEqual(sig, sign(exp));
}

function setSession(req, res, on) {
  const exp = String(Date.now() + SESSION_DAYS * 864e5);
  const value = on ? `${exp}.${sign(exp)}` : '';
  const attrs = [`${COOKIE}=${value}`, 'Path=/api/admin', 'HttpOnly', 'SameSite=Strict', `Max-Age=${on ? SESSION_DAYS * 86400 : 0}`];
  if (!isLocal(req)) attrs.push('Secure');
  res.setHeader('Set-Cookie', attrs.join('; '));
}

/* the request comes from the admin page on this site */
function sameSite(req) {
  if (req.headers['x-kala-admin'] !== '1') return false;
  const origin = req.headers.origin;
  if (!origin) return true;
  try {
    const host = String(req.headers['x-forwarded-host'] || req.headers.host || '');
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

/* ------------------------------------------------------------------ login rate limit */
const memoryFails = new Map(); // when the database is down: per server instance
async function tooManyFails(client) {
  if (dbConfigured()) {
    try {
      const { mine, all } = await failedLogins({ client, minutes: 15 });
      return mine >= 8 || all >= 40;
    } catch {
      /* fall through to memory */
    }
  }
  const list = (memoryFails.get(client) || []).filter((t) => t > Date.now() - 15 * 60 * 1000);
  memoryFails.set(client, list);
  return list.length >= 8;
}
async function noteFail(client) {
  memoryFails.set(client, [...(memoryFails.get(client) || []), Date.now()]);
  if (dbConfigured()) await recordFailedLogin(client).catch(() => {});
}

async function login(req, res) {
  if (!password()) return json(res, 503, { error: 'The admin password isn’t set yet (ADMIN_PASSWORD in Vercel).' });
  const client = clientKey(req) || 'unknown';
  if (await tooManyFails(client)) return json(res, 429, { error: 'Too many wrong passwords. Wait 15 minutes and try again.' });
  const body = await readJson(req);
  if (typeof body.password !== 'string' || !safeEqual(body.password, password())) {
    await noteFail(client);
    await new Promise((r) => setTimeout(r, 600));
    return json(res, 401, { error: 'That password isn’t right.' });
  }
  if (dbConfigured()) await clearFailedLogins(client).catch(() => {});
  setSession(req, res, true);
  return json(res, 200, { ok: true });
}

/* ------------------------------------------------------------------ data */
async function catalogOrFail(res) {
  if (!dbConfigured()) {
    json(res, 503, { error: 'The database isn’t connected (SUPABASE_URL / SUPABASE_SECRET_KEY).' });
    return null;
  }
  const catalog = await getCatalog({ fresh: true });
  if (catalog.source !== 'db') {
    json(res, 503, { error: 'The paintings aren’t in the database yet (run scripts/catalog/migrate.mjs), or it can’t be reached right now.' });
    return null;
  }
  return catalog;
}

async function data(res) {
  const catalog = await catalogOrFail(res);
  if (!catalog) return;
  const holds = await liveHolds().catch(() => ({ sold: [], held: [] }));
  return json(res, 200, {
    collections: catalog.collections,
    works: catalog.works,
    storage: storageBase(),
    ...holds,
    pinned: [...new Set([...PINNED, ...catalog.collections.map((c) => c.lead)])],
    rebuild: rebuildConfigured(),
  });
}

async function save(req, res) {
  const body = await readJson(req);
  if (!body.work || typeof body.work !== 'object') return json(res, 400, { error: 'Nothing to save.' });
  const catalog = await catalogOrFail(res);
  if (!catalog) return;
  const work = cleanWork(body.work);
  const old = catalog.works.find((w) => w.id === work.id);
  if (body.isNew && (old || (await workExists(work.id)))) return json(res, 409, { error: `Another painting already uses the ID “${work.id}”. Change the ID.` });
  if (!body.isNew && !old) return json(res, 404, { error: 'This painting isn’t in the database any more. Reload the page.' });

  /* photos: unchanged ones are fine; new ones must be in Storage */
  const known = new Set([old?.image, old?.room?.image].filter(Boolean));
  const checked = new Map();
  for (const f of [work.image, work.room?.image].filter((f) => isFileName(f) && !known.has(f))) checked.set(f, await fileExists(f).catch(() => false));
  const isFile = (f) => isFileName(f) && (known.has(f) || checked.get(f) === true);

  const problems = problemsOf(work, { collections: catalog.collections, isFile });
  if (problems.length) return json(res, 422, { error: 'Not saved yet:', problems });

  if (body.isNew) await upsertRows('works', [{ id: work.id, position: await nextWorkPosition(), data: work }]);
  else await updateWork(work.id, work);
  forgetCatalog();
  const rebuilding = await triggerRebuild();
  return json(res, 200, { ok: true, work, rebuilding });
}

async function remove(req, res) {
  const { id } = await readJson(req);
  const catalog = await catalogOrFail(res);
  if (!catalog) return;
  const w = catalog.works.find((x) => x.id === id);
  if (!w) return json(res, 404, { error: 'That painting isn’t in the database.' });
  const lead = catalog.collections.find((c) => c.lead === id);
  if (lead) return json(res, 409, { error: `“${w.title}” is the cover of the ${lead.title} collection, so it can’t be deleted. Mark it Sold or Archived instead.` });
  if (PINNED.includes(id)) return json(res, 409, { error: `The site shows “${w.title}” by name (home page, walls or artist page), so it can’t be deleted. Mark it Sold or Archived instead.` });
  if (await workHasOrders(id)) return json(res, 409, { error: `“${w.title}” is part of an online order, so it can’t be deleted. Mark it Sold or Archived instead.` });
  await deleteWork(id);
  forgetCatalog();
  const rebuilding = await triggerRebuild();
  return json(res, 200, { ok: true, rebuilding });
}

async function readBuffer(req, max) {
  if (Buffer.isBuffer(req.body)) return req.body;
  const chunks = [];
  let size = 0;
  for await (const c of req) {
    size += c.length;
    if (size > max) throw Object.assign(new Error('The photo is too big to upload (4 MB max). Try again; the panel shrinks it first.'), { status: 413 });
    chunks.push(c);
  }
  return Buffer.concat(chunks);
}

async function upload(req, res) {
  if (!dbConfigured()) return json(res, 503, { error: 'The database isn’t connected.' });
  const slug =
    String(query(req).get('name') || 'painting')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
      .slice(0, 50) || 'painting';
  const buf = await readBuffer(req, MAX_UPLOAD);
  if (!buf.length) return json(res, 400, { error: 'No photo received.' });
  const { default: sharp } = await import('sharp');
  let out;
  try {
    out = await sharp(buf, { limitInputPixels: 60e6 })
      .rotate()
      .resize({ width: MAX_EDGE, height: MAX_EDGE, fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 78, effort: 5 })
      .toBuffer({ resolveWithObject: true });
  } catch {
    return json(res, 415, { error: 'That file isn’t a photo the panel can read. Use a JPEG, PNG or WebP.' });
  }
  const file = `${slug}-${randomBytes(3).toString('hex')}.webp`;
  await uploadFile(file, out.data, 'image/webp');
  return json(res, 200, { file, w: out.info.width, h: out.info.height, url: `${storageBase()}/${file}` });
}

/* ------------------------------------------------------------------ router */
export default async function handler(req, res) {
  const action = query(req).get('a') || '';
  try {
    if (req.method === 'GET' && action === 'session') return json(res, 200, { ok: loggedIn(req), configured: Boolean(password()) });
    if (req.method !== 'GET' && !sameSite(req)) return json(res, 403, { error: 'Requests must come from the admin page.' });
    if (req.method === 'POST' && action === 'login') return await login(req, res);
    if (req.method === 'POST' && action === 'logout') {
      setSession(req, res, false);
      return json(res, 200, { ok: true });
    }
    if (!loggedIn(req)) return json(res, 401, { error: 'Please log in again.', login: true });
    if (req.method === 'GET' && action === 'data') return await data(res);
    if (req.method === 'POST' && action === 'save') return await save(req, res);
    if (req.method === 'POST' && action === 'delete') return await remove(req, res);
    if (req.method === 'POST' && action === 'upload') return await upload(req, res);
    if (req.method === 'POST' && action === 'rebuild') return json(res, 200, { rebuilding: await triggerRebuild() });
    return json(res, 404, { error: 'Unknown action.' });
  } catch (err) {
    console.error('[api/admin]', action, err);
    return json(res, err.status || 500, { error: err.status ? err.message : `Something went wrong: ${err.message}` });
  }
}
