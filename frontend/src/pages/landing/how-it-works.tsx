import { Section } from "./section";
import { useReveal } from "./use-reveal";

// The hero already shows the screens, so this section only names the four
// requests behind them. Endpoints match the backend routes.
const STEPS = [
  {
    title: "Your app sends the user to Clavis",
    detail: "A redirect with the client ID, redirect URI and a PKCE challenge.",
    endpoint: "GET /oauth/authorize",
  },
  {
    title: "Clavis signs them in",
    detail: "Email and password, then a consent screen naming the app. Trusted apps skip it.",
    endpoint: "/login → /consent",
  },
  {
    title: "Clavis returns a one-time code",
    detail: "The browser goes back to your app with a code that expires in 2 minutes.",
    endpoint: "302 → redirect_uri?code=…",
  },
  {
    title: "Your app swaps it for tokens",
    detail: "Your server posts the code and checks the ID token against the public keys.",
    endpoint: "POST /oauth/token",
  },
];

export function HowItWorks() {
  const ref = useReveal<HTMLOListElement>();

  return (
    <Section
      id="how-it-works"
      kicker="How it works"
      title="The standard authorization code flow."
      lead="Any OpenID Connect library can run it."
      band
    >
      <ol ref={ref} className="reveal-group grid gap-x-8 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
        {STEPS.map((step, index) => (
          <li
            key={step.title}
            className="reveal border-t border-zinc-800 pt-4"
            style={{ transitionDelay: `${index * 80}ms` }}
          >
            <span className="font-mono text-xs text-brass">0{index + 1}</span>
            <h3 className="mt-2 text-sm font-semibold text-zinc-50">{step.title}</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-zinc-400">{step.detail}</p>
            <code className="mt-3 inline-block font-mono text-xs text-zinc-300">{step.endpoint}</code>
          </li>
        ))}
      </ol>
    </Section>
  );
}
