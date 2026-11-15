/* GET /api/catalog — the live catalogue, read by the site before its first render (src/data/liveStatus.js).
   { collections, works, storage, sold, held }
   - collections/works: from the database (null when it can't be reached → the site keeps its built-in copy)
   - storage: public URL prefix of the photo bucket (for photos uploaded after the last build)
   - sold/held: paintings sold online / being paid for right now
   Cached at Vercel's edge for a few seconds, so a change in the admin panel shows within ~10 s. */
import { json } from './_lib/http.js';
import { dbConfigured, liveHolds } from './_lib/db.js';
import { getCatalog } from './_lib/catalog.js';
import { storageBase } from './_lib/storage.js';

const publicWork = ({ ship, ...w }) => w; // the parcel size is only for Shiprocket

export default async function handler(req, res) {
  if (req.method !== 'GET') return json(res, 405, { error: 'Method not allowed' });
  const out = { collections: null, works: null, storage: storageBase(), sold: [], held: [] };
  if (dbConfigured()) {
    const [catalog, holds] = await Promise.allSettled([getCatalog(), liveHolds()]);
    if (catalog.status === 'fulfilled' && catalog.value.source === 'db') {
      out.collections = catalog.value.collections;
      out.works = catalog.value.works.map(publicWork);
    }
    if (holds.status === 'fulfilled') Object.assign(out, holds.value);
    else console.error('[api/catalog] holds', holds.reason);
  }
  return json(res, 200, out, { 'Cache-Control': 'public, s-maxage=5, stale-while-revalidate=30' });
}
