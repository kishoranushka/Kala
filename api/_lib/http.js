/* small request/response helpers shared by the /api functions */
import { createHash } from 'node:crypto';

/* API answers are personal (orders, payments) unless a handler says otherwise: never cached */
export function json(res, status, body, headers = {}) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  for (const [k, v] of Object.entries(headers)) res.setHeader(k, v);
  res.end(JSON.stringify(body));
}

const MAX_BODY = 64 * 1024;

/* the exact bytes that were sent (needed to check Razorpay's webhook signature) */
export async function readRaw(req) {
  if (Buffer.isBuffer(req.rawBody)) return req.rawBody.toString('utf8');
  const chunks = [];
  let size = 0;
  for await (const c of req) {
    size += c.length;
    if (size > MAX_BODY) throw new Error('Request body too large');
    chunks.push(c);
  }
  const raw = Buffer.concat(chunks).toString('utf8');
  if (raw) return raw;
  if (typeof req.body === 'string') return req.body;
  return req.body ? JSON.stringify(req.body) : '';
}

export async function readJson(req) {
  let out;
  if (req.body && typeof req.body === 'object' && !Buffer.isBuffer(req.body)) out = req.body;
  else if (typeof req.body === 'string') out = JSON.parse(req.body || '{}');
  else out = JSON.parse((await readRaw(req)) || '{}');
  if (!out || typeof out !== 'object' || Array.isArray(out)) throw new Error('Expected a JSON object');
  return out;
}

export const clean = (s, max = 200) =>
  String(s ?? '')
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '') // control characters (keeps \t \n \r)
    .trim()
    .slice(0, max);

export const query = (req) => new URL(req.url, 'http://local').searchParams;

/* fetch that gives up: a hanging Razorpay/Shiprocket/Supabase call must not hang the function */
export function timedFetch(url, options = {}, ms = 8000) {
  return fetch(url, { ...options, signal: AbortSignal.timeout(ms) });
}

/* the visitor's IP (Vercel sets x-forwarded-for), hashed so no raw IP is stored */
export function clientKey(req) {
  const ip = String(req.headers['x-real-ip'] || req.headers['x-forwarded-for'] || req.socket?.remoteAddress || '')
    .split(',')[0]
    .trim();
  if (!ip) return null;
  return createHash('sha256').update(`kala:${ip}`).digest('hex').slice(0, 24);
}
