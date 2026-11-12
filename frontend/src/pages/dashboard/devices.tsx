import { useCallback, useEffect, useState } from "react";
import { Monitor, Smartphone, Tablet } from "lucide-react";
import { ListState, Panel, formatDate, rowButton, timeAgo } from "../../components/account-layout";
import { ConfirmDialog } from "../../components/modal";
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
    <Panel id="devices-title" title="Your devices" description="Where you're signed in. Don't recognise a device? Sign it out.">
      <ListState
        loading={sessions === null}
        failed={loadError}
        empty={false}
        emptyText=""
        onRetry={() => void load()}
        what="devices"
      />

      {sessions && !loadError && (
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
                    {session.ip} · Signed in {formatDate(session.createdAt)}
                  </p>
                </div>
                {!session.current && (
                  <button
                    type="button"
                    onClick={() => setPending(session)}
                    aria-label={`Sign out ${label(session)}`}
                    className={rowButton}
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
    </Panel>
  );
}
