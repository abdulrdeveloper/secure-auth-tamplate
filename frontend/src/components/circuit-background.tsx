const SIDE = (
  <>
    <path d="M100 118H285L320 153V270L357 306" stroke="#3f3f46" strokeWidth="1.2" />
    <rect x="30" y="100" width="70" height="36" rx="6" fill="#18181b" stroke="#3f3f46" strokeWidth="1" />
    <circle cx="113" cy="119" r="3" fill="#e4e4e7" />
  </>
);

export function CircuitBackground() {
  return (
    <svg
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full"
      viewBox="0 0 1024 768"
      preserveAspectRatio="xMidYMid slice"
      fill="none"
    >
      <g>{SIDE}</g>
      <g transform="translate(1024 0) scale(-1 1)">{SIDE}</g>
      <g transform="translate(0 768) scale(1 -1)">{SIDE}</g>
      <g transform="translate(1024 768) scale(-1 -1)">{SIDE}</g>
    </svg>
  );
}
