import { LoaderCircle } from "lucide-react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/auth-context";

function FullPageLoader() {
  return (
    <div
      className="grid min-h-screen place-items-center bg-zinc-950 text-lime-300"
      role="status"
      aria-label="Loading"
    >
      <LoaderCircle className="animate-spin" size={28} />
    </div>
  );
}

export function ProtectedRoute() {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <FullPageLoader />;

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return <Outlet />;
}

export function PublicRoute() {
  const { user, loading } = useAuth();

  if (loading) return <FullPageLoader />;

  if (user) return <Navigate to="/dashboard" replace />;

  return <Outlet />;
}
