/* One-time move of the paintings from src/data/works.json into Supabase (run after supabase/schema.sql):
     node scripts/catalog/migrate.mjs           collections + paintings → tables, their photos → Storage "paintings"
     node scripts/catalog/migrate.mjs --force   same, even if the tables already have paintings (overwrites them!)
   Safe to re-run for photos: files already in Storage are skipped. */
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { ROOT } from './env.mjs';

const { dbConfigured, readCatalog, upsertRows } = await import('../../api/_lib/db.js');
const { ensureBucket, fileExists, uploadFile } = await import('../../api/_lib/storage.js');

if (!dbConfigured()) {
  console.error('SUPABASE_URL / SUPABASE_SECRET_KEY missing (.env.local).');
  process.exit(1);
}

const data = JSON.parse(await readFile(join(ROOT, 'src/data/works.json'), 'utf8'));
const force = process.argv.includes('--force');

const current = await readCatalog();
if (current.works.length && !force) {
  console.log(`The database already has ${current.works.length} paintings: nothing changed. (--force overwrites them with works.json.)`);
} else {
  await upsertRows('collections', data.collections.map((c, i) => ({ id: c.id, position: i, data: c })));
  await upsertRows('works', data.works.map((w, i) => ({ id: w.id, position: i, data: w })));
  console.log(`Saved ${data.collections.length} collections and ${data.works.length} paintings.`);
}

if (await ensureBucket()) console.log('Made the public Storage bucket "paintings".');
const files = [...new Set(data.works.flatMap((w) => [w.image, w.room?.image]).filter(Boolean))];
let uploaded = 0;
for (const file of files) {
  if (await fileExists(file)) continue;
  const type = file.endsWith('.png') ? 'image/png' : /\.jpe?g$/.test(file) ? 'image/jpeg' : 'image/webp';
  await uploadFile(file, await readFile(join(ROOT, 'src/assets/images', file)), type);
  uploaded++;
  process.stdout.write('.');
}
console.log(`\nPhotos: ${uploaded} uploaded, ${files.length - uploaded} already there.`);
