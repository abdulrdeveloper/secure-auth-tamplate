import { ArrowUpRight } from "lucide-react";
import { SITE } from "../../config/site";
import { useReveal } from "./use-reveal";

// Every value below is read from the backend config (oidc.config.ts,
// auth.config.ts, the route rate limits). Change them together.
const GROUPS = [
  {
    name: "Tokens",
    rows: [
      ["ID and access tokens", "RS256, valid for 1 hour"],
      ["Public keys", "/.well-known/jwks.json"],
      ["Secret needed to verify a token", "None, the public key is enough"],
    ],
  },
  {
    name: "Authorization",
    rows: [
      ["Authorization code", "Single use, expires in 120 s"],
      ["PKCE", "S256 only, plain is refused"],
      ["Redirect URI", "Exact match with a registered URI"],
      ["Client secrets", "bcrypt hash, shown once"],
    ],
  },
  {
    name: "Accounts",
    rows: [
      ["Passwords", "bcrypt hash"],
      ["Email verification", "Required before first sign-in"],
      ["Verification code", "Expires in 5 min, 5 tries, 60 s between resends"],
      ["Unknown email at sign-in", "Same error and same timing as a wrong password"],
    ],
  },
  {
    name: "Rate limits, per IP",
    rows: [
      ["Sign-in", "10 per 15 min"],
      ["Token endpoint", "30 per min"],
      ["Request body", "10 kB max"],
    ],
  },
];

export function Security() {
  const ref = useReveal<HTMLDivElement>();

  return (
    <section id="security" className="scroll-mt-16 border-t border-zinc-800/80 py-24">
      <div className="mx-auto grid max-w-6xl gap-12 px-6 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Careful with the parts that are easy to get wrong.
          </h2>
          <p className="mt-4 text-zinc-400">
            These are the defaults in the code today, with the real numbers.
          </p>
          <a
            href={`${SITE.githubUrl}/blob/main/SECURITY.md`}
            target="_blank"
            rel="noreferrer"
            className="mt-6 inline-flex items-center gap-1 text-sm font-medium text-zinc-200 transition-colors hover:text-brass"
          >
            Read the security policy
            <ArrowUpRight size={15} />
          </a>
        </div>

        <div ref={ref} className="reveal-group space-y-8">
          {GROUPS.map((group, index) => (
            <div key={group.name} className="reveal" style={{ transitionDelay: `${index * 90}ms` }}>
              <h3 className="font-mono text-[11px] uppercase tracking-[0.2em] text-brass">
                {group.name}
              </h3>
              <dl className="mt-3 divide-y divide-zinc-800/80 border-y border-zinc-800/80">
                {group.rows.map(([label, value]) => (
                  <div key={label} className="grid gap-1 py-3 sm:grid-cols-[1fr_1.2fr] sm:gap-6">
                    <dt className="text-sm text-zinc-400">{label}</dt>
                    <dd className="font-mono text-[13px] text-zinc-100">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
