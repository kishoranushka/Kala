/* Runs the Vercel functions in /api under `npm run dev` too (Vercel runs them itself in production).
   Secrets for local testing go in .env.local (gitignored), e.g. SHIPROCKET_EMAIL=… */
import { pathToFileURL } from 'node:url';
import path from 'node:path';
import { loadEnv } from 'vite';

const ROUTES = { '/api/order': 'api/order.js' };

export default function devApi() {
  return {
    name: 'kala-dev-api',
    apply: 'serve',
    configResolved(config) {
      const env = loadEnv(config.mode, config.root, '');
      for (const [k, v] of Object.entries(env)) if (!k.startsWith('VITE_') && process.env[k] === undefined) process.env[k] = v;
    },
    configureServer(server) {
      for (const [route, file] of Object.entries(ROUTES)) {
        server.middlewares.use(route, async (req, res) => {
          try {
            const url = pathToFileURL(path.resolve(file)).href + `?t=${Date.now()}`;
            const { default: handler } = await import(url);
            await handler(req, res);
          } catch (err) {
            server.config.logger.error(`[dev-api] ${err.stack || err}`);
            res.statusCode = 500;
            res.end(JSON.stringify({ error: err.message }));
          }
        });
      }
    },
  };
}
