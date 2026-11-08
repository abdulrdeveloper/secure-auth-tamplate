// Static picture of the hero scene: the Clavis key in the middle, apps on a
// ring around it, and a token on each path. Shown before the 3D scene loads,
// and instead of it on small screens or when motion is reduced.

const RING_RADIUS = 150;
const APP_COUNT = 5;

const apps = Array.from({ length: APP_COUNT }, (_, i) => {
  const angle = (i / APP_COUNT) * Math.PI * 2 - Math.PI / 2;
  return {
    x: 200 + Math.cos(angle) * RING_RADIUS,
    y: 200 + Math.sin(angle) * RING_RADIUS,
  };
});

export function KeyPoster({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 400 400" className={className} aria-hidden="true">
      <defs>
        <radialGradient id="poster-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#c9a15a" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#c9a15a" stopOpacity="0" />
        </radialGradient>
      </defs>

      <circle cx="200" cy="200" r="120" fill="url(#poster-glow)" />
      <circle
        cx="200"
        cy="200"
        r={RING_RADIUS}
        fill="none"
        stroke="#ffffff"
        strokeOpacity="0.08"
        strokeDasharray="2 6"
      />

      {apps.map((app, i) => {
        const midX = (200 + app.x) / 2 + (app.y - 200) * 0.25;
        const midY = (200 + app.y) / 2 - (app.x - 200) * 0.25;
        const tokenX = 0.25 * 200 + 0.5 * midX + 0.25 * app.x;
        const tokenY = 0.25 * 200 + 0.5 * midY + 0.25 * app.y;
        return (
          <g key={i}>
            <path
              d={`M200 200 Q${midX} ${midY} ${app.x} ${app.y}`}
              fill="none"
              stroke="#ffffff"
              strokeOpacity="0.14"
            />
            <circle cx={tokenX} cy={tokenY} r="3" fill="#c9a15a" />
            <rect
              x={app.x - 13}
              y={app.y - 13}
              width="26"
              height="26"
              rx="7"
              fill="#111113"
              stroke="#ffffff"
              strokeOpacity="0.22"
            />
          </g>
        );
      })}

      <g fill="none" stroke="#c9a15a" strokeWidth="5" strokeLinecap="round">
        <circle cx="200" cy="172" r="22" />
        <path d="M200 194 V246" />
        <path d="M200 228 H214 M200 240 H210" />
      </g>
    </svg>
  );
}
