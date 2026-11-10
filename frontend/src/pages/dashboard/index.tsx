import { useState } from "react";
import { LogOut } from "lucide-react";
import { Logo } from "../../components/auth-layout";
import { useAuth } from "../../context/auth-context";
import { Devices } from "./devices";

export function DashboardPage() {
  const { user, logout } = useAuth();
  const [loggingOut, setLoggingOut] = useState(false);
  const initials = (user?.name ?? "")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  async function handleLogout() {
    setLoggingOut(true);
    await logout();
  }

  return (
    <main className="app-bg min-h-screen">
      <header className="flex h-16 items-center justify-between border-b border-zinc-800 px-6">
        <Logo />
        <button
          onClick={handleLogout}
          disabled={loggingOut}
          className="inline-flex cursor-pointer items-center gap-2 rounded-md px-3 py-1.5 text-sm text-zinc-400 transition-colors hover:bg-zinc-900 hover:text-zinc-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <LogOut size={16} />
          {loggingOut ? "Signing out..." : "Sign out"}
        </button>
      </header>

      <section className="mx-auto max-w-3xl px-6 py-12">
        <h1 className="text-2xl font-semibold text-zinc-50">Welcome back, {user?.name}</h1>
        <p className="mt-1 text-sm text-zinc-400">Manage your Clavis account.</p>

        <div className="mt-8 rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
          <dl className="grid gap-6 sm:grid-cols-2">
            <div className="sm:col-span-2 flex items-center gap-4 border-b border-zinc-800 pb-6">
              <span className="grid size-12 place-items-center rounded-full bg-white text-sm font-semibold text-zinc-950">
                {initials}
              </span>
              <div>
                <p className="text-sm font-medium text-zinc-50">{user?.name}</p>
                <p className="text-xs text-zinc-500">Clavis account</p>
              </div>
            </div>
            <div>
              <dt className="text-xs font-medium text-zinc-500">Name</dt>
              <dd className="mt-1 text-sm text-zinc-100">{user?.name}</dd>
            </div>
            <div>
              <dt className="text-xs font-medium text-zinc-500">Email</dt>
              <dd className="mt-1 flex items-center gap-2 text-sm text-zinc-100">
                {user?.email}
                {user?.isEmailVerified && (
                  <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs font-medium text-zinc-100">
                    Verified
                  </span>
                )}
              </dd>
            </div>
          </dl>
        </div>

        <Devices />
      </section>
    </main>
  );
}
