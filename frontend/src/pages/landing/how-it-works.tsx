import { useReveal } from "./use-reveal";

const STEPS = [
  {
    from: "Your app",
    title: "Sends the user to Clavis",
    detail: "A redirect with the app's client ID, its redirect URI and a PKCE challenge.",
    endpoint: "GET /oauth/authorize",
  },
  {
    from: "Clavis",
    title: "Signs the user in",
    detail: "Email and password, then a consent screen that names the app and the data it asks for.",
    endpoint: "/login → /consent",
  },
  {
    from: "Clavis",
    title: "Sends back a one-time code",
    detail: "The code works once and expires after 2 minutes.",
    endpoint: "302 → redirect_uri?code=…",
  },
  {
    from: "Your app",
    title: "Swaps the code for tokens",
    detail: "Then checks the ID token's signature against Clavis's public keys.",
    endpoint: "POST /oauth/token",
  },
];

export function HowItWorks() {
  const ref = useReveal<HTMLOListElement>();

  return (
    <section id="how-it-works" className="scroll-mt-16 border-t border-zinc-800/80 py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="max-w-xl">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Sign in once. Every app trusts it.
          </h2>
          <p className="mt-4 text-zinc-400">
            Clavis follows the standard OpenID Connect authorization code flow, so any OIDC
            library can talk to it.
          </p>
        </div>

        <ol ref={ref} className="reveal-group relative mt-14 grid gap-10 md:grid-cols-4 md:gap-6">
          <span
            aria-hidden="true"
            className="reveal-line absolute left-0 top-[7px] hidden h-px w-full bg-gradient-to-r from-brass/60 via-zinc-700 to-zinc-800 md:block"
          />
          {STEPS.map((step, index) => (
            <li
              key={step.title}
              className="reveal relative md:pt-8"
              style={{ transitionDelay: `${index * 120}ms` }}
            >
              <span className="absolute left-0 top-0 hidden size-[15px] rounded-full border border-brass bg-[#050506] md:block" />
              <p className="font-mono text-xs uppercase tracking-[0.18em] text-zinc-500">
                {String(index + 1).padStart(2, "0")} · {step.from}
              </p>
              <h3 className="mt-3 text-lg font-semibold text-zinc-50">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-400">{step.detail}</p>
              <code className="mt-4 inline-block rounded-md border border-zinc-800 bg-zinc-900/60 px-2 py-1 font-mono text-[11px] text-zinc-300">
                {step.endpoint}
              </code>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
