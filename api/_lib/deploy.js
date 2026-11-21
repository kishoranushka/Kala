/* Rebuild the live site after the catalogue changes, so the pre-rendered SEO pages, sitemap and
   llms.txt catch up (the site itself already shows the change: it reads /api/catalog on load).
   Env: VERCEL_DEPLOY_HOOK_URL — Vercel → Project → Settings → Git → Deploy Hooks → create one for
   branch "main", paste its URL. Without it nothing is rebuilt until the next git push. */
import { timedFetch } from './http.js';

export const rebuildConfigured = () => Boolean((process.env.VERCEL_DEPLOY_HOOK_URL || '').trim());

/* true = a rebuild was started */
export async function triggerRebuild() {
  const url = (process.env.VERCEL_DEPLOY_HOOK_URL || '').trim();
  if (!/^https:\/\/api\.vercel\.com\//.test(url)) return false;
  try {
    /* Vercel's hook often takes 7–8 s to answer; the default 8 s timeout cut it off and no build started */
    const res = await timedFetch(url, { method: 'POST' }, 25000);
    if (!res.ok) console.error('[deploy] hook answered', res.status);
    return res.ok;
  } catch (err) {
    console.error('[deploy] hook failed', err.message);
    return false;
  }
}
