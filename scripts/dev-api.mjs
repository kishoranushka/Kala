/* Runs the Vercel functions in /api under `npm run dev` too (Vercel runs them itself in production):
   /api/<name> → api/<name>.js. Secrets for local testing go in .env.local (gitignored), e.g. RAZORPAY_KEY_ID=… */
import { pathToFileURL } from 'node:url';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { loadEnv } from 'vite';

export default function devApi() {
  return {
    name: 'kala-dev-api',
    apply: 'serve',
    configResolved(config) {
      const env = loadEnv(config.mode, config.root, '');
      for (const [k, v] of Object.entries(env)) if (!k.startsWith('VITE_') && process.env[k] === undefined) process.env[k] = v;
    },
    configureServer(server) {
      server.middlewares.use('/api', async (req, res, next) => {
        const name = req.url.split('?')[0].replace(/^\/+|\/+$/g, '');
        const file = path.resolve('api', `${name}.js`);
        if (!/^[a-z0-9-]+$/.test(name) || !existsSync(file)) return next();
        try {
          const { default: handler } = await import(pathToFileURL(file).href + `?t=${Date.now()}`);
          await handler(req, res);
        } catch (err) {
          server.config.logger.error(`[dev-api] ${err.stack || err}`);
          res.statusCode = 500;
          res.end(JSON.stringify({ error: err.message }));
        }
      });
    },
  };
}
