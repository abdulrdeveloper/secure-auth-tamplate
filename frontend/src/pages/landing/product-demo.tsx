import { Check } from "lucide-react";
import { type ReactNode, useEffect, useState } from "react";
import { LogoMark } from "../../components/auth-layout";

// The hero shows what a person actually sees when an app uses Clavis:
// sign in, allow the app, and land back in the app signed in.
// All three screens share one card size, so the window never changes shape.

const STEP_MS = 4200;

const STEPS = [
  { id: "sign-in", label: "Sign in", url: "auth.example.com/login" },
  { id: "consent", label: "Allow access", url: "auth.example.com/consent" },
  { id: "done", label: "Signed in", url: "notes.example.com" },
] as const;

function Field({ label, value, secret = false }: { label: string; value: string; secret?: boolean }) {
  return (
    <div>
      <p className="mb-1 text-xs text-zinc-400">{label}</p>
      <div
        className={`flex h-9 items-center rounded-lg border border-zinc-800 bg-zinc-950 px-3 text-[13px] text-zinc-100 ${
          secret ? "tracking-[0.25em]" : ""
        }`}
      >
        {value}
      </div>
    </div>
  );
}

function Button({ children, primary = false }: { children: ReactNode; primary?: boolean }) {
  return (
    <div
      className={`flex h-9 items-center justify-center rounded-lg text-[13px] font-medium ${
        primary ? "bg-white text-zinc-950" : "border border-zinc-800 text-zinc-300"
      }`}
    >
      {children}
    </div>
  );
}

function Account() {
  return (
    <div className="flex items-center gap-2.5 rounded-full border border-zinc-800 py-1 pl-1 pr-3">
      <span className="flex size-6 items-center justify-center rounded-full bg-zinc-800 text-[10px] font-medium text-zinc-200">
        MP
      </span>
      <span className="truncate text-xs text-zinc-300">maya@example.com</span>
    </div>
  );
}

function Card({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-[352px] w-[256px] flex-col justify-center rounded-2xl border border-zinc-800 bg-[#111113] px-5 py-6">
      {children}
    </div>
  );
}

function Title({ title, sub }: { title: string; sub: string }) {
  return (
    <div className="text-center">
      <LogoMark className="mx-auto size-7" />
      <p className="mt-3 text-base font-medium text-zinc-50">{title}</p>
      <p className="mt-1 text-xs text-zinc-400">{sub}</p>
    </div>
  );
}

function SignInScreen() {
  return (
    <Card>
      <Title title="Sign in" sub="to continue to Notes" />
      <div className="mt-5 space-y-2.5">
        <Field label="Email" value="maya@example.com" />
        <Field label="Password" value="••••••••••" secret />
      </div>
      <p className="mt-2.5 text-right text-xs text-zinc-400">Forgot password?</p>
      <div className="mt-4">
        <Button primary>Sign in</Button>
      </div>
    </Card>
  );
}

function ConsentScreen() {
  return (
    <Card>
      <Title title="Notes wants access" sub="to your Clavis account" />
      <div className="mt-5 flex justify-center">
        <Account />
      </div>
      <ul className="mt-5 space-y-2.5 border-t border-zinc-800 pt-5">
        {["See your name", "See your email address"].map((scope) => (
          <li key={scope} className="flex items-center gap-2.5 text-[13px] text-zinc-300">
            <Check size={14} className="shrink-0 text-zinc-500" />
            {scope}
          </li>
        ))}
      </ul>
      <div className="mt-6 grid grid-cols-2 gap-2">
        <Button>Cancel</Button>
        <Button primary>Allow</Button>
      </div>
    </Card>
  );
}

function DoneScreen() {
  return (
    <Card>
      <div className="text-center">
        <span className="mx-auto flex size-12 items-center justify-center rounded-full bg-zinc-800 text-sm font-medium text-zinc-100">
          MP
        </span>
        <p className="mt-4 text-base font-medium text-zinc-50">Welcome, Maya</p>
        <p className="mt-1 text-xs text-zinc-400">You're signed in to Notes.</p>
      </div>
      <div className="mt-6 flex items-center justify-center gap-2 text-xs text-zinc-400">
        <span className="flex size-4 items-center justify-center rounded-full bg-emerald-500/15">
          <Check size={10} className="text-emerald-400" />
        </span>
        Signed in with Clavis
      </div>
      <div className="mt-6">
        <Button primary>Open Notes</Button>
      </div>
    </Card>
  );
}

const SCREENS = [SignInScreen, ConsentScreen, DoneScreen];

export function ProductDemo() {
  const [active, setActive] = useState(0);
  // Bumped on every tab click so the timer and progress bar restart.
  const [cycle, setCycle] = useState(0);
  const [reducedMotion] = useState(
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  const autoplay = !reducedMotion;

  // Loops Sign in → Allow access → Signed in → Sign in, forever.
  useEffect(() => {
    if (!autoplay) return;
    const timer = window.setTimeout(
      () => setActive((step) => (step + 1) % STEPS.length),
      STEP_MS,
    );
    return () => window.clearTimeout(timer);
  }, [active, cycle, autoplay]);

  function pick(index: number) {
    setActive(index);
    setCycle((c) => c + 1);
  }

  const Screen = SCREENS[active];

  return (
    <div className="hero-enter w-full min-w-0" style={{ animationDelay: "120ms" }}>
      <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-[#0b0b0d] shadow-2xl shadow-black/60">
        <div className="flex items-center gap-3 border-b border-zinc-800/80 px-4 py-2.5">
          <div className="flex gap-1.5" aria-hidden="true">
            <span className="size-2.5 rounded-full bg-zinc-800" />
            <span className="size-2.5 rounded-full bg-zinc-800" />
            <span className="size-2.5 rounded-full bg-zinc-800" />
          </div>
          <div className="flex h-7 min-w-0 flex-1 items-center justify-center rounded-md bg-zinc-900/80 px-3 text-xs text-zinc-500">
            <span className="truncate">{STEPS[active].url}</span>
          </div>
          <div className="w-[42px]" aria-hidden="true" />
        </div>

        <div className="flex h-[416px] items-center justify-center px-6" aria-live="polite">
          <div key={active} className="panel-enter">
            <Screen />
          </div>
        </div>

        <div role="tablist" aria-label="Sign-in flow" className="grid grid-cols-3 border-t border-zinc-800/80">
          {STEPS.map((step, index) => (
            <button
              key={step.id}
              type="button"
              role="tab"
              aria-selected={index === active}
              onClick={() => pick(index)}
              className={`relative h-11 cursor-pointer text-[13px] transition-colors ${
                index === active ? "text-zinc-100" : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              {step.label}
              <span className="absolute inset-x-4 bottom-0 h-px overflow-hidden bg-zinc-800/80">
                {index === active && (
                  <span
                    key={`${active}-${cycle}`}
                    className={`block h-full bg-zinc-300 ${autoplay ? "demo-progress" : "w-full"}`}
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
