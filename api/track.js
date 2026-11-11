/* GET /api/track?id=KALA-…&email=… — order status for the "Track your order" page.
   No login: the order reference and the email used to order must both match. */
import { json, query } from './_lib/http.js';
import { dbConfigured, getOrder } from './_lib/db.js';
import { configured as shiprocketConfigured, trackShipment } from './_lib/shiprocket.js';

const NOT_FOUND = 'No order matches that reference and email. Check both, they’re in your confirmation.';

export default async function handler(req, res) {
  if (req.method !== 'GET') return json(res, 405, { error: 'Method not allowed' });
  if (!dbConfigured()) return json(res, 503, { error: 'Order tracking isn’t switched on yet. Please write to me.' });

  const q = query(req);
  const id = String(q.get('id') || '').trim().toUpperCase();
  const email = String(q.get('email') || '').trim().toLowerCase();
  if (!/^KALA-[A-Z0-9]{4,20}$/.test(id) || !email) return json(res, 404, { error: NOT_FOUND });

  try {
    const order = await getOrder(id);
    if (!order || String(order.customer?.email).toLowerCase() !== email) return json(res, 404, { error: NOT_FOUND });

    let shipment = null;
    if (order.status === 'paid' && order.shiprocket?.shipmentId && shiprocketConfigured()) {
      shipment = await trackShipment(order.shiprocket.shipmentId).catch((err) => {
        console.warn('[api/track] shiprocket', err.message);
        return null;
      });
    }

    return json(
      res,
      200,
      {
        id: order.id,
        status: order.status,
        createdAt: order.created_at,
        paidAt: order.paid_at,
        works: order.works.map((w) => ({ id: w.id, title: w.title, price: w.price })),
        amount: order.amount / 100,
        city: order.customer?.city,
        shipment,
      },
      { 'Cache-Control': 'no-store' },
    );
  } catch (err) {
    console.error('[api/track]', err);
    return json(res, 502, { error: 'Tracking is unavailable right now. Please try again shortly.' });
  }
}
