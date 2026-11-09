import { ArrowUpRight } from "lucide-react";
import { SITE } from "../../config/site";
import { Section } from "./section";
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
    <Section
      id="security"
      kicker="Security"
      title="Careful with the parts that are easy to get wrong."
      lead={
        <>
          These are the defaults in the code today, with the real numbers.{" "}
          <a
            href={`${SITE.githubUrl}/blob/main/SECURITY.md`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-0.5 font-medium text-zinc-100 underline decoration-zinc-700 underline-offset-4 transition-colors hover:text-brass hover:decoration-brass"
          >
            Read the security policy
            <ArrowUpRight size={16} aria-hidden="true" />
          </a>
        </>
      }
    >
      <div ref={ref} className="reveal-group grid gap-x-16 gap-y-12 lg:grid-cols-2">
        {GROUPS.map((group, index) => (
          <div key={group.name} className="reveal" style={{ transitionDelay: `${index * 80}ms` }}>
            <h3 className="font-mono text-[13px] font-medium uppercase tracking-[0.16em] text-brass">
              {group.name}
            </h3>
            <dl className="mt-4 divide-y divide-zinc-800/80 border-y border-zinc-800/80">
              {group.rows.map(([label, value]) => (
                <div key={label} className="grid gap-1 py-3.5 sm:grid-cols-[1fr_1.15fr] sm:gap-6">
                  <dt className="text-[15px] text-zinc-400">{label}</dt>
                  <dd className="font-mono text-sm text-zinc-100">{value}</dd>
                </div>
              ))}
            </dl>
          </div>
        ))}
      </div>
    </Section>
  );
}
