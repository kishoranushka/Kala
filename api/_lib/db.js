/* Supabase (Postgres) over its REST API — no SDK needed. Server-side only.
   Env: SUPABASE_URL         (Project Settings → Data API → Project URL, e.g. https://abcd.supabase.co)
        SUPABASE_SECRET_KEY  (Project Settings → API Keys → a secret key "sb_secret_…",
                              or the legacy service_role key). Never expose it to the browser.
   Tables and functions: supabase/schema.sql */
import { timedFetch } from './http.js';

const env = (name) => (process.env[name] || '').trim();
export const key = () => env('SUPABASE_SECRET_KEY') || env('SUPABASE_SERVICE_ROLE_KEY');
export const base = () => env('SUPABASE_URL').replace(/\/+$/, '');
/* headers that authorise the server with the secret key (REST and Storage) */
export const authHeaders = () => {
  const k = key();
  return { apikey: k, ...(k.startsWith('eyJ') ? { Authorization: `Bearer ${k}` } : {}) };
};
export const dbConfigured = () => Boolean(base() && key());

async function rest(path, { method = 'GET', body, prefer } = {}) {
  const k = key();
  const res = await timedFetch(`${base()}/rest/v1${path}`, {
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
  let out = null;
  try {
    out = text ? JSON.parse(text) : null;
  } catch {
    /* an HTML error page from a proxy: keep the status */
  }
  if (!res.ok) throw new Error(`Database: ${out?.message || out?.hint || res.status}`);
  return out;
}

const eq = (v) => `eq.${encodeURIComponent(v)}`;
/* PostgREST list value: in.("a","b") with each item quoted */
const inList = (values) => `in.(${values.map((v) => `"${encodeURIComponent(String(v).replace(/["\\]/g, ''))}"`).join(',')})`;

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
  const guard = !ifStatus ? '' : Array.isArray(ifStatus) ? `&status=${inList(ifStatus)}` : `&status=${eq(ifStatus)}`;
  const rows = await rest(`/orders?id=${eq(id)}${guard}`, { method: 'PATCH', body: patch, prefer: 'return=representation' });
  return rows?.[0] ?? null;
}

/* how many checkouts were started recently by this visitor (hashed IP) or this email */
export async function recentCheckouts({ client, email, minutes }) {
  const since = new Date(Date.now() - minutes * 60 * 1000).toISOString();
  const filters = [client && `customer->>client.eq.${client}`, email && `customer->>email.eq.${encodeURIComponent(`"${String(email).replace(/["\\]/g, '')}"`)}`].filter(Boolean);
  if (!filters.length) return 0;
  const rows = await rest(`/orders?select=id&created_at=gt.${encodeURIComponent(since)}&or=(${filters.join(',')})&limit=50`);
  return rows?.length ?? 0;
}

export const holdWorks = (orderId, workIds, minutes = 20) => rest('/rpc/hold_works', { method: 'POST', body: { p_order: orderId, p_works: workIds, p_minutes: minutes } });

export const releaseHolds = (orderId) => rest(`/holds?order_id=${eq(orderId)}&sold=is.false`, { method: 'DELETE', prefer: 'return=minimal' });

export const sellWorks = (orderId) => rest('/rpc/sell_works', { method: 'POST', body: { p_order: orderId } });

/* paintings of this order that another order bought first (a paid order that lost the race) */
export async function lostWorks(order) {
  const ids = (order.works || []).map((w) => w.id);
  if (order.status !== 'paid' || !ids.length) return [];
  const rows = await rest(`/holds?select=work_id&sold=is.true&work_id=${inList(ids)}&order_id=neq.${encodeURIComponent(order.id)}`);
  return (rows || []).map((r) => r.work_id);
}

/* ------------------------------------------------------------------ catalogue (paintings + collections) */
export async function readCatalog() {
  const [collections, works] = await Promise.all([
    rest('/collections?select=id,data&order=position.asc,id.asc'),
    rest('/works?select=id,data&order=position.asc,id.asc'),
  ]);
  return {
    collections: (collections || []).map((r) => ({ id: r.id, ...r.data })),
    works: (works || []).map((r) => ({ id: r.id, ...r.data })),
  };
}

export async function nextWorkPosition() {
  const rows = await rest('/works?select=position&order=position.desc&limit=1');
  return (rows?.[0]?.position ?? -1) + 1;
}

export const upsertRows = (table, rows) =>
  rest(`/${table}?on_conflict=id`, { method: 'POST', body: rows, prefer: 'resolution=merge-duplicates,return=minimal' });

export async function workExists(id) {
  const rows = await rest(`/works?id=${eq(id)}&select=id`);
  return Boolean(rows?.length);
}

export async function updateWork(id, data) {
  const rows = await rest(`/works?id=${eq(id)}`, { method: 'PATCH', body: { data, updated_at: new Date().toISOString() }, prefer: 'return=representation' });
  return rows?.[0] ?? null;
}

export const deleteWork = (id) => rest(`/works?id=${eq(id)}`, { method: 'DELETE', prefer: 'return=minimal' });

/* has this painting ever been part of an online order (held or sold)? */
export async function workHasOrders(id) {
  const rows = await rest(`/holds?work_id=${eq(id)}&select=work_id`);
  return Boolean(rows?.length);
}

/* ------------------------------------------------------------------ admin login attempts */
export async function failedLogins({ client, minutes }) {
  const since = new Date(Date.now() - minutes * 60 * 1000).toISOString();
  const all = await rest(`/admin_attempts?select=client&at=gt.${encodeURIComponent(since)}&limit=500`);
  return { mine: (all || []).filter((r) => r.client === client).length, all: all?.length ?? 0 };
}
export async function recordFailedLogin(client) {
  await rest('/admin_attempts', { method: 'POST', body: { client }, prefer: 'return=minimal' });
  const old = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  await rest(`/admin_attempts?at=lt.${encodeURIComponent(old)}`, { method: 'DELETE', prefer: 'return=minimal' }).catch(() => {});
}
export const clearFailedLogins = (client) => rest(`/admin_attempts?client=${eq(client)}`, { method: 'DELETE', prefer: 'return=minimal' });

/* paintings sold online, and paintings someone is paying for right now */
export async function liveHolds() {
  const now = new Date().toISOString();
  const rows = await rest(`/holds?select=work_id,sold,expires_at&or=(sold.is.true,expires_at.gt.${encodeURIComponent(`"${now}"`)})`);
  return {
    sold: rows.filter((r) => r.sold).map((r) => r.work_id),
    held: rows.filter((r) => !r.sold).map((r) => r.work_id),
  };
}
