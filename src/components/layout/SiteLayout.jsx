import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Outlet, useMatches, useParams } from 'react-router-dom';
import { MotionProvider } from '@/motion/MotionContext';
import { useSiteMotion } from '@/motion/useSiteMotion';
import Header from './Header';
import Footer from './Footer';
import MenuOverlay from './MenuOverlay';
import Curtain from './Curtain';
import Cursor from './Cursor';
import ProgressMandala from './ProgressMandala';

/* Persistent page chrome. Each route's `handle` describes how the chrome behaves on that page:
   { title, curtain (string | params => string), nav, bag: 'link'|'order-link'|'drawer'|'anchor', isHome, raisedProgress } */
export default function SiteLayout() {
  const rootRef = useRef(null);
  const menuButtonRef = useRef(null);
  const curtainRef = useRef(null);
  const instantClose = useRef(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuOpenRef = useRef(menuOpen);
  menuOpenRef.current = menuOpen;

  const matches = useMatches();
  const params = useParams();
  const page = matches[matches.length - 1]?.handle ?? {};
  const curtainLabel = typeof page.curtain === 'function' ? page.curtain(params) : page.curtain;

  const closeMenu = useCallback((instant = false) => {
    instantClose.current = instant;
    setMenuOpen(false);
  }, []);

  const { apiRef, extraRef } = useSiteMotion(rootRef, {
    closeMenu,
    isMenuOpen: () => menuOpenRef.current,
    setDest: (label) => curtainRef.current?.setDest(label),
  });
  const motion = useMemo(() => ({ apiRef, extraRef }), [apiRef, extraRef]);

  useEffect(() => {
    document.title = page.title ? `KALA — ${page.title}` : 'KALA';
  }, [page.title]);

  return (
    <MotionProvider value={motion}>
      <div ref={rootRef} data-kala className="overflow-x-clip bg-ivory font-sans text-base/[26px] text-ink antialiased">
        <Header
          ref={menuButtonRef}
          current={page.nav}
          bagMode={page.bag}
          isHome={page.isHome}
          menuOpen={menuOpen}
          onMenu={() => setMenuOpen(true)}
        />
        <main id="top" data-chapter={page.isHome ? 'Home' : undefined}>
          <Outlet />
        </main>
        <Footer isHome={page.isHome} />
        <MenuOverlay
          open={menuOpen}
          instantClose={instantClose}
          onClose={closeMenu}
          current={page.nav}
          isHome={page.isHome}
          menuButtonRef={menuButtonRef}
        />
        <ProgressMandala raised={page.raisedProgress} />
        <Curtain ref={curtainRef} label={curtainLabel} />
        <Cursor />
      </div>
    </MotionProvider>
  );
}
