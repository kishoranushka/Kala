/* Converts every JPG/PNG in src/assets/images to a web-sized WebP (long edge <= 1400px, ~2x the largest card).
   Run after adding new photos:  node scripts/optimize-images.mjs
   Then point the import in src/data/works.js at the .webp file and delete the original. */
import { readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const DIR = path.resolve('src/assets/images');
const MAX = 1400;

for (const name of await readdir(DIR)) {
  if (!/\.(jpe?g|png)$/i.test(name)) continue;
  const src = path.join(DIR, name);
  const out = path.join(DIR, name.replace(/\.(jpe?g|png)$/i, '.webp'));
  await sharp(src)
    .rotate()
    .resize({ width: MAX, height: MAX, fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 72, effort: 6 })
    .toFile(out);
  const [a, b] = await Promise.all([stat(src), stat(out)]);
  console.log(`${name.padEnd(32)} ${(a.size / 1024).toFixed(0).padStart(5)} KB -> ${(b.size / 1024).toFixed(0).padStart(4)} KB`);
}
