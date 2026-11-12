import {
  ArrowUpRight,
  ShieldCheck,
  KeyRound,
  Layers,
} from "lucide-react";
import { Section } from "./section";
import { useReveal } from "./use-reveal";

const STEPS = [
  {
    step: "01",
    tag: "Authorization Request",
    title: "Your app sends the user to Clavis",
    detail: "A secure redirect with your Client ID, redirect URI, requested scopes, and a cryptographic PKCE challenge.",
    icon: ArrowUpRight,
  },
  {
    step: "02",
    tag: "Identity & Consent",
    title: "Clavis authenticates & requests consent",
    detail: "User signs in with verified credentials. First-party and trusted applications bypass consent automatically.",
    icon: ShieldCheck,
  },
  {
    step: "03",
    tag: "Authorization Code",
    title: "Clavis returns a one-time code",
    detail: "The browser returns to your callback URL with a temporary authorization code that expires in 120 seconds.",
    icon: KeyRound,
  },
  {
    step: "04",
    tag: "Token Minting",
    title: "Your backend swaps code for tokens",
    detail: "Your server exchanges the code for signed RS256 ID tokens and Access tokens, verified against live JWKS keys.",
    icon: Layers,
  },
];

export function HowItWorks() {
  const ref = useReveal<HTMLDivElement>();

  return (
    <Section
      id="how-it-works"
      kicker="How it works"
      title="The standard authorization code flow."
      lead="Battle-tested OpenID Connect architecture, explained in 4 simple steps."
      band
    >
      <div ref={ref} className="grid gap-5 sm:grid-cols-2">
        {STEPS.map((item, index) => {
          const Icon = item.icon;
          return (
            <div
              key={item.step}
              className="reveal flex flex-col justify-between rounded-xl border border-zinc-800/80 bg-[#0b0b0e] p-6 transition-colors duration-200 hover:border-zinc-700"
              style={{ transitionDelay: `${index * 60}ms` }}
            >
              <div className="flex items-center justify-between">
                <div className="flex size-9 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900/60 text-zinc-300">
                  <Icon size={18} />
                </div>
                <span className="font-mono text-xs font-medium text-zinc-500">
                  {item.step}
                </span>
              </div>

              <div className="mt-6">
                <p className="text-[11px] font-medium uppercase tracking-wider text-zinc-500">
                  {item.tag}
                </p>
                <h3 className="mt-1 text-sm font-semibold text-zinc-100">
                  {item.title}
                </h3>
                <p className="mt-1.5 text-xs leading-relaxed text-zinc-400">
                  {item.detail}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </Section>
  );
}
