import { type ReactNode } from "react";
import { Link, Outlet } from "react-router-dom";
import { SITE } from "../config/site";
import logoMarkUrl from "../assets/logo-mark.png";

export function LogoMark({ alt = "", className = "" }: { alt?: string; className?: string }) {
  return (
    <img
      src={logoMarkUrl}
      alt={alt}
      width={132}
      height={160}
      decoding="async"
      className={`object-contain ${className}`}
    />
  );
}

export function AuthLayout({ children }: { children?: ReactNode }) {
  return (
    <main className="app-bg flex min-h-screen items-center justify-center px-4 py-8">
      <div className="flex w-full max-w-[400px] flex-col items-center">
        <div className="w-full rounded-2xl border border-zinc-800 bg-[#111113] p-6 shadow-2xl shadow-black sm:p-8">
          <div className="mb-5 flex justify-center">
            <LogoMark alt={SITE.name} className="size-12" />
          </div>
          {children ?? <Outlet />}
        </div>
        <p className="mt-6 text-xs text-zinc-500">Secured by {SITE.name}</p>
      </div>
    </main>
  );
}

export function Logo({ to = "/" }: { to?: string }) {
  return (
    <Link to={to} className="flex items-center gap-2.5">
      <LogoMark className="size-7" />
      <span className="font-brand text-sm font-extrabold tracking-[0.1em] text-zinc-50">
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
