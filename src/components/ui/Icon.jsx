/* Line icons (24-unit grid, currentColor). Filled glyphs are listed separately. */
const STROKED = {
  arrow: (
    <>
      <path d="M4 12h16" />
      <path d="M14 6l6 6-6 6" />
    </>
  ),
  arrowDown: (
    <>
      <path d="M12 4v16" />
      <path d="M6 14l6 6 6-6" />
    </>
  ),
  bag: (
    <>
      <path d="M5 8h14l-1 12H6L5 8Z" />
      <path d="M9 8V6a3 3 0 0 1 6 0v2" />
    </>
  ),
  menu: (
    <>
      <path d="M4 9h16" />
      <path d="M8 15h12" />
    </>
  ),
  close: (
    <>
      <path d="M6 6l12 12" />
      <path d="M18 6L6 18" />
    </>
  ),
  plus: (
    <>
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </>
  ),
  check: <path d="M5 12l5 5 9-10" />,
  alert: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8v5" />
      <path d="M12 16h.01" />
    </>
  ),
  expand: (
    <>
      <path d="M4 9V4h5" />
      <path d="M20 9V4h-5" />
      <path d="M4 15v5h5" />
      <path d="M20 15v5h-5" />
    </>
  ),
  mail: (
    <>
      <rect x="3" y="5" width="18" height="14" />
      <path d="M3 7l9 6 9-6" />
    </>
  ),
  instagram: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r=".8" fill="currentColor" />
    </>
  ),
  youtube: (
    <>
      <rect x="2" y="5" width="20" height="14" rx="4" />
      <path d="M10 9l5 3-5 3V9Z" />
    </>
  ),
  pin: (
    <>
      <path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21Z" />
      <circle cx="12" cy="9.5" r="2.5" />
    </>
  ),
  lock: (
    <>
      <rect x="5" y="11" width="14" height="10" rx="1" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" />
    </>
  ),
};

const FILLED = {
  play: <path d="M7 4.5v15l13-7.5z" />,
  pause: <path d="M6 4h4v16H6zM14 4h4v16h-4z" />,
};

export default function Icon({ name, size = 20, strokeWidth = 1.5, ...props }) {
  const filled = FILLED[name];
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={filled ? 'currentColor' : 'none'}
      stroke={filled ? undefined : 'currentColor'}
      strokeWidth={filled ? undefined : strokeWidth}
      aria-hidden="true"
      {...props}
    >
      {filled || STROKED[name]}
    </svg>
  );
}
