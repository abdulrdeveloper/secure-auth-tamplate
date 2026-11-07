import { useEffect } from "react";
import { LoaderCircle } from "lucide-react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/auth-context";

const API_ORIGIN = new URL(import.meta.env.VITE_API_URL ?? "http://localhost:3000").origin;

function getAuthorizeUrl(returnTo: string | null): string | null {
  if (!returnTo) return null;
  try {
    const url = new URL(returnTo, API_ORIGIN);
    return url.origin === API_ORIGIN && url.pathname === "/oauth/authorize" ? url.href : null;
  } catch {
    return null;
  }
}

function FullPageLoader() {
  return (
    <div
      className="grid min-h-screen place-items-center bg-zinc-950 text-blue-400"
      role="status"
      aria-label="Loading"
    >
      <LoaderCircle className="animate-spin" size={28} />
    </div>
  );
}

function ExternalRedirect({ url }: { url: string }) {
  useEffect(() => {
    window.location.assign(url);
  }, [url]);

  return <FullPageLoader />;
}

export function ProtectedRoute() {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <FullPageLoader />;

  if (!user) {
    const from = `${location.pathname}${location.search}${location.hash}`;
    return <Navigate to="/login" replace state={{ from }} />;
  }

  return <Outlet />;
}

export function PublicRoute() {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <FullPageLoader />;

  if (user) {
    const authorizeUrl = getAuthorizeUrl(new URLSearchParams(location.search).get("return_to"));
    if (authorizeUrl) return <ExternalRedirect url={authorizeUrl} />;

    const from = (location.state as { from?: string } | null)?.from;
    return <Navigate to={from ?? "/dashboard"} replace />;
  }

  return <Outlet />;
}
