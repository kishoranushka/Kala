import { useEffect } from 'react';
import { useRouteError } from 'react-router-dom';
import { CONTACT } from '@/data/site';

/* After a new deploy, a tab opened earlier still asks for the old page files (hashed names that no
   longer exist). Reload once to pick up the new build instead of showing an error. */
const RELOAD_KEY = 'kala:reloaded-for-update';
const isStaleBuild = (err) =>
  /dynamically imported module|module script failed|Importing a module|Loading chunk|Failed to fetch|preload CSS/i.test(
    String(err?.message ?? err ?? '')
  );

export function reloadOnceForUpdate() {
  try {
    const last = Number(sessionStorage.getItem(RELOAD_KEY) || 0);
    if (Date.now() - last < 30_000) return false; // already tried just now: don't loop
    sessionStorage.setItem(RELOAD_KEY, String(Date.now()));
  } catch {
    /* storage blocked: reload anyway, the browser's own cache rules stop a loop */
  }
  window.location.reload();
  return true;
}

/* Shown in place of the whole site when a page fails to load or render — never a blank screen or
   the router's developer error page. Plain markup only: no motion hooks, so it is always visible. */
export default function RouteError() {
  const error = useRouteError();
  const stale = isStaleBuild(error);

  useEffect(() => {
    console.error(error);
    if (stale) reloadOnceForUpdate();
  }, [error, stale]);

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-page px-5 py-16 text-center font-sans text-base/[26px] text-primary antialiased">
      <a href="/" className="font-display text-[34px]/none tracking-[.04em]">
        KALA
      </a>
      <h1 className="mt-10 font-display text-[clamp(36px,8vw,56px)]/[1.05]">
        {stale ? 'The site was just updated.' : 'This page didn’t load.'}
      </h1>
      <p className="mt-4 max-w-[46ch] text-soft">
        {stale
          ? 'Reload to see the latest version — nothing in your cart is lost.'
          : 'Something went wrong on my side. Try again, or head back to the shop — your cart is saved.'}
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="rounded-ui bg-primary px-6 py-3 text-on-primary transition-colors hover:bg-primary-hover"
        >
          Reload page
        </button>
        <a href="/shop" className="rounded-ui border border-primary px-6 py-3 transition-colors hover:bg-surface-alt">
          Go to the shop
        </a>
      </div>
      <p className="mt-10 text-sm text-muted">
        Still stuck? Write to{' '}
        <a href={`mailto:${CONTACT.email}`} className="text-link underline hover:text-link-hover">
          {CONTACT.email}
        </a>
      </p>
    </div>
  );
}
