/* Supabase Storage: the painting photos (public bucket "paintings"). Server-side only.
   Files are never overwritten: every upload gets a new name, so they can be cached forever. */
import { authHeaders, base } from './db.js';
import { timedFetch } from './http.js';

export const BUCKET = 'paintings';

/* public URL prefix of the bucket, e.g. https://abcd.supabase.co/storage/v1/object/public/paintings */
export const storageBase = () => (base() ? `${base()}/storage/v1/object/public/${BUCKET}` : null);

export const isFileName = (s) => typeof s === 'string' && /^[a-z0-9][a-z0-9._-]{0,90}\.(webp|jpe?g|png)$/i.test(s);

async function call(path, options = {}, ms = 15000) {
  const res = await timedFetch(`${base()}/storage/v1${path}`, { ...options, headers: { ...authHeaders(), ...(options.headers || {}) } }, ms);
  const text = await res.text();
  let out = null;
  try {
    out = text ? JSON.parse(text) : null;
  } catch {
    /* not JSON */
  }
  return { ok: res.ok, status: res.status, out };
}

export async function fileExists(name) {
  const res = await timedFetch(`${storageBase()}/${encodeURIComponent(name)}`, { method: 'HEAD' });
  return res.ok;
}

export async function uploadFile(name, bytes, contentType = 'image/webp', { upsert = false } = {}) {
  const r = await call(`/object/${BUCKET}/${encodeURIComponent(name)}`, {
    method: 'POST',
    headers: { 'Content-Type': contentType, 'Cache-Control': 'public, max-age=31536000, immutable', 'x-upsert': upsert ? 'true' : 'false' },
    body: bytes,
  }, 30000);
  if (!r.ok) throw new Error(`Storage: ${r.out?.message || r.out?.error || r.status}`);
}

export async function removeFiles(names) {
  if (!names.length) return;
  const r = await call(`/object/${BUCKET}`, { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ prefixes: names }) });
  if (!r.ok) throw new Error(`Storage: ${r.out?.message || r.status}`);
}

/* make the public bucket if it isn't there yet (used by the migration script) */
export async function ensureBucket() {
  const got = await call(`/bucket/${BUCKET}`);
  if (got.ok) return false;
  const made = await call('/bucket', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id: BUCKET, name: BUCKET, public: true, file_size_limit: 10 * 1024 * 1024, allowed_mime_types: ['image/webp', 'image/jpeg', 'image/png'] }),
  });
  if (!made.ok) throw new Error(`Storage bucket: ${made.out?.message || made.out?.error || made.status}`);
  return true;
}
