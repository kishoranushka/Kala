/* Load .env / .env.local into process.env (Vercel's own env wins), for scripts run with plain node. */
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadEnv } from 'vite';

export const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');

for (const [k, v] of Object.entries(loadEnv('production', ROOT, ''))) if (process.env[k] === undefined) process.env[k] = v;
