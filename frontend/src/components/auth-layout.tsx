import { type ReactNode } from "react";
import { Link, Outlet } from "react-router-dom";
import { SITE } from "../config/site";

export function AuthLayout({ children }: { children?: ReactNode }) {
  return (
    <main className="dot-grid flex min-h-screen items-center justify-center px-4 py-8">
      <div className="w-full max-w-[400px] rounded-2xl border border-zinc-800 bg-zinc-900 p-6 shadow-2xl shadow-black/50 sm:p-8">
        <div className="mb-5 flex justify-center">
          <img src="/logo-mark.png" alt={SITE.name} className="size-12" />
        </div>
        {children ?? <Outlet />}
      </div>
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
