import { AccountLayout } from "../../components/account-layout";
import { useAuth } from "../../context/auth-context";
import { ConnectedApps } from "./connected-apps";
import { Devices } from "./devices";

export function DashboardPage() {
  const { user } = useAuth();
  const initials = (user?.name ?? "")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => [...part][0])
    .join("")
    .toUpperCase();

  return (
    <AccountLayout title={`Welcome back, ${user?.name ?? ""}`} description="Manage your Clavis account.">
      <div className="mt-8 rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
        <dl className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="sm:col-span-2 flex items-center gap-4 border-b border-zinc-800 pb-6">
            <span className="grid size-12 shrink-0 place-items-center rounded-full bg-white text-sm font-semibold text-zinc-950">
              {initials}
            </span>
            <div className="min-w-0">
              <p className="break-words text-sm font-medium text-zinc-50">{user?.name}</p>
              <p className="text-xs text-zinc-500">Clavis account</p>
            </div>
          </div>
          <div className="min-w-0">
            <dt className="text-xs font-medium text-zinc-500">Name</dt>
            <dd className="mt-1 break-words text-sm text-zinc-100">{user?.name}</dd>
          </div>
          <div className="min-w-0">
            <dt className="text-xs font-medium text-zinc-500">Email</dt>
            <dd className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-zinc-100">
              <span className="min-w-0 break-all">{user?.email}</span>
              {user?.isEmailVerified && (
                <span className="shrink-0 rounded-full bg-white/10 px-2 py-0.5 text-xs font-medium text-zinc-100">
                  Verified
                </span>
              )}
            </dd>
          </div>
        </dl>
      </div>

      <ConnectedApps />
      <Devices />
    </AccountLayout>
  );
}
