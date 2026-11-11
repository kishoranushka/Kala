/* Supabase (Postgres) over its REST API — no SDK needed. Server-side only.
   Env: SUPABASE_URL         (Project Settings → Data API → Project URL, e.g. https://abcd.supabase.co)
        SUPABASE_SECRET_KEY  (Project Settings → API Keys → a secret key "sb_secret_…",
                              or the legacy service_role key). Never expose it to the browser.
   Tables and functions: supabase/schema.sql */

const key = () => process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || '';
export const dbConfigured = () => Boolean(process.env.SUPABASE_URL && key());

async function rest(path, { method = 'GET', body, prefer } = {}) {
  const k = key();
  const res = await fetch(`${process.env.SUPABASE_URL.replace(/\/+$/, '')}/rest/v1${path}`, {
    method,
    headers: {
      apikey: k,
      ...(k.startsWith('eyJ') ? { Authorization: `Bearer ${k}` } : {}), // legacy JWT keys also go here
      'Content-Type': 'application/json',
      ...(prefer ? { Prefer: prefer } : {}),
    },
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
  });
  const text = await res.text();
  const out = text ? JSON.parse(text) : null;
  if (!res.ok) throw new Error(`Database: ${out?.message || out?.hint || res.status}`);
  return out;
}

const eq = (v) => `eq.${encodeURIComponent(v)}`;

export const insertOrder = (row) => rest('/orders', { method: 'POST', body: row, prefer: 'return=minimal' });

export async function getOrder(id) {
  const rows = await rest(`/orders?id=${eq(id)}&select=*`);
  return rows?.[0] ?? null;
}

export async function getOrderByRazorpay(razorpayOrderId) {
  const rows = await rest(`/orders?razorpay_order_id=${eq(razorpayOrderId)}&select=*`);
  return rows?.[0] ?? null;
}

/* update; with `ifStatus` (one status or a list) it only changes a row still in that status,
   and returns the updated row (or null) */
export async function updateOrder(id, patch, { ifStatus } = {}) {
  const guard = !ifStatus ? '' : Array.isArray(ifStatus) ? `&status=in.(${ifStatus.join(',')})` : `&status=${eq(ifStatus)}`;
  const rows = await rest(`/orders?id=${eq(id)}${guard}`, { method: 'PATCH', body: patch, prefer: 'return=representation' });
  return rows?.[0] ?? null;
}

export const holdWorks = (orderId, workIds, minutes = 20) => rest('/rpc/hold_works', { method: 'POST', body: { p_order: orderId, p_works: workIds, p_minutes: minutes } });

export const releaseHolds = (orderId) => rest(`/holds?order_id=${eq(orderId)}&sold=is.false`, { method: 'DELETE', prefer: 'return=minimal' });

export const sellWorks = (orderId) => rest('/rpc/sell_works', { method: 'POST', body: { p_order: orderId } });

/* paintings sold online, and paintings someone is paying for right now */
export async function liveHolds() {
  const now = new Date().toISOString();
  const rows = await rest(`/holds?select=work_id,sold,expires_at&or=(sold.is.true,expires_at.gt.${encodeURIComponent(`"${now}"`)})`);
  return {
    sold: rows.filter((r) => r.sold).map((r) => r.work_id),
    held: rows.filter((r) => !r.sold).map((r) => r.work_id),
  };
}
