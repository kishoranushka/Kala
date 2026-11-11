/* GET /api/availability — paintings sold online (and ones being paid for right now).
   The site marks these Sold on load, so a painting bought online disappears from sale without a redeploy. */
import { json } from './_lib/http.js';
import { dbConfigured, liveHolds } from './_lib/db.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') return json(res, 405, { error: 'Method not allowed' });
  if (!dbConfigured()) return json(res, 200, { sold: [], held: [] });
  try {
    return json(res, 200, await liveHolds(), { 'Cache-Control': 'public, s-maxage=15, stale-while-revalidate=60' });
  } catch (err) {
    console.error('[api/availability]', err);
    return json(res, 200, { sold: [], held: [] });
  }
}
