import { useReveal } from "./use-reveal";

const SECURITY_POINTS = [
  {
    title: "Tokens & Key Management",
    detail: "RS256 asymmetric signing with 1-hour expiration. Client applications only ever need the public key from our live JWKS endpoint to verify identity.",
  },
  {
    title: "Authorization & PKCE",
    detail: "One-time authorization codes expire in 120 seconds. Mandatory S256 PKCE code challenge protection. Client secrets hashed with bcrypt and shown only once.",
  },
  {
    title: "Account Security & Timing Protection",
    detail: "10-round bcrypt password hashing. Mandatory email verification before sign-in. Unknown email addresses execute a dummy hash to prevent timing attacks.",
  },
  {
    title: "Per-IP Active Rate Limiting",
    detail: "Sign-in capped at 10 requests per 15 minutes, token endpoint capped at 30 requests per minute, and request payload strictly capped at 10 kB.",
  },
];

export function Security() {
  const ref = useReveal<HTMLDivElement>();

  return (
    <section id="security" aria-label="Security" className="border-t border-zinc-800/80 py-20 sm:py-24">
      <div className="mx-auto max-w-5xl px-5">
        <div
          ref={ref}
          className="reveal grid items-center gap-12 lg:grid-cols-[1fr_auto_1.25fr] lg:gap-12 xl:gap-16"
        >
          {/* Left Column: Headline and Compliance */}
          <div className="max-w-md">
            <span className="inline-block rounded-full border border-zinc-800 bg-zinc-900/60 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
              Built-in protection
            </span>
            <h2 className="mt-5 text-3xl font-semibold tracking-tight text-zinc-50 sm:text-4xl">
              Hardened defaults with{" "}
              <span className="text-[#c9a15a]">real numbers.</span>
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-zinc-400">
              Every token timing, encryption specification, and rate limit is enforced directly in code—read straight from the server configuration, not a marketing promise.
            </p>
            <div className="mt-7 flex items-center gap-3 text-xs text-zinc-400">
              <span className="flex size-2 rounded-full bg-emerald-500" />
              <span>OWASP Top 10 aligned & RFC 6749 compliant</span>
            </div>
          </div>

          {/* Center Column: Smooth Curvy SVG Line with Equal Spacing on Left & Right */}
          <div
            aria-hidden="true"
            className="hidden h-full items-center justify-center lg:flex"
          >
            <svg
              className="h-[310px] w-12"
              viewBox="0 0 48 310"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="securityCurveGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#71717a" stopOpacity="0.3" />
                  <stop offset="35%" stopColor="#c9a15a" stopOpacity="0.8" />
                  <stop offset="65%" stopColor="#c9a15a" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#71717a" stopOpacity="0.3" />
                </linearGradient>
              </defs>
              <path
                d="M 14 10 C 44 90, 44 220, 14 300"
                fill="none"
                stroke="url(#securityCurveGrad)"
                strokeWidth="1.5"
              />
            </svg>
          </div>

          {/* Right Column: Security Features List */}
          <div className="space-y-7">
            {SECURITY_POINTS.map((item) => (
              <div key={item.title} className="group relative">
                <h3 className="text-base font-semibold text-zinc-100 transition-colors duration-200 group-hover:text-white">
                  {item.title}
                </h3>
                <p className="mt-1 text-xs leading-relaxed text-zinc-400">
                  {item.detail}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
