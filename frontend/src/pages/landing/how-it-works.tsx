import { Check, Lock } from "lucide-react";
import { type ReactNode, useEffect, useRef, useState } from "react";
import { Section } from "./section";

// Scroll-linked walkthrough without scroll hijacking. Steps scroll normally and
// the sticky panel shows the one nearest the middle of the viewport. Each step is
// also a button, so keyboard users pick a step directly. Under 1024px every step
// carries its own panel instead. Requests and responses match the backend.

function Panel({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="overflow-hidden rounded-xl border border-zinc-800 bg-[#0b0b0d]">
      <p className="border-b border-zinc-800 px-4 py-2.5 font-mono text-[13px] text-zinc-400">{label}</p>
      <div className="p-4 text-[13px] leading-[1.75] text-zinc-300 sm:p-5 sm:text-sm">{children}</div>
    </div>
  );
}

const Dim = ({ children }: { children: ReactNode }) => <span className="text-zinc-400">{children}</span>;
const Key = ({ children }: { children: ReactNode }) => <span className="text-brass">{children}</span>;
const Row = ({ children }: { children: ReactNode }) => (
  <div className="font-mono [overflow-wrap:anywhere]">{children}</div>
);

function RedirectPanel() {
  return (
    <Panel label="Browser → Clavis">
      <Row><span className="text-zinc-50">GET</span> /oauth/authorize</Row>
      <Row><Dim>  ?</Dim>response_type=<Key>code</Key></Row>
      <Row><Dim>  &amp;</Dim>client_id=<Key>notes_app</Key></Row>
      <Row><Dim>  &amp;</Dim>redirect_uri=<Key>https://notes.example.com/callback</Key></Row>
      <Row><Dim>  &amp;</Dim>scope=<Key>openid profile email</Key></Row>
      <Row><Dim>  &amp;</Dim>code_challenge=<Key>E9Melhoa2OwvFrEMTJguCHaoeK1t8URWbuGJSstw-cM</Key></Row>
      <Row><Dim>  &amp;</Dim>code_challenge_method=<Key>S256</Key></Row>
    </Panel>
  );
}

function SignInPanel() {
  return (
    <div className="grid gap-4">
      <div className="rounded-xl border border-zinc-800 bg-[#0b0b0d] p-5">
        <p className="flex items-center gap-2 text-sm font-semibold text-zinc-50">
          <Lock size={15} className="text-brass" aria-hidden="true" />
          Allow access?
        </p>
        <p className="mt-1 text-sm text-zinc-400">Notes · notes_app</p>
        <ul className="mt-4 space-y-2">
          {["Verify your identity", "View your name", "View your email address"].map((scope) => (
            <li key={scope} className="flex items-center gap-2 text-sm text-zinc-300">
              <Check size={15} className="text-zinc-100" aria-hidden="true" />
              {scope}
            </li>
          ))}
        </ul>
      </div>
      <p className="text-sm leading-relaxed text-zinc-400">
        Visitors without a session are sent to sign in first. Apps you mark as trusted skip this
        screen.
      </p>
    </div>
  );
}

function CodePanel() {
  return (
    <Panel label="Clavis → Browser">
      <Row><span className="text-zinc-50">302</span> Location:</Row>
      <Row>
        <Key>https://notes.example.com/callback</Key>
      </Row>
      <Row><Dim>  ?</Dim>code=<Key>8f3c1a7e9b2d4f60a5c8e1b7d3f9a246</Key></Row>
      <Row><Dim>  &amp;</Dim>state=<Key>xyz</Key></Row>
      <p className="mt-4 border-t border-zinc-800 pt-4 font-sans text-zinc-400">
        The code is deleted the moment it is used, and expires after 120 seconds.
      </p>
    </Panel>
  );
}

function TokenPanel() {
  return (
    <div className="grid gap-4">
      <Panel label="POST /oauth/token">
        <Row><Dim>Authorization:</Dim> Basic <Key>base64(client_id:secret)</Key></Row>
        <Row>grant_type=<Key>authorization_code</Key></Row>
        <Row>code=<Key>8f3c1a7e…</Key></Row>
        <Row>code_verifier=<Key>dBjftJeZ4CVP…</Key></Row>
      </Panel>
      <Panel label="200 OK">
        <Row>{"{"}</Row>
        <Row>{"  "}"access_token": <Key>"eyJhbGciOiJSUzI1NiIs…"</Key>,</Row>
        <Row>{"  "}"id_token": <Key>"eyJhbGciOiJSUzI1NiIs…"</Key>,</Row>
        <Row>{"  "}"token_type": <Key>"Bearer"</Key>,</Row>
        <Row>{"  "}"expires_in": <Key>3600</Key></Row>
        <Row>{"}"}</Row>
      </Panel>
    </div>
  );
}

const STEPS = [
  {
    from: "Your app",
    title: "Sends the user to Clavis",
    detail:
      "A redirect carrying the app's client ID, its redirect URI and a PKCE challenge. Nothing secret travels in the URL.",
    panel: <RedirectPanel />,
  },
  {
    from: "Clavis",
    title: "Signs the user in",
    detail:
      "Email and password, then a consent screen that names the app and lists exactly what it is asking for.",
    panel: <SignInPanel />,
  },
  {
    from: "Clavis",
    title: "Sends back a one-time code",
    detail: "The browser returns to your app with a short-lived code, never with the tokens themselves.",
    panel: <CodePanel />,
  },
  {
    from: "Your app",
    title: "Swaps the code for tokens",
    detail:
      "Your server posts the code with its client secret and PKCE verifier, then checks the ID token against the public keys.",
    panel: <TokenPanel />,
  },
];

export function HowItWorks() {
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(Number((entry.target as HTMLElement).dataset.step));
        }
      },
      { rootMargin: "-40% 0px -50% 0px" },
    );
    refs.current.forEach((element) => element && observer.observe(element));
    return () => observer.disconnect();
  }, []);

  return (
    <Section
      id="how-it-works"
      kicker="How it works"
      title="Sign in once. Every app trusts it."
      lead="Clavis follows the standard OpenID Connect authorization code flow, so any OIDC library can talk to it."
      band
    >
      <div className="grid gap-14 lg:grid-cols-2 lg:gap-16">
        <ol className="grid min-w-0 grid-cols-[minmax(0,1fr)] gap-2">
          {STEPS.map((step, index) => {
            const on = index === active;
            return (
              <li
                key={step.title}
                ref={(element) => {
                  refs.current[index] = element;
                }}
                data-step={index}
                className={`min-w-0 border-l-2 py-5 pl-6 transition-colors duration-200 lg:min-h-[220px] ${
                  on ? "border-brass" : "border-zinc-800 max-lg:border-brass/60"
                }`}
              >
                <button
                  type="button"
                  aria-pressed={on}
                  onClick={() => setActive(index)}
                  className="flex min-w-0 cursor-pointer items-baseline gap-4 rounded-md text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brass"
                >
                  <span className={`font-mono text-sm ${on ? "text-brass" : "text-zinc-400"}`}>
                    0{index + 1}
                  </span>
                  <span
                    className={`text-xl font-semibold leading-snug transition-colors duration-200 ${
                      on ? "text-zinc-50" : "text-zinc-400 max-lg:text-zinc-50"
                    }`}
                  >
                    {step.title}
                  </span>
                </button>
                <p className="mt-2 pl-0 text-base leading-relaxed text-zinc-400 sm:pl-9">
                  <span className="mb-1 block font-mono text-[13px] uppercase tracking-[0.14em] text-zinc-400">
                    {step.from}
                  </span>
                  {step.detail}
                </p>
                <div className="mt-5 min-w-0 pl-0 sm:pl-9 lg:hidden">{step.panel}</div>
              </li>
            );
          })}
        </ol>

        <div className="relative hidden lg:block">
          <div
            role="region"
            aria-label={`Step ${active + 1} of ${STEPS.length}: ${STEPS[active].title}`}
            className="sticky top-28"
          >
            <p className="mb-3 font-mono text-[13px] text-zinc-400">
              Step {active + 1} of {STEPS.length}
            </p>
            <div key={active} className="panel-enter">
              {STEPS[active].panel}
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
