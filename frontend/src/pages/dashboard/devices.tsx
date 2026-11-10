import { useCallback, useEffect, useState } from "react";
import { Monitor, Smartphone, Tablet } from "lucide-react";
import { ConfirmDialog } from "../../components/confirm-dialog";
import { useToast } from "../../components/toast";
import { apiRequest, getErrorMessage } from "../../lib/api";

type Session = {
  id: string;
  device: { browser: string; os: string; type: "desktop" | "mobile" | "tablet" };
  ip: string;
  createdAt: string;
  lastUsedAt: string;
  current: boolean;
};

const ICONS = { desktop: Monitor, mobile: Smartphone, tablet: Tablet };

const label = (s: Session) => `${s.device.browser} on ${s.device.os}`;

function timeAgo(iso: string): string {
  const seconds = Math.max(0, (Date.now() - new Date(iso).getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} h ago`;
  const days = Math.floor(hours / 24);
  return days === 1 ? "yesterday" : `${days} days ago`;
}

const signedInOn = (iso: string) =>
  new Date(iso).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" });

export function Devices() {
  const { showError, showSuccess } = useToast();
  const [sessions, setSessions] = useState<Session[] | null>(null);
  const [loadError, setLoadError] = useState(false);
  const [pending, setPending] = useState<Session | null>(null);
  const [removing, setRemoving] = useState(false);

  const load = useCallback(async () => {
    try {
      const data = await apiRequest<{ sessions: Session[] }>("/auth/sessions");
      setSessions(data.sessions);
      setLoadError(false);
    } catch {
      setLoadError(true);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function disconnect() {
    if (!pending) return;
    setRemoving(true);
    try {
      await apiRequest(`/auth/sessions/${encodeURIComponent(pending.id)}`, { method: "DELETE" });
      setSessions((list) => list?.filter((s) => s.id !== pending.id) ?? null);
      showSuccess(`Signed out of ${label(pending)}.`);
    } catch (error) {
      showError(getErrorMessage(error));
      void load();
    } finally {
      setRemoving(false);
      setPending(null);
    }
  }

  return (
    <section aria-labelledby="devices-title" className="mt-8 rounded-2xl border border-zinc-800 bg-zinc-900">
      <div className="border-b border-zinc-800 px-6 py-5">
        <h2 id="devices-title" className="text-base font-semibold text-zinc-50">
          Your devices
        </h2>
        <p className="mt-1 text-sm text-zinc-400">
          Where you're signed in. Don't recognise a device? Sign it out.
        </p>
      </div>

      {sessions === null && !loadError && (
        <ul aria-busy="true" className="divide-y divide-zinc-800">
          {[0, 1].map((i) => (
            <li key={i} className="flex items-center gap-4 px-6 py-4">
              <span className="size-10 animate-pulse rounded-full bg-zinc-800" />
              <span className="h-4 w-40 animate-pulse rounded bg-zinc-800" />
            </li>
          ))}
        </ul>
      )}

      {loadError && (
        <div className="flex items-center justify-between gap-4 px-6 py-5 text-sm text-zinc-400">
          We couldn't load your devices.
          <button
            type="button"
            onClick={() => void load()}
            className="cursor-pointer rounded-lg border border-zinc-700 px-3 py-1.5 font-medium text-zinc-200 transition-colors hover:bg-zinc-800"
          >
            Try again
          </button>
        </div>
      )}

      {sessions && (
        <ul className="divide-y divide-zinc-800">
          {sessions.map((session) => {
            const Icon = ICONS[session.device.type];
            return (
              <li key={session.id} className="flex items-center gap-4 px-6 py-4">
                <span className="grid size-10 shrink-0 place-items-center rounded-full bg-zinc-800 text-zinc-300">
                  <Icon size={18} aria-hidden="true" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="flex flex-wrap items-center gap-2 text-sm font-medium text-zinc-100">
                    {label(session)}
                    {session.current && (
                      <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-400">
                        This device
                      </span>
                    )}
                  </p>
                  <p className="mt-0.5 truncate text-xs text-zinc-500">
                    {session.current ? "Active now" : `Last active ${timeAgo(session.lastUsedAt)}`} ·{" "}
                    {session.ip} · Signed in {signedInOn(session.createdAt)}
                  </p>
                </div>
                {!session.current && (
                  <button
                    type="button"
                    onClick={() => setPending(session)}
                    aria-label={`Sign out ${label(session)}`}
                    className="shrink-0 cursor-pointer rounded-lg border border-zinc-700 px-3 py-1.5 text-sm font-medium text-zinc-200 transition-colors hover:border-red-500/50 hover:bg-red-500/10 hover:text-red-300"
                  >
                    Sign out
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      )}

      <ConfirmDialog
        open={pending !== null}
        title="Sign out this device?"
        confirmLabel="Sign out"
        busyLabel="Signing out..."
        busy={removing}
        onConfirm={() => void disconnect()}
        onCancel={() => setPending(null)}
      >
        {pending && (
          <>
            <span className="font-medium text-zinc-200">{label(pending)}</span> will be signed out right
            away. Anyone using it will need your password to sign in again.
          </>
        )}
      </ConfirmDialog>
    </section>
  );
}
