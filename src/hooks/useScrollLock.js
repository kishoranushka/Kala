import { useEffect } from 'react';

/* stop the page scrolling behind an open overlay */
export function useScrollLock(active) {
  useEffect(() => {
    if (!active) return;
    const html = document.documentElement;
    html.style.overflow = 'hidden';
    return () => {
      html.style.overflow = '';
    };
  }, [active]);
}
