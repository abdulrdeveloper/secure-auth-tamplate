import { Check, Lock, RotateCcw } from "lucide-react";
import { type ReactNode, useEffect, useState } from "react";
import { SITE } from "../../config/site";

// The hero shows the product itself: the real sign-in and consent screens,
// then the ID token the app receives. Copy and claims match the backend.

const STEP_MS = 4200;

const STEPS = [
  { id: "sign-in", label: "Sign in", url: "auth.example.com/login" },
  { id: "consent", label: "Consent", url: "auth.example.com/consent?client_id=notes_app" },
  { id: "token", label: "ID token", url: "notes.example.com/callback?code=•••" },
] as const;

function Field({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
  return (
    <div>
      <p className="mb-1.5 text-[13px] font-medium text-zinc-300">{label}</p>
      <div
        className={`flex h-9 items-center rounded-md border border-zinc-800 bg-zinc-950 px-3 text-sm text-zinc-100 ${
          mono ? "tracking-[0.3em]" : ""
        }`}
      >
        {value}
      </div>
    </div>
  );
}

function AuthCard({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-[320px]">
      <div className="rounded-xl border border-zinc-800 bg-[#111113] p-5 shadow-2xl shadow-black">
        <img src="/logo-mark.png" alt="" className="mx-auto mb-4 size-9" />
        {children}
      </div>
      <p className="mt-3 text-center text-xs text-zinc-400">Secured by {SITE.name}</p>
    </div>
  );
}

function SignInScreen() {
  return (
    <AuthCard>
      <div className="mb-5 text-center">
        <p className="text-base font-semibold text-zinc-50">Welcome back</p>
        <p className="mt-1 text-[13px] text-zinc-400">Sign in to continue to {SITE.name}.</p>
      </div>
      <div className="space-y-3">
        <Field label="Email address" value="maya@example.com" />
        <Field label="Password" value="••••••••••" mono />
      </div>
      <div className="mt-5 flex h-9 items-center justify-center rounded-lg bg-white text-sm font-semibold text-zinc-950">
        Sign in
      </div>
    </AuthCard>
  );
}

function ConsentScreen() {
  return (
    <AuthCard>
      <div className="mb-4 text-center">
        <p className="text-base font-semibold text-zinc-50">Allow access?</p>
        <p className="mt-1 text-[13px] text-zinc-400">An application is asking to sign you in.</p>
      </div>
      <div className="mb-4 rounded-lg border border-zinc-800 bg-zinc-950 p-3">
        <p className="text-xs font-medium text-zinc-400">Application</p>
        <p className="mt-0.5 text-sm font-semibold text-zinc-100">Notes</p>
        <p className="font-mono text-xs text-zinc-400">notes_app</p>
        <p className="mt-2 text-xs font-medium text-zinc-400">Redirects to</p>
        <p className="mt-0.5 break-all text-[13px] text-zinc-200">https://notes.example.com/callback</p>
      </div>
      <ul className="mb-4 space-y-1.5">
        {["Verify your identity", "View your name", "View your email address"].map((scope) => (
          <li key={scope} className="flex items-center gap-2 text-[13px] text-zinc-200">
            <Check size={14} className="text-zinc-100" />
            {scope}
          </li>
        ))}
      </ul>
      <div className="grid grid-cols-2 gap-2">
        <div className="flex h-9 items-center justify-center rounded-md border border-zinc-700 text-sm text-zinc-200">
          Deny
        </div>
        <div className="flex h-9 items-center justify-center rounded-lg bg-white text-sm font-semibold text-zinc-950">
          Allow
        </div>
      </div>
    </AuthCard>
  );
}

const HEADER = [
  ["alg", '"RS256"'],
  ["kid", '"clavis-key-v1"'],
  ["typ", '"JWT"'],
];

const PAYLOAD = [
  ["iss", '"https://auth.example.com"'],
  ["sub", '"6650f1c2a9e4b1d3c8f0a721"'],
  ["aud", '"notes_app"'],
  ["token_use", '"id_token"'],
  ["name", '"Maya Patel"'],
  ["email", '"maya@example.com"'],
  ["email_verified", "true"],
  ["nonce", '"n-0S6_WzA2Mj"'],
  ["iat", "1794297600"],
  ["exp", "1794301200"],
];

function JsonBlock({ title, rows }: { title: string; rows: string[][] }) {
  return (
    <div>
      <p className="mb-1.5 font-mono text-xs uppercase tracking-[0.16em] text-zinc-400">{title}</p>
      <pre className="overflow-x-auto font-mono text-[13px] leading-[1.7] text-zinc-400">
        {"{\n"}
        {rows.map(([key, value], index) => (
          <span key={key}>
            {"  "}
            <span className="text-zinc-200">"{key}"</span>: <span className="text-brass">{value}</span>
            {index < rows.length - 1 ? ",\n" : "\n"}
          </span>
        ))}
        {"}"}
      </pre>
    </div>
  );
}

function TokenScreen() {
  return (
    <div className="mx-auto w-full max-w-[400px] space-y-4">
      <JsonBlock title="Header" rows={HEADER} />
      <JsonBlock title="Payload" rows={PAYLOAD} />
      <p className="flex flex-wrap items-center gap-x-2 gap-y-1 border-t border-zinc-800 pt-3 text-[13px] text-zinc-400">
        <Lock size={13} className="text-brass" />
        Checked against the public key at
        <span className="font-mono text-zinc-200">/.well-known/jwks.json</span>
      </p>
    </div>
  );
}

const SCREENS = [SignInScreen, ConsentScreen, TokenScreen];

export function ProductDemo() {
  const [active, setActive] = useState(0);
  const [stopped, setStopped] = useState(false);
  const [reducedMotion] = useState(
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  const finished = active === STEPS.length - 1;
  const autoplay = !stopped && !reducedMotion && !finished;

  // Plays through the three screens once, then settles on the ID token.
  // Any click on a tab hands control to the visitor for good.
  useEffect(() => {
    if (!autoplay) return;
    const timer = window.setTimeout(() => setActive((step) => step + 1), STEP_MS);
    return () => window.clearTimeout(timer);
  }, [active, autoplay]);

  function pick(index: number) {
    setStopped(true);
    setActive(index);
  }

  function replay() {
    setStopped(false);
    setActive(0);
  }

  const Screen = SCREENS[active];

  return (
    <div
      className="hero-enter relative w-full min-w-0"
      style={{ animationDelay: "120ms" }}
    >
      <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-[#0b0b0d] shadow-[0_40px_120px_-40px_rgba(201,161,90,0.25)]">
        <div className="flex items-center gap-3 border-b border-zinc-800 px-4 py-3">
          <div className="flex gap-1.5" aria-hidden="true">
            <span className="size-2.5 rounded-full bg-zinc-700" />
            <span className="size-2.5 rounded-full bg-zinc-700" />
            <span className="size-2.5 rounded-full bg-zinc-700" />
          </div>
          <div className="flex h-7 min-w-0 flex-1 items-center gap-2 rounded-md bg-zinc-900 px-3 font-mono text-xs text-zinc-400">
            <Lock size={12} className="shrink-0 text-zinc-500" />
            <span className="truncate">{STEPS[active].url}</span>
          </div>
          {!reducedMotion && (
            <button
              type="button"
              onClick={replay}
              disabled={!finished}
              aria-label="Replay the example"
              className="inline-flex min-h-8 cursor-pointer items-center gap-1.5 rounded-md px-2.5 text-[13px] font-medium text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-zinc-50 disabled:cursor-default disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-zinc-400"
            >
              <RotateCcw size={13} aria-hidden="true" />
              Replay
            </button>
          )}
        </div>

        <div className="relative min-h-[430px] px-5 py-7" aria-live="polite">
          <div key={active} className="demo-enter flex h-full items-center">
            <Screen />
          </div>
        </div>

        <div role="tablist" aria-label="Sign-in flow" className="grid grid-cols-3 border-t border-zinc-800">
          {STEPS.map((step, index) => (
            <button
              key={step.id}
              type="button"
              role="tab"
              aria-selected={index === active}
              onClick={() => pick(index)}
              className={`relative min-h-12 cursor-pointer px-3 py-3 text-left transition-colors ${
                index === active ? "text-zinc-50" : "text-zinc-400 hover:text-zinc-200"
              } ${index > 0 ? "border-l border-zinc-800" : ""}`}
            >
              <span className="font-mono text-xs text-zinc-400">0{index + 1}</span>
              <span className="ml-2 text-sm font-medium">{step.label}</span>
              <span className="absolute inset-x-0 bottom-0 h-px bg-zinc-800">
                {index === active && (
                  <span
                    key={`${active}-${autoplay}`}
                    className={`block h-full bg-brass ${autoplay ? "demo-progress" : "w-full"}`}
                    style={{ animationDuration: `${STEP_MS}ms` }}
                  />
                )}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
