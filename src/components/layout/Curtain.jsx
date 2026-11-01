import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';

const PETAL = 'M0,-54 C10,-46 10,-36 0,-28 C-10,-36 -10,-46 0,-54Z';
const LETTERS = ['K', 'A', 'L', 'A'];

/* The full-screen curtain that carries visitors between pages and chapters.
   `label` names the page; the motion system can briefly show a chapter name instead (setDest). */
const Curtain = forwardRef(function Curtain({ label }, ref) {
  const [dest, setDest] = useState(null);
  useImperativeHandle(ref, () => ({ setDest }), []);
  useEffect(() => setDest(null), [label]);

  return (
    <div data-curtain aria-hidden="true" className="inverse pointer-events-none invisible fixed inset-0 z-95 flex items-center justify-center bg-primary text-on-primary">
      <div data-curtain-inner className="flex flex-col items-center gap-7">
        <svg viewBox="-60 -60 120 120" width="120" height="120" fill="none" strokeWidth="1" className="stroke-oak">
          <circle data-draw r="56" />
          <circle data-draw r="42" strokeDasharray="1 5" />
          {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
            <path key={a} data-draw d={PETAL} transform={a ? `rotate(${a})` : undefined} />
          ))}
          <circle data-draw r="20" />
          <circle r="6" className="fill-secondary" stroke="none" />
        </svg>
        <div className="mr-[-.34em] flex overflow-hidden pb-[.1em] font-display text-[56px]/[1.1] font-medium tracking-[.34em]">
          {LETTERS.map((l, i) => (
            <span key={i} data-curtain-letter className="inline-block">
              {l}
            </span>
          ))}
        </div>
        <p data-curtain-label className="eyebrow-quiet">
          {dest ?? label}
        </p>
      </div>
    </div>
  );
});

export default Curtain;
