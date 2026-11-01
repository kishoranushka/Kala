/* The gallery cursor (driven by the motion system on fine pointers). */
const LABELS = [
  ['view', 'View'],
  ['talk', 'Let’s talk'],
  ['explore', 'Explore'],
];

export default function Cursor() {
  return (
    <>
      <div
        data-cursor-ring
        aria-hidden="true"
        className="pointer-events-none invisible fixed top-0 left-0 z-90 grid size-9 place-items-center rounded-full border border-white text-on-primary mix-blend-difference motion-reduce:hidden"
      >
        {LABELS.map(([key, text]) => (
          <span key={key} data-cl={key} className="invisible [grid-area:1/1] font-sans text-[10px]/[14px] font-semibold tracking-[.14em] whitespace-nowrap uppercase opacity-0">
            {text}
          </span>
        ))}
      </div>
      <div data-cursor-dot aria-hidden="true" className="pointer-events-none invisible fixed top-0 left-0 z-91 size-1.5 rounded-full bg-white mix-blend-difference motion-reduce:hidden" />
    </>
  );
}
