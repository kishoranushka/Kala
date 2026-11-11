import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { getWork, isBuyable } from '@/data/works';

/* The cart ("bag"): originals a visitor has set aside, as work ids.
   - Kept in localStorage, so it survives a reload or a new tab, and stays in step across open tabs.
   - Only ever holds works that can be bought online (available and priced). Anything that has sold
     since it was added is taken out, and its title kept in `dropped` so the page can say why. */
const STORAGE_KEY = 'kala-bag';
const BagContext = createContext(null);

const storage = () => {
  try {
    return window.localStorage;
  } catch {
    return null; // blocked (private mode, strict settings): the cart lives for this page only
  }
};

/* unique, known, still buyable — and the titles of what had to go */
function sanitize(ids) {
  const keep = [];
  const dropped = [];
  for (const id of Array.isArray(ids) ? ids : []) {
    if (typeof id !== 'string' || keep.includes(id)) continue;
    const w = getWork(id);
    if (!w) continue;
    if (isBuyable(w)) keep.push(id);
    else dropped.push(w.title);
  }
  return { keep, dropped };
}

function readStored() {
  try {
    const s = storage();
    /* carry over a cart from the older per-tab storage */
    const raw = s?.getItem(STORAGE_KEY) ?? window.sessionStorage?.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

const same = (a, b) => a.length === b.length && a.every((x, i) => x === b[i]);

export function BagProvider({ children }) {
  const [initial] = useState(() => sanitize(readStored()));
  const [bag, setBagState] = useState(initial.keep);
  const [dropped, setDropped] = useState(initial.dropped);
  const [drawerOpen, setDrawerOpen] = useState(false);

  /* every change goes through sanitize, so nothing unbuyable or duplicated gets in */
  const setBag = useCallback((next) => {
    setBagState((b) => {
      const { keep } = sanitize(typeof next === 'function' ? next(b) : next);
      return same(keep, b) ? b : keep;
    });
  }, []);

  useEffect(() => {
    try {
      storage()?.setItem(STORAGE_KEY, JSON.stringify(bag));
      window.sessionStorage?.removeItem(STORAGE_KEY);
    } catch {
      /* storage full or blocked */
    }
  }, [bag]);

  /* another tab changed the cart */
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key !== STORAGE_KEY) return;
      let ids = [];
      try {
        ids = JSON.parse(e.newValue || '[]');
      } catch {
        /* ignore a broken value */
      }
      const { keep } = sanitize(ids);
      setBagState((b) => (same(keep, b) ? b : keep));
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const add = useCallback((id) => setBag((b) => (b.includes(id) ? b : [...b, id])), [setBag]);
  const remove = useCallback((id) => setBag((b) => b.filter((x) => x !== id)), [setBag]);
  const removeMany = useCallback((ids) => setBag((b) => b.filter((x) => !ids.includes(x))), [setBag]);
  const toggle = useCallback((id) => setBag((b) => (b.includes(id) ? b.filter((x) => x !== id) : [...b, id])), [setBag]);
  const clearDropped = useCallback(() => setDropped([]), []);
  const openDrawer = useCallback(() => setDrawerOpen(true), []);
  const closeDrawer = useCallback(() => setDrawerOpen(false), []);

  const value = useMemo(
    () => ({ bag, setBag, add, remove, removeMany, toggle, dropped, clearDropped, drawerOpen, openDrawer, closeDrawer }),
    [bag, setBag, add, remove, removeMany, toggle, dropped, clearDropped, drawerOpen, openDrawer, closeDrawer]
  );
  return <BagContext.Provider value={value}>{children}</BagContext.Provider>;
}

export function useBag() {
  const ctx = useContext(BagContext);
  if (!ctx) throw new Error('useBag must be used inside <BagProvider>');
  return ctx;
}
