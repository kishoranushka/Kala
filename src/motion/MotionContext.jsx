import { createContext, useContext, useLayoutEffect, useRef } from 'react';

/* { apiRef, extraRef } — the live motion api of the current page, and that page's extra choreography */
const MotionContext = createContext(null);

export const MotionProvider = MotionContext.Provider;

/* the running motion api (cover, pop, refresh), or null before it mounts / under reduced motion */
export function useMotionApi() {
  return useContext(MotionContext).apiRef;
}

/* register page-specific choreography; it runs inside the shared timeline (see createMotion ctx) */
export function usePageMotion(extra) {
  const { extraRef } = useContext(MotionContext);
  const latest = useRef(extra);
  latest.current = extra;

  useLayoutEffect(() => {
    const run = (ctx) => latest.current(ctx);
    extraRef.current = run;
    return () => {
      if (extraRef.current === run) extraRef.current = null;
    };
  }, [extraRef]);
}
