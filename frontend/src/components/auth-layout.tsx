import { Fingerprint, ShieldCheck } from "lucide-react";
import { type ReactNode } from "react";
import { Link, Outlet } from "react-router-dom";

export function AuthLayout({ children }: { children?: ReactNode }) {
  return (
    <main className="min-h-screen md:grid md:grid-cols-[.9fr_1.1fr]">
      <aside className="hidden flex-col border-r border-zinc-800 bg-zinc-900/70 px-[8%] py-10 md:flex">
        <Logo />
        <div className="my-auto">
          <p className="text-[11px] font-bold tracking-[.14em] text-zinc-400">
            PRIVATE BY DESIGN
          </p>
          <h1 className="my-[18px] text-[clamp(42px,5vw,68px)] leading-[.98] tracking-[-.06em]">
            Your account,
            <br />
            <em className="font-display text-lime-300">protected.</em>
          </h1>
          <p className="max-w-[270px] text-[15px] leading-relaxed text-zinc-400">
            Simple, secure authentication for everything that matters.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-zinc-500">
          <Fingerprint size={17} /> Built with security at every layer
        </div>
      </aside>
      <section className="grid min-h-screen place-items-center bg-zinc-950 px-6 py-7 md:min-h-0 md:px-[8%] md:py-10">
        <div className="mb-[50px] md:hidden">
          <Logo />
        </div>
        <div className="w-full max-w-[390px]">{children ?? <Outlet />}</div>
      </section>
    </main>
  );
}

export function Logo() {
  return (
    <Link
      to="/login"
      className="flex items-center gap-3 text-lg font-bold tracking-[-.04em]"
    >
      <span className="grid size-9 place-items-center rounded-[10px] bg-lime-300 text-zinc-950">
        <ShieldCheck size={20} />
      </span>
      <span>
        secure<span className="text-zinc-500">auth</span>
      </span>
    </Link>
  );
}

export function AuthHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <>
      <p className="text-[11px] font-bold tracking-[.14em] text-zinc-400">
        {eyebrow}
      </p>
      <h2 className="mt-3.5 mb-[7px] text-[31px] font-bold tracking-[-.05em] text-zinc-50">
        {title}
      </h2>
      <p className="mb-[31px] text-sm leading-relaxed text-zinc-400">
        {description}
      </p>
    </>
  );
}
