import cx from '@/utils/cx';

const PETAL = 'M0,-13 C4,-9 4,-6 0,-4 C-4,-6 -4,-9 0,-13Z';

/* back-to-top control: its ring fills and its petals turn with the scroll */
export default function ProgressMandala({ raised = false }) {
  return (
    <a
      href="#top"
      data-prog
      data-magnetic
      aria-label="Back to top"
      className={cx(
        'fixed right-6 bottom-6 z-60 flex size-14 items-center justify-center rounded-full bg-paper shadow-pop max-sm:right-4 max-sm:bottom-4 max-sm:size-12',
        raised && 'max-lg:bottom-24'
      )}
    >
      <svg viewBox="-24 -24 48 48" width="44" height="44" fill="none" aria-hidden="true" className="max-sm:size-[38px]">
        <circle r="20" stroke="#E5E0D8" strokeWidth="1.5" />
        <circle data-prog-ring r="20" strokeWidth="1.5" transform="rotate(-90)" className="stroke-accent" />
        <g data-prog-petals stroke="#6B645A" strokeWidth="1">
          {[0, 60, 120, 180, 240, 300].map((a) => (
            <path key={a} d={PETAL} transform={a ? `rotate(${a})` : undefined} />
          ))}
        </g>
        <circle r="2.5" fill="#22211F" />
      </svg>
    </a>
  );
}
