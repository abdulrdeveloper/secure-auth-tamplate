import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { CheckCircle2, Shield, XCircle } from "lucide-react";
import { AuthHeader } from "../../components/auth-layout";
import { ErrorMessage, SubmitButton } from "../../components/auth-fields";
import { apiRequest, getErrorMessage } from "../../lib/api";

export function ConsentPage() {
  const [searchParams] = useSearchParams();
  const clientId = searchParams.get("client_id") || "";
  const clientName = searchParams.get("client_name") || clientId || "Unknown Application";
  const redirectUri = searchParams.get("redirect_uri") || "";
  const scope = searchParams.get("scope") || "openid";
  const state = searchParams.get("state") || "";
  const nonce = searchParams.get("nonce") || undefined;
  const codeChallenge = searchParams.get("code_challenge") || undefined;
  const codeChallengeMethod = searchParams.get("code_challenge_method") || undefined;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const scopes = scope.split(" ").filter(Boolean);

  const scopeDescriptions: Record<string, string> = {
    openid: "Access your unique identity identifier",
    email: "View your email address and verification status",
    profile: "View your personal profile details (such as your name)",
  };

  async function handleApprove() {
    setLoading(true);
    setError("");

    try {
      const data = await apiRequest<{ redirect_url: string }>(
        "/oauth/authorize/consent",
        {
          method: "POST",
          data: {
            client_id: clientId,
            redirect_uri: redirectUri,
            scope,
            state: state || undefined,
            ...(nonce && { nonce }),
            ...(codeChallenge && { code_challenge: codeChallenge }),
            ...(codeChallengeMethod && { code_challenge_method: codeChallengeMethod }),
          },
        }
      );

      if (data.redirect_url) {
        const url = new URL(data.redirect_url);
        if (url.protocol === "http:" || url.protocol === "https:") {
          window.location.href = url.toString();
          return;
        }
        setError("Invalid redirect URI protocol returned from server.");
        setLoading(false);
      }
    } catch (err: unknown) {
      setError(getErrorMessage(err));
      setLoading(false);
    }
  }

  function handleDeny() {
    if (redirectUri) {
      try {
        const url = new URL(redirectUri);
        // Strictly allow only http and https protocols to prevent javascript: or data: XSS execution
        if (url.protocol === "http:" || url.protocol === "https:") {
          url.searchParams.set("error", "access_denied");
          url.searchParams.set("error_description", "User denied authorization");
          if (state) url.searchParams.set("state", state);
          window.location.href = url.toString();
          return;
        }
      } catch {
        // Invalid redirect_uri
      }
    }
    window.location.href = "/dashboard";
  }

  return (
    <>
      <AuthHeader
        eyebrow="APPLICATION PERMISSION"
        title="Authorize Application"
        description="An external application is requesting access to your account."
      />

      <div className="mb-6 rounded-xl border border-zinc-800 bg-zinc-900/60 p-4">
        <div className="flex items-center gap-3">
          <div className="grid size-10 place-items-center rounded-lg bg-lime-400/10 text-lime-400">
            <Shield size={22} />
          </div>
          <div>
            <p className="text-sm font-semibold text-zinc-200">
              {clientName}
            </p>
            <p className="text-xs text-zinc-400 font-mono">
              Client ID: <span className="text-lime-300">{clientId || "Unknown"}</span>
            </p>
            <p className="text-xs text-zinc-500 truncate max-w-[260px]">
              Redirect: {redirectUri}
            </p>
          </div>
        </div>

        <div className="mt-4 border-t border-zinc-800/80 pt-3">
          <p className="text-xs font-semibold text-zinc-400 mb-2">Requested Permissions:</p>
          <ul className="space-y-2">
            {scopes.map((s) => (
              <li key={s} className="flex items-start gap-2 text-xs text-zinc-300">
                <CheckCircle2 size={15} className="mt-0.5 text-lime-400 shrink-0" />
                <div>
                  <span className="font-medium text-zinc-200 font-mono text-[11px]">{s}</span>
                  <p className="text-zinc-500">{scopeDescriptions[s] || "Access requested scope"}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {error && <div className="mb-4"><ErrorMessage message={error} /></div>}

      <form onSubmit={(e) => { e.preventDefault(); handleApprove(); }} className="space-y-3">
        <SubmitButton loading={loading} icon={<CheckCircle2 size={17} />}>
          Allow Access
        </SubmitButton>
        <button
          type="button"
          onClick={handleDeny}
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900/50 py-3 text-sm font-semibold text-zinc-400 transition-colors hover:border-zinc-700 hover:text-zinc-200"
        >
          <XCircle size={17} /> Deny Access
        </button>
      </form>
    </>
  );
}
