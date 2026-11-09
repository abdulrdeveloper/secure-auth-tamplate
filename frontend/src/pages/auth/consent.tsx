import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Check } from "lucide-react";
import { AuthHeader } from "../../components/auth-layout";
import { FormError } from "../../components/toast";
import { apiRequest, getErrorMessage } from "../../lib/api";

const SCOPE_LABELS: Record<string, string> = {
  openid: "Verify your identity",
  profile: "View your name",
  email: "View your email address",
};

export function ConsentPage() {
  const [searchParams] = useSearchParams();
  const clientId = searchParams.get("client_id") ?? "";
  const redirectUri = searchParams.get("redirect_uri") ?? "";
  const scope = searchParams.get("scope") ?? "openid";
  const scopes = scope.split(" ").filter(Boolean);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [appName, setAppName] = useState("");

  useEffect(() => {
    if (!clientId) return;
    apiRequest<{ name: string }>(`/oauth/client-info?client_id=${encodeURIComponent(clientId)}`)
      .then((info) => setAppName(info.name))
      .catch(() => setAppName(""));
  }, [clientId]);

  async function respond(approve: boolean) {
    setLoading(true);
    setError("");
    const optional = (key: string) => searchParams.get(key) ?? undefined;

    try {
      const { redirect_url } = await apiRequest<{ redirect_url: string }>("/oauth/consent", {
        method: "POST",
        data: {
          approve,
          client_id: clientId,
          redirect_uri: redirectUri,
          scope,
          state: optional("state"),
          nonce: optional("nonce"),
          code_challenge: optional("code_challenge"),
          code_challenge_method: optional("code_challenge_method"),
        },
      });
      if (!/^https?:\/\//.test(redirect_url)) {
        throw new Error("Invalid redirect URL returned by the server.");
      }
      window.location.assign(redirect_url);
    } catch (err) {
      setError(getErrorMessage(err));
      setLoading(false);
    }
  }

  return (
    <>
      <AuthHeader
        title="Allow access?"
        description="An application is asking to sign you in."
      />

      <div className="mb-5 rounded-lg border border-zinc-800 bg-zinc-950 p-4">
        <p className="text-xs font-medium text-zinc-500">Application</p>
        <p className="mt-1 text-sm font-semibold text-zinc-100">{appName || "Unknown application"}</p>
        <p className="mt-0.5 break-all font-mono text-xs text-zinc-500">{clientId}</p>
        <p className="mt-3 text-xs font-medium text-zinc-500">Redirects to</p>
        <p className="mt-1 break-all text-sm text-zinc-300">{redirectUri || "Unknown"}</p>
      </div>

      <p className="mb-2 text-sm font-medium text-zinc-200">This will allow the application to:</p>
      <ul className="mb-6 space-y-2">
        {scopes.map((s) => (
          <li key={s} className="flex items-center gap-2 text-sm text-zinc-300">
            <Check size={16} className="text-zinc-100" />
            {SCOPE_LABELS[s] ?? s}
          </li>
        ))}
      </ul>

      {error && <FormError message={error} />}

      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => respond(false)}
          disabled={loading}
          className="h-10 cursor-pointer rounded-md border border-zinc-700 text-sm font-medium text-zinc-200 transition-colors hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Deny
        </button>
        <button
          type="button"
          onClick={() => respond(true)}
          disabled={loading}
          className="h-10 cursor-pointer rounded-lg text-sm font-semibold transition-all bg-white text-zinc-950 hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Working..." : "Allow"}
        </button>
      </div>
    </>
  );
}
