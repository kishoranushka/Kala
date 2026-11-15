import { getWork, setCatalog } from './works';

/* Before the app renders, ask /api/catalog for the live catalogue: paintings added or changed in the
   admin panel since the last build, and paintings sold online (marked Sold everywhere). Waits at most
   `timeout` ms; if the check is slow or fails, the site shows the build's copy (works.json) as it is
   (the server still prices orders from the database and refuses to sell a painting twice). */
export async function applyLiveStatus(timeout = 1500) {
  try {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), timeout);
    const res = await fetch('/api/catalog', { signal: ctrl.signal });
    clearTimeout(timer);
    if (!res.ok) return;
    const { collections, works, storage, sold = [] } = await res.json();
    setCatalog({ collections, works, storage });
    for (const id of sold) {
      const w = getWork(id);
      if (w) w.status = 'sold';
    }
  } catch {
    /* offline, slow or not deployed: keep works.json as is */
  }
}
