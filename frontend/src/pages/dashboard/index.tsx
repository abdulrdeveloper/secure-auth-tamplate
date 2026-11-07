import { useState } from "react";
import { LogOut } from "lucide-react";
import { Logo } from "../../components/auth-layout";
import { useAuth } from "../../context/auth-context";

export function DashboardPage() {
  const { user, logout } = useAuth();
  const [loggingOut, setLoggingOut] = useState(false);

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
            <div>
              <dt className="text-xs font-medium text-zinc-500">Name</dt>
              <dd className="mt-1 text-sm text-zinc-100">{user?.name}</dd>
            </div>
            <div>
              <dt className="text-xs font-medium text-zinc-500">Email</dt>
              <dd className="mt-1 flex items-center gap-2 text-sm text-zinc-100">
                {user?.email}
                {user?.isEmailVerified && (
                  <span className="rounded-full bg-blue-500/15 px-2 py-0.5 text-xs font-medium text-blue-400">
                    Verified
                  </span>
                )}
              </dd>
            </div>
          </dl>
        </div>
      </section>
    </main>
  );
}
