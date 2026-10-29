import { useLayoutEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { createMotion } from './createMotion';

/* Mounts the motion system on the site root once per route.
   Pages travel behind the curtain: the outgoing page drops it, the incoming page lifts it. */
export function useSiteMotion(rootRef, { closeMenu, isMenuOpen, setDest }) {
  const location = useLocation();
  const navigate = useNavigate();
  const apiRef = useRef(null);
  const extraRef = useRef(null);
  const arrivingAt = useRef(null);
  const handlers = useRef({});
  handlers.current = { closeMenu, isMenuOpen, setDest };

  useLayoutEffect(() => {
    const target = location.hash ? document.getElementById(location.hash.slice(1)) : null;
    window.scrollTo(0, target ? target.getBoundingClientRect().top + window.scrollY : 0);

    const api = createMotion(rootRef.current, {
      arriving: arrivingAt.current === location.pathname,
      extra: extraRef.current,
      navigate: (to) => {
        arrivingAt.current = to.split(/[?#]/)[0];
        navigate(to);
      },
      closeMenu: (instant) => handlers.current.closeMenu(instant),
      isMenuOpen: () => handlers.current.isMenuOpen(),
      setDest: (label) => handlers.current.setDest(label),
    });
    apiRef.current = api;
    return () => {
      api.destroy();
      apiRef.current = null;
    };
    // the page (pathname) is the unit of choreography
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  return { apiRef, extraRef };
}
