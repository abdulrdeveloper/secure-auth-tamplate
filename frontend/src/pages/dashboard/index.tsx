import { useState } from "react";
import { CheckCircle2, LoaderCircle, LogOut, UserRound, X } from "lucide-react";
import { Card } from "../../components/ui";
import { Logo } from "../../components/auth-layout";
import { useAuth } from "../../context/auth-context";
import { SITE } from "../../config/site";

export function DashboardPage() {
  const { user, logout } = useAuth();
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  async function handleLogout() {
    setLoggingOut(true);
    await logout();
  }

  return (
    <main className="min-h-screen bg-zinc-950">
      <header className="flex h-[78px] items-center justify-between border-b border-zinc-800 px-6 md:px-[6%]">
        <Logo />
        <button
          className="flex cursor-pointer items-center gap-2 border-0 bg-transparent text-[13px] text-zinc-400 hover:text-zinc-50"
          onClick={() => setShowLogoutDialog(true)}
        >
          <LogOut size={16} /> Sign out
        </button>
      </header>
      <section className="mx-auto my-[55px] w-[calc(100%_-_48px)] md:my-[90px] md:w-[88%] md:max-w-[900px]">
        <p className="text-[11px] font-bold tracking-[.14em] text-zinc-400">
          OVERVIEW
        </p>
        <h1 className="mt-[15px] mb-[7px] text-[clamp(32px,5vw,48px)] font-bold tracking-[-.06em] text-zinc-50">
          Welcome back, {user?.name}.
        </h1>
        <p className="mb-[31px] text-sm leading-relaxed text-zinc-400">
          Here is a quick overview of your account.
        </p>
        <div className="mt-[42px] grid grid-cols-1 md:grid-cols-[1.2fr_.8fr] gap-4">
          <Card className="relative flex items-center gap-[15px]">
            <div className="grid size-[52px] shrink-0 place-items-center rounded-full bg-zinc-800 text-lime-300">
              <UserRound size={24} />
            </div>
            <div>
              <span className="text-[11px] font-bold tracking-[.14em] text-zinc-400">
                USER PROFILE
              </span>
              <h3 className="mt-[7px] mb-[3px] text-lg font-semibold text-zinc-50">
                {user?.name}
              </h3>
              <p className="m-0 text-[13px] text-zinc-500">
                {user?.email}
              </p>
            </div>
            <CheckCircle2 className="ml-auto shrink-0 text-lime-300" size={20} />
          </Card>
          <Card>
            <span className="text-[11px] font-bold tracking-[.14em] text-zinc-400">
              ACCOUNT STATUS
            </span>
            <div className="mt-[17px] mb-[9px] flex items-center gap-2 text-base font-semibold text-zinc-50">
              <span className="size-2 rounded-full bg-lime-300" /> Email
              verified
            </div>
            <p className="m-0 text-[13px] text-zinc-500">
              Your account is ready to use.
            </p>
          </Card>
        </div>
        <p className="mt-6 text-center text-xs leading-relaxed text-zinc-500">
          Use this auth template in your own website or{" "}
          <a
            className="text-lime-300 underline decoration-lime-300/40 underline-offset-2 hover:decoration-lime-300"
            href={SITE.issuesUrl}
            target="_blank"
            rel="noreferrer"
          >
            open an issue
          </a>{" "}
          if you find a problem.{" "}
          <a
            className="text-lime-300 underline decoration-lime-300/40 underline-offset-2 hover:decoration-lime-300"
            href={SITE.repoUrl}
            target="_blank"
            rel="noreferrer"
          >
            View the repository
          </a>
          .
        </p>
      </section>
      {showLogoutDialog && (
        <div
          className="fixed inset-0 z-10 grid place-items-center bg-black/70 p-6 backdrop-blur-sm"
          role="presentation"
        >
          <div
            className="relative w-full max-w-[380px] rounded-[14px] border border-zinc-700 bg-zinc-900 p-[30px] text-center shadow-[0_24px_80px_rgba(0,0,0,.45)]"
            role="dialog"
            aria-modal="true"
            aria-labelledby="logout-title"
          >
            <button
              className="absolute right-3.5 top-3.5 grid size-[30px] cursor-pointer place-items-center rounded-md border-0 bg-transparent text-zinc-400 hover:bg-zinc-800 hover:text-zinc-50"
              aria-label="Close logout confirmation"
              onClick={() => setShowLogoutDialog(false)}
            >
              <X size={18} />
            </button>
            <div className="mx-auto mb-[18px] grid size-12 place-items-center rounded-full bg-zinc-800 text-lime-300">
              <LogOut size={22} />
            </div>
            <h2
              id="logout-title"
              className="mb-2 text-[22px] font-bold tracking-[-.04em] text-zinc-50"
            >
              Sign out?
            </h2>
            <p className="m-0 text-sm leading-relaxed text-zinc-400">
              Are you sure you want to sign out of your account?
            </p>
            <div className="mt-[26px] flex gap-2.5">
              <button
                className="h-[42px] flex-1 cursor-pointer rounded-xl border border-zinc-700/80 bg-zinc-800/80 text-[13px] font-semibold text-zinc-300 transition-all duration-200 hover:border-zinc-600 hover:bg-zinc-700/80 active:scale-[0.985]"
                onClick={() => setShowLogoutDialog(false)}
              >
                Cancel
              </button>
              <button
                className="group relative flex h-[42px] flex-1 cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-xl border border-lime-200/50 bg-gradient-to-b from-lime-300 via-lime-300 to-lime-400 text-[13px] font-semibold text-zinc-950 shadow-[inset_0_1px_0_rgba(255,255,255,0.45),0_0_15px_-2px_rgba(190,242,100,0.3)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_0_24px_rgba(190,242,100,0.45)] active:translate-y-0 active:scale-[0.985] disabled:opacity-70"
                onClick={handleLogout}
                disabled={loggingOut}
              >
                <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/35 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full" />
                <span className="relative z-10 flex items-center gap-2">
                  {loggingOut && (
                    <LoaderCircle className="animate-spin" size={16} />
                  )}
                  <span>{loggingOut ? "Signing out" : "Sign out"}</span>
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
