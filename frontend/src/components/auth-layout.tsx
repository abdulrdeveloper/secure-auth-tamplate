import { type ReactNode } from "react";
import { Link, Outlet } from "react-router-dom";
import { SITE } from "../config/site";
import { CircuitBackground } from "./circuit-background";

export function AuthLayout({ children }: { children?: ReactNode }) {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-zinc-950 px-4 py-12">
      <CircuitBackground />
      <div className="relative w-full max-w-[340px] rounded-2xl border border-zinc-800 bg-zinc-900/95 p-7 shadow-2xl shadow-black/50">
        <div className="mb-6 flex justify-center">
          <img src="/logo-mark.png" alt={SITE.name} className="size-12" />
        </div>
        {children ?? <Outlet />}
      </div>
      <p className="relative mt-6 text-xs text-zinc-600">Secured by {SITE.name}</p>
    </main>
  );
}

export function Logo({ to = "/" }: { to?: string }) {
  return (
    <Link to={to} className="flex items-center gap-2.5">
      <img src="/logo-mark.png" alt="" className="size-7" />
      <span className="font-brand text-sm tracking-[0.28em] text-zinc-50">
        {SITE.name.toUpperCase()}
      </span>
    </Link>
  );
}

export function AuthHeader({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <header className="mb-6 text-center">
      <h1 className="text-lg font-semibold text-zinc-50">{title}</h1>
      <p className="mt-1 text-sm text-zinc-400">{description}</p>
    </header>
  );
}
