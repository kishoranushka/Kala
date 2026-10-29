import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

/* The bag: originals a visitor has set aside (ids), remembered for the visit. */
const STORAGE_KEY = 'kala-bag';
const BagContext = createContext(null);

function readBag() {
  try {
    const stored = JSON.parse(window.sessionStorage.getItem(STORAGE_KEY) || '[]');
    return Array.isArray(stored) ? stored : [];
  } catch {
    return [];
  }
}

export function BagProvider({ children }) {
  const [bag, setBag] = useState(readBag);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    try {
      window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(bag));
    } catch {
      /* storage unavailable (private mode): the bag lives for this page only */
    }
  }, [bag]);

  const add = useCallback((id) => setBag((b) => (b.includes(id) ? b : [...b, id])), []);
  const remove = useCallback((id) => setBag((b) => b.filter((x) => x !== id)), []);
  const toggle = useCallback((id) => setBag((b) => (b.includes(id) ? b.filter((x) => x !== id) : [...b, id])), []);
  const openDrawer = useCallback(() => setDrawerOpen(true), []);
  const closeDrawer = useCallback(() => setDrawerOpen(false), []);

  const value = useMemo(
    () => ({ bag, setBag, add, remove, toggle, drawerOpen, openDrawer, closeDrawer }),
    [bag, add, remove, toggle, drawerOpen, openDrawer, closeDrawer]
  );
  return <BagContext.Provider value={value}>{children}</BagContext.Provider>;
}

export function useBag() {
  return useContext(BagContext);
}
