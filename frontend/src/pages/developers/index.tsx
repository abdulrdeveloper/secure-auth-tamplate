import { useCallback, useEffect, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { AlertTriangle, Plus } from "lucide-react";
import { AccountLayout, ListState, Panel, formatDate, rowButton } from "../../components/account-layout";
import { CopyButton } from "../../components/copy-button";
import { ConfirmDialog, Modal, buttonStyles } from "../../components/modal";
import { useToast } from "../../components/toast";
import { Input, Label } from "../../components/ui";
import { API_ORIGIN, apiRequest, getErrorMessage } from "../../lib/api";

type App = {
  client_id: string;
  name: string;
  redirect_uris: string[];
  description?: string;
  created_at: string;
};

type Created = App & { client_secret: string };

function Value({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-medium text-zinc-500">{label}</p>
      <div className="mt-1 flex items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-950 py-1 pl-3 pr-1">
        <code className="min-w-0 flex-1 truncate font-mono text-[13px] text-zinc-100">{value}</code>
        <CopyButton text={value} />
      </div>
    </div>
  );
}

function NewAppForm({ onCreated, onCancel }: { onCreated: (app: Created) => void; onCancel: () => void }) {
  const [name, setName] = useState("");
  const [uris, setUris] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    const redirectUris = uris.split(/\s+/).filter(Boolean);
    if (redirectUris.length === 0) {
      setError("Add at least one redirect URL.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const created = await apiRequest<Created>("/oauth/clients", {
        method: "POST",
        data: { name, redirectUris, ...(description.trim() && { description: description.trim() }) },
      });
      onCreated(created);
    } catch (err) {
      setError(getErrorMessage(err));
      setSaving(false);
    }
  }

  return (
    <form onSubmit={submit} className="mt-5 space-y-4">
      <div>
        <Label htmlFor="app-name">App name</Label>
        <Input id="app-name" required maxLength={100} placeholder="Notes" value={name} onChange={(e) => setName(e.target.value)} />
        <p className="mt-1.5 text-xs text-zinc-500">Users see this on the consent screen.</p>
      </div>
      <div>
        <Label htmlFor="app-uris">Redirect URLs</Label>
        <textarea
          id="app-uris"
          required
          rows={3}
          placeholder="https://notes.example.com/callback"
          value={uris}
          onChange={(e) => setUris(e.target.value)}
          className="w-full resize-none rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 font-mono text-[13px] text-zinc-50 outline-none transition-colors placeholder:text-zinc-500 focus:border-zinc-400 focus:ring-2 focus:ring-zinc-500/30"
        />
        <p className="mt-1.5 text-xs text-zinc-500">
          One per line. Must be https, except http://localhost while developing.
        </p>
      </div>
      <div>
        <Label htmlFor="app-description">Description (optional)</Label>
        <Input
          id="app-description"
          maxLength={500}
          placeholder="Take notes anywhere"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      {error && (
        <p role="alert" className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
          {error}
        </p>
      )}
      <div className="flex justify-end gap-2 pt-2">
        <button type="button" onClick={onCancel} disabled={saving} className={buttonStyles.secondary}>
          Cancel
        </button>
        <button type="submit" disabled={saving} className={buttonStyles.primary}>
          {saving ? "Creating..." : "Create app"}
        </button>
      </div>
    </form>
  );
}

export function DevelopersPage() {
  const { showError, showSuccess } = useToast();
  const [apps, setApps] = useState<App[] | null>(null);
  const [loadError, setLoadError] = useState(false);
  const [issuer, setIssuer] = useState(API_ORIGIN);
  const [creating, setCreating] = useState(false);
  const [created, setCreated] = useState<Created | null>(null);
  const [pending, setPending] = useState<App | null>(null);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async () => {
    try {
      const data = await apiRequest<{ clients: App[] }>("/oauth/clients");
      setApps(data.clients);
      setLoadError(false);
    } catch {
      setLoadError(true);
    }
  }, []);

  useEffect(() => {
    void load();
    // Show the issuer the server really uses, not a guess.
    fetch(`${API_ORIGIN}/.well-known/openid-configuration`)
      .then((r) => r.json())
      .then((doc: { issuer?: string }) => doc.issuer && setIssuer(doc.issuer))
      .catch(() => undefined);
  }, [load]);

  function onCreated(app: Created) {
    setCreating(false);
    setCreated(app);
    setApps((list) => [app, ...(list ?? [])]);
  }

  async function remove() {
    if (!pending) return;
    setDeleting(true);
    try {
      await apiRequest(`/oauth/clients/${encodeURIComponent(pending.client_id)}`, { method: "DELETE" });
      setApps((list) => list?.filter((app) => app.client_id !== pending.client_id) ?? null);
      showSuccess(`Deleted ${pending.name}.`);
    } catch (error) {
      showError(getErrorMessage(error));
      void load();
    } finally {
      setDeleting(false);
      setPending(null);
    }
  }

  return (
    <AccountLayout title="Developers" description="Register apps that sign their users in with Clavis.">
      <Panel
        id="apps-list-title"
        title="Your apps"
        description="Each app gets its own client ID and secret."
        action={
          <button type="button" onClick={() => setCreating(true)} className={`${buttonStyles.primary} inline-flex shrink-0 items-center gap-1.5`}>
            <Plus size={15} aria-hidden="true" />
            New app
          </button>
        }
      >
        <ListState
          loading={apps === null}
          failed={loadError}
          empty={apps?.length === 0}
          emptyText="No apps yet. Create one to get a client ID and secret."
          onRetry={() => void load()}
          what="apps"
        />
        {apps && apps.length > 0 && !loadError && (
          <ul className="divide-y divide-zinc-800">
            {apps.map((app) => (
              <li key={app.client_id} className="px-6 py-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-zinc-100">{app.name}</p>
                    <p className="mt-0.5 text-xs text-zinc-500">Created {formatDate(app.created_at)}</p>
                  </div>
                  <button type="button" onClick={() => setPending(app)} aria-label={`Delete ${app.name}`} className={rowButton}>
                    Delete
                  </button>
                </div>
                <div className="mt-4 grid gap-3">
                  <Value label="Client ID" value={app.client_id} />
                  <div>
                    <p className="text-xs font-medium text-zinc-500">Redirect URLs</p>
                    <ul className="mt-1 space-y-1">
                      {app.redirect_uris.map((uri) => (
                        <li key={uri} className="truncate font-mono text-[13px] text-zinc-300">
                          {uri}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Panel>

      <Panel id="connect-title" title="Connect your app" description="Point any OpenID Connect library at this issuer. It finds every endpoint on its own.">
        <div className="space-y-3 px-6 py-5">
          <Value label="Issuer URL" value={issuer} />
          <Value label="Discovery document" value={`${issuer}/.well-known/openid-configuration`} />
          <p className="pt-1 text-sm text-zinc-400">
            Use the authorization code flow with PKCE and the scopes{" "}
            <code className="font-mono text-[13px] text-zinc-200">openid profile email</code>. See{" "}
            <Link to="/#integrate" className="font-medium text-zinc-100 underline-offset-4 hover:underline">
              code examples
            </Link>
            .
          </p>
        </div>
      </Panel>

      <Modal open={creating} title="New app" onDismiss={() => setCreating(false)} width="30rem">
        <NewAppForm onCreated={onCreated} onCancel={() => setCreating(false)} />
      </Modal>

      {/* No Escape or backdrop close: the secret is shown only once. */}
      <Modal open={created !== null} title="Save your client secret" width="32rem">
        {created && (
          <>
            <p className="mt-2 flex items-start gap-2 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2.5 text-sm text-amber-200">
              <AlertTriangle size={16} className="mt-0.5 shrink-0" aria-hidden="true" />
              This is the only time you'll see the secret. Store it in your server's environment, never in
              browser code.
            </p>
            <div className="mt-5 space-y-3">
              <Value label="Client ID" value={created.client_id} />
              <Value label="Client secret" value={created.client_secret} />
            </div>
            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => {
                  showSuccess(`${created.name} is ready.`);
                  setCreated(null);
                }}
                className={buttonStyles.primary}
              >
                I've saved it
              </button>
            </div>
          </>
        )}
      </Modal>

      <ConfirmDialog
        open={pending !== null}
        title={pending ? `Delete ${pending.name}?` : ""}
        confirmLabel="Delete app"
        busyLabel="Deleting..."
        busy={deleting}
        onConfirm={() => void remove()}
        onCancel={() => setPending(null)}
      >
        {pending && (
          <>
            Users won't be able to sign in to <span className="font-medium text-zinc-200">{pending.name}</span>{" "}
            with Clavis any more, and its client secret stops working. This can't be undone.
          </>
        )}
      </ConfirmDialog>
    </AccountLayout>
  );
}
