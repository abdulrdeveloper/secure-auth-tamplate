import { useCallback, useEffect, useState } from "react";
import { ListState, Panel, formatDate, rowButton, timeAgo } from "../../components/account-layout";
import { ConfirmDialog } from "../../components/modal";
import { useToast } from "../../components/toast";
import { apiRequest, getErrorMessage } from "../../lib/api";

type ConnectedApp = {
  client_id: string;
  name: string;
  description: string | null;
  scopes: string[];
  connected_at: string;
  last_used_at: string | null;
};

function access(scopes: string[]): string {
  const parts = [
    scopes.includes("profile") && "your name",
    scopes.includes("email") && "your email address",
  ].filter(Boolean);
  return parts.length ? `Can see ${parts.join(" and ")}` : "Can confirm it's you";
}

const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();

export function ConnectedApps() {
  const { showError, showSuccess } = useToast();
  const [apps, setApps] = useState<ConnectedApp[] | null>(null);
  const [loadError, setLoadError] = useState(false);
  const [pending, setPending] = useState<ConnectedApp | null>(null);
  const [removing, setRemoving] = useState(false);

  const load = useCallback(async () => {
    try {
      const data = await apiRequest<{ apps: ConnectedApp[] }>("/oauth/grants");
      setApps(data.apps);
      setLoadError(false);
    } catch {
      setLoadError(true);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function remove() {
    if (!pending) return;
    setRemoving(true);
    try {
      await apiRequest(`/oauth/grants/${encodeURIComponent(pending.client_id)}`, { method: "DELETE" });
      setApps((list) => list?.filter((app) => app.client_id !== pending.client_id) ?? null);
      showSuccess(`Removed ${pending.name}'s access.`);
    } catch (error) {
      showError(getErrorMessage(error));
      void load();
    } finally {
      setRemoving(false);
      setPending(null);
    }
  }

  return (
    <Panel
      id="apps-title"
      title="Connected apps"
      description="Apps you've signed in to with Clavis. Remove one to take its access away."
    >
      <ListState
        loading={apps === null}
        failed={loadError}
        empty={apps?.length === 0}
        emptyText="No apps yet. When you sign in to an app with Clavis, it shows up here."
        onRetry={() => void load()}
        what="connected apps"
      />

      {apps && apps.length > 0 && !loadError && (
        <ul className="divide-y divide-zinc-800">
          {apps.map((app) => (
            <li key={app.client_id} className="flex items-center gap-4 px-6 py-4">
              <span
                aria-hidden="true"
                className="grid size-10 shrink-0 place-items-center rounded-xl bg-zinc-800 text-xs font-semibold text-zinc-200"
              >
                {initials(app.name)}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-zinc-100">{app.name}</p>
                <p className="mt-0.5 truncate text-xs text-zinc-500">
                  {access(app.scopes)} · Connected {formatDate(app.connected_at)}
                  {app.last_used_at && ` · Last used ${timeAgo(app.last_used_at)}`}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setPending(app)}
                aria-label={`Remove ${app.name}`}
                className={rowButton}
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}

      <ConfirmDialog
        open={pending !== null}
        title={pending ? `Remove ${pending.name}?` : ""}
        confirmLabel="Remove access"
        busyLabel="Removing..."
        busy={removing}
        onConfirm={() => void remove()}
        onCancel={() => setPending(null)}
      >
        {pending && (
          <>
            <span className="font-medium text-zinc-200">{pending.name}</span> will lose access to your
            account right away. Next time you sign in to it, Clavis will ask for your permission again.
          </>
        )}
      </ConfirmDialog>
    </Panel>
  );
}
