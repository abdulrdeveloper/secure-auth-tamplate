import { Section } from "./section";
import { useReveal } from "./use-reveal";

// Every value is read from the backend config (oidc.config.ts, auth.config.ts,
// the route rate limits). Change them together.
const FACTS = [
  ["ID and access tokens", "RS256, valid for 1 hour"],
  ["Authorization code", "Single use, expires in 120 s"],
  ["PKCE", "S256 only, plain is refused"],
  ["Redirect URI", "Exact match with a registered URI"],
  ["Client secrets", "bcrypt hash, shown once"],
  ["Passwords", "bcrypt hash, email verified before sign-in"],
  ["Unknown email at sign-in", "Same error and timing as a wrong password"],
  ["Rate limits, per IP", "Sign-in 10 per 15 min, token endpoint 30 per min"],
];

export function Security() {
  const ref = useReveal<HTMLDListElement>();

  return (
    <Section
      id="security"
      kicker="Security"
      title="The defaults, with the real numbers."
      lead="Read straight from the code, not a promise."
    >
      <dl
        ref={ref}
        className="reveal grid gap-x-12 border-t border-zinc-800/80 sm:grid-cols-2"
      >
        {FACTS.map(([label, value]) => (
          <div
            key={label}
            className="grid gap-0.5 border-b border-zinc-800/80 py-3 sm:grid-cols-[0.9fr_1.1fr] sm:gap-4"
          >
            <dt className="text-sm text-zinc-400">{label}</dt>
            <dd className="font-mono text-[13px] text-zinc-100">{value}</dd>
          </div>
        ))}
      </dl>
    </Section>
  );
}
