/* small request/response helpers shared by the /api functions */

export function json(res, status, body, headers = {}) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  for (const [k, v] of Object.entries(headers)) res.setHeader(k, v);
  res.end(JSON.stringify(body));
}

/* the exact bytes that were sent (needed to check Razorpay's webhook signature) */
export async function readRaw(req) {
  if (Buffer.isBuffer(req.rawBody)) return req.rawBody.toString('utf8');
  const chunks = [];
  for await (const c of req) chunks.push(c);
  const raw = Buffer.concat(chunks).toString('utf8');
  if (raw) return raw;
  if (typeof req.body === 'string') return req.body;
  return req.body ? JSON.stringify(req.body) : '';
}

export async function readJson(req) {
  if (req.body && typeof req.body === 'object' && !Buffer.isBuffer(req.body)) return req.body;
  if (typeof req.body === 'string') return JSON.parse(req.body || '{}');
  return JSON.parse((await readRaw(req)) || '{}');
}

export const clean = (s, max = 200) => String(s ?? '').trim().slice(0, max);

export const query = (req) => new URL(req.url, 'http://local').searchParams;
