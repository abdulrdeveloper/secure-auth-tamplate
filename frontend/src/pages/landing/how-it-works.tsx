import { Section } from "./section";
import { useReveal } from "./use-reveal";

// The hero already shows the screens, so this section names the four steps
// behind them in plain words. Details match the backend routes.
const STEPS = [
  {
    title: "Your app sends the user to Clavis",
    detail: "A redirect with the client ID, redirect URI and a PKCE challenge.",
  },
  {
    title: "Clavis signs them in",
    detail: "Email and password, then a consent screen naming the app. Trusted apps skip it.",
  },
  {
    title: "Clavis returns a one-time code",
    detail: "The browser goes back to your app with a code that expires in 2 minutes.",
  },
  {
    title: "Your app swaps it for tokens",
    detail: "Your server posts the code and checks the ID token against the public keys.",
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
      <ol ref={ref} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {STEPS.map((step, index) => (
          <li
            key={step.title}
            className="reveal rounded-xl border border-zinc-800 bg-[#0b0b0d] p-5 transition-colors hover:border-zinc-700"
            style={{ transitionDelay: `${index * 80}ms` }}
          >
            <span className="text-sm font-medium text-zinc-500">{index + 1}</span>
            <h3 className="mt-3 text-sm font-semibold text-zinc-50">{step.title}</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-zinc-400">{step.detail}</p>
          </li>
        ))}
      </ol>
    </Section>
  );
}
