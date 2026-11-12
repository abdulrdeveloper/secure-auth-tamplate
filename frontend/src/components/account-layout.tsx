import { useState, type ReactNode } from "react";
import { NavLink } from "react-router-dom";
import { LogOut } from "lucide-react";
import { Logo } from "./auth-layout";
import { ConfirmDialog } from "./modal";
import { useAuth } from "../context/auth-context";

const LINKS = [
  { to: "/dashboard", label: "Account" },
  { to: "/developers", label: "Developers" },
];

export function AccountLayout({ title, description, children }: { title: string; description: string; children: ReactNode }) {
  const { logout } = useAuth();
  const [confirmingLogout, setConfirmingLogout] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  async function handleLogout() {
    setLoggingOut(true);
    await logout();
  }

  return (
    <main className="app-bg min-h-screen">
      <header className="flex h-16 items-center justify-between gap-4 border-b border-zinc-800 px-6">
        <div className="flex items-center gap-6">
          <Logo />
          <nav aria-label="Account" className="flex items-center gap-1">
            {LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `rounded-md px-3 py-1.5 text-sm transition-colors ${
                    isActive ? "bg-zinc-900 text-zinc-50" : "text-zinc-400 hover:text-zinc-100"
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
        </div>
        <button
          onClick={() => setConfirmingLogout(true)}
          className="inline-flex shrink-0 cursor-pointer items-center gap-2 rounded-md px-3 py-1.5 text-sm text-zinc-400 transition-colors hover:bg-zinc-900 hover:text-zinc-50"
        >
          <LogOut size={16} />
          <span className="hidden sm:inline">Sign out</span>
        </button>
      </header>

      <ConfirmDialog
        open={confirmingLogout}
        title="Sign out?"
        confirmLabel="Sign out"
        busyLabel="Signing out..."
        busy={loggingOut}
        onConfirm={() => void handleLogout()}
        onCancel={() => setConfirmingLogout(false)}
      >
        Are you sure you want to sign out of your account?
      </ConfirmDialog>

      <section className="mx-auto max-w-3xl px-6 py-12">
        <h1 className="text-2xl font-semibold text-zinc-50">{title}</h1>
        <p className="mt-1 text-sm text-zinc-400">{description}</p>
        {children}
      </section>
    </main>
  );
}

export function Panel({
  id,
  title,
  description,
  action,
  children,
}: {
  id: string;
  title: string;
  description: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section aria-labelledby={id} className="mt-8 rounded-2xl border border-zinc-800 bg-zinc-900">
      <div className="flex items-start justify-between gap-4 border-b border-zinc-800 px-6 py-5">
        <div>
          <h2 id={id} className="text-base font-semibold text-zinc-50">
            {title}
          </h2>
          <p className="mt-1 text-sm text-zinc-400">{description}</p>
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

export function ListState({
  loading,
  failed,
  empty,
  emptyText,
  onRetry,
  what,
}: {
  loading: boolean;
  failed: boolean;
  empty: boolean;
  emptyText: string;
  onRetry: () => void;
  what: string;
}) {
  if (failed) {
    return (
      <div className="flex items-center justify-between gap-4 px-6 py-5 text-sm text-zinc-400">
        We couldn't load your {what}.
        <button
          type="button"
          onClick={onRetry}
          className="cursor-pointer rounded-lg border border-zinc-700 px-3 py-1.5 font-medium text-zinc-200 transition-colors hover:bg-zinc-800"
        >
          Try again
        </button>
      </div>
    );
  }
  if (loading) {
    return (
      <ul aria-busy="true" className="divide-y divide-zinc-800">
        {[0, 1].map((i) => (
          <li key={i} className="flex items-center gap-4 px-6 py-4">
            <span className="size-10 animate-pulse rounded-full bg-zinc-800" />
            <span className="h-4 w-40 animate-pulse rounded bg-zinc-800" />
          </li>
        ))}
      </ul>
    );
  }
  if (empty) return <p className="px-6 py-6 text-sm text-zinc-500">{emptyText}</p>;
  return null;
}

export const rowButton =
  "shrink-0 cursor-pointer rounded-lg border border-zinc-700 px-3 py-1.5 text-sm font-medium text-zinc-200 transition-colors hover:border-red-500/50 hover:bg-red-500/10 hover:text-red-300";

export function timeAgo(iso: string): string {
  const seconds = Math.max(0, (Date.now() - new Date(iso).getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} h ago`;
  const days = Math.floor(hours / 24);
  return days === 1 ? "yesterday" : `${days} days ago`;
}

export const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" });
