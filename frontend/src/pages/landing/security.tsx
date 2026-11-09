import { Section } from "./section";
import { useReveal } from "./use-reveal";

// Four groups, every value read from the backend config (oidc.config.ts,
// auth.config.ts, the route rate limits). Change them together.
const GROUPS = [
  {
    name: "Tokens",
    facts: [
      ["Signing", "RS256"],
      ["Token validity", "1 hour"],
      ["App needs to verify", "Public key only"],
    ],
  },
  {
    name: "Authorization",
    facts: [
      ["Auth code", "Single use, 120 s"],
      ["PKCE", "S256 only"],
      ["Client secret", "bcrypt, shown once"],
    ],
  },
  {
    name: "Accounts",
    facts: [
      ["Passwords", "bcrypt hash"],
      ["Email", "Verified before sign-in"],
      ["Unknown email", "Same timing as wrong password"],
    ],
  },
  {
    name: "Rate limits, per IP",
    facts: [
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
      title="The defaults, with the real numbers."
      lead="Read straight from the code, not a promise."
    >
      <div ref={ref} className="reveal overflow-hidden rounded-2xl border border-zinc-800">
        <div className="grid gap-px bg-zinc-800/80 sm:grid-cols-2">
          {GROUPS.map((group) => (
            <div key={group.name} className="bg-[#0a0a0c] p-6 sm:p-7">
              <h3 className="text-sm font-medium text-zinc-200">
                {group.name}
              </h3>
              <dl className="mt-4 space-y-3">
                {group.facts.map(([label, value]) => (
                  <div key={label} className="flex items-baseline justify-between gap-4">
                    <dt className="shrink-0 text-sm text-zinc-400">{label}</dt>
                    <dd className="text-right text-sm text-zinc-100">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}
