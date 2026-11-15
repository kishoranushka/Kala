/* First step of `npm run build`: take the catalogue from the database (the admin panel's source of truth)
   and bake it into the build:
   - src/data/works.json  ← collections + paintings (a snapshot; the site also re-reads /api/catalog on load)
   - src/assets/images/   ← any painting photo uploaded in the admin panel that isn't there yet,
                            so photos are served from Vercel like the rest, not from Supabase
   If the database isn't configured or can't be reached, the committed works.json is used as it is. */
import { access, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { ROOT } from './env.mjs';

const { dbConfigured, readCatalog } = await import('../../api/_lib/db.js');
const { storageBase } = await import('../../api/_lib/storage.js');

const FILE = join(ROOT, 'src/data/works.json');
const IMAGES = join(ROOT, 'src/assets/images');
const exists = (p) => access(p).then(() => true, () => false);

/* Postgres jsonb stores keys in its own order; put them back in the order the committed works.json uses
   (first appearance, any depth; new keys after, A–Z) so a build only changes lines that really changed. */
function keyRanks(text) {
  const lists = new Map([['', ['storage', 'collections', 'works']]]); // path → keys in order
  const walk = (v, path) => {
    if (Array.isArray(v)) return v.forEach((x) => walk(x, path + '[]'));
    if (!v || typeof v !== 'object') return;
    if (!lists.has(path)) lists.set(path, []);
    const list = lists.get(path);
    let prev = -1;
    for (const [k, x] of Object.entries(v)) {
      let at = list.indexOf(k);
      if (at < 0) list.splice((at = prev + 1), 0, k); // a key not seen yet goes right after its neighbour
      prev = at;
      walk(x, `${path}.${k}`);
    }
  };
  try { walk(JSON.parse(text), ''); } catch {}
  return new Map([...lists].map(([p, l]) => [p, new Map(l.map((k, i) => [k, i]))]));
}
function inOrder(v, ranks, path = '') {
  if (Array.isArray(v)) return v.map((x) => inOrder(x, ranks, path + '[]'));
  if (!v || typeof v !== 'object') return v;
  const here = ranks.get(path);
  const rank = (k) => here?.get(k) ?? Infinity;
  const keys = Object.keys(v).sort((a, b) => rank(a) - rank(b) || a.localeCompare(b));
  return Object.fromEntries(keys.map((k) => [k, inOrder(v[k], ranks, `${path}.${k}`)]));
}

async function main() {
  if (!dbConfigured()) return console.log('[catalog] no database configured: building from the committed works.json');
  const { collections, works } = await readCatalog();
  if (!works.length || !collections.length) return console.warn('[catalog] the database has no paintings yet: building from the committed works.json');

  const storage = storageBase();
  let fetched = 0;
  for (const file of [...new Set(works.flatMap((w) => [w.image, w.room?.image]).filter(Boolean))]) {
    if (!/^[a-z0-9][a-z0-9._-]*\.(webp|jpe?g|png)$/i.test(file) || (await exists(join(IMAGES, file)))) continue;
    const res = await fetch(`${storage}/${encodeURIComponent(file)}`, { signal: AbortSignal.timeout(20000) });
    if (!res.ok) {
      console.warn(`[catalog] couldn't download ${file} (${res.status}); the site will load it from Storage`);
      continue;
    }
    await writeFile(join(IMAGES, file), Buffer.from(await res.arrayBuffer()));
    fetched++;
  }

  const before = await readFile(FILE, 'utf8').catch(() => '');
  const next = JSON.stringify(inOrder({ storage, collections, works }, keyRanks(before)), null, 2) + '\n';
  if (before !== next) await writeFile(FILE, next, 'utf8');
  console.log(`[catalog] ${works.length} paintings, ${collections.length} collections from the database${before !== next ? ' (works.json updated)' : ''}; ${fetched} new photo(s) downloaded`);
}

try {
  await main();
} catch (err) {
  console.warn(`[catalog] couldn't read the database (${err.message}): building from the committed works.json`);
}
