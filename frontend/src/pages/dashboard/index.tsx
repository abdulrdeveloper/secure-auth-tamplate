import { useEffect, useState } from "react";
import { CheckCircle2, LoaderCircle, LogOut, UserRound, X } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card } from "../../components/ui";
import { Logo } from "../../components/auth-layout";

export function DashboardPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [user, setUser] = useState<{
    name: string;
    email: string;
    isEmailVerified: boolean;
  } | null>(null);

  useEffect(() => {
    fetch(
      `${import.meta.env.VITE_API_URL ?? "http://localhost:3000"}/api/auth/me`,
      { credentials: "include" },
    )
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok)
          throw new Error(data.message ?? "Unable to load profile");
        return data;
      })
      .then((response) => setUser(response.user))
      .catch(() =>
        navigate("/login", {
          replace: true,
          state: { from: location.pathname },
        }),
      );
  }, [location.pathname, navigate]);

  function logout() {
    setLoggingOut(true);
    fetch(
      `${import.meta.env.VITE_API_URL ?? "http://localhost:3000"}/api/auth/logout`,
      { method: "POST", credentials: "include" },
    )
      .catch(() => undefined)
      .finally(() => {
        setLoggingOut(false);
        navigate("/login", { replace: true });
      });
  }

  return (
    <main className="dashboard">
      <header className="topbar">
        <Logo />
        <button
          className="logout-button"
          onClick={() => setShowLogoutDialog(true)}
        >
          <LogOut size={16} /> Sign out
        </button>
      </header>
      <section className="dashboard-content">
        <p className="eyebrow">OVERVIEW</p>
        <h1>Good morning, {user?.name ?? "there"}.</h1>
        <p className="subtitle">Here is a quick overview of your account.</p>
        <div className="dashboard-grid">
          <Card className="profile-card">
            <div className="avatar">
              <UserRound size={24} />
            </div>
            <div>
              <span className="card-label">USER PROFILE</span>
              <h3>{user?.name ?? "Loading..."}</h3>
              <p>{user?.email ?? "Loading..."}</p>
            </div>
            <CheckCircle2 className="verified" size={20} />
          </Card>
          <Card>
            <span className="card-label">ACCOUNT STATUS</span>
            <div className="status">
              <span className="status-dot" />{" "}
              {user?.isEmailVerified
                ? "Email verified"
                : "Email verification pending"}
            </div>
            <p>Your account is ready to use.</p>
          </Card>
        </div>
        <p className="dashboard-resource">
          Use this auth template in your own website or{" "}
          <a
            href="https://github.com/abdulrdeveloper/secure-auth-tamplate/issues"
            target="_blank"
            rel="noreferrer"
          >
            open an issue
          </a>{" "}
          if you find a problem.{" "}
          <a
            href="https://github.com/abdulrdeveloper/secure-auth-tamplate"
            target="_blank"
            rel="noreferrer"
          >
            View the repository
          </a>
          .
        </p>
      </section>
      {showLogoutDialog && (
        <div className="dialog-backdrop" role="presentation">
          <div
            className="logout-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="logout-title"
          >
            <button
              className="dialog-close"
              aria-label="Close logout confirmation"
              onClick={() => setShowLogoutDialog(false)}
            >
              <X size={18} />
            </button>
            <div className="dialog-icon">
              <LogOut size={22} />
            </div>
            <h2 id="logout-title">Sign out?</h2>
            <p>Are you sure you want to sign out of your account?</p>
            <div className="dialog-actions">
              <button
                className="dialog-cancel"
                onClick={() => setShowLogoutDialog(false)}
              >
                Cancel
              </button>
              <button
                className="dialog-confirm"
                onClick={logout}
                disabled={loggingOut}
              >
                {loggingOut && (
                  <LoaderCircle className="animate-spin" size={16} />
                )}
                {loggingOut ? "Signing out" : "Sign out"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
