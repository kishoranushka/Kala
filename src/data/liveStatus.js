import { getWork } from './works';

/* Paintings bought online are recorded in the orders database, not in works.json. Before the app
   renders, ask /api/availability which ones have sold and mark them Sold everywhere. Waits at most
   `timeout` ms; if the check is slow or fails, the site shows works.json as it is (the server still
   refuses to sell a painting twice). */
export async function applyLiveStatus(timeout = 1500) {
  try {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), timeout);
    const res = await fetch('/api/availability', { signal: ctrl.signal });
    clearTimeout(timer);
    if (!res.ok) return;
    const { sold = [] } = await res.json();
    for (const id of sold) {
      const w = getWork(id);
      if (w) w.status = 'sold';
    }
  } catch {
    /* offline, slow or not deployed: keep works.json as is */
  }
}
