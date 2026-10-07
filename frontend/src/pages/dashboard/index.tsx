import { useEffect, useState } from "react";
import { CheckCircle2, LogOut, UserRound, X } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card } from "../../components/ui";
import { Logo } from "../../components/auth-layout";

export function DashboardPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  useEffect(() => {
    if (!sessionStorage.getItem("demo-authenticated")) {
      navigate("/login", { replace: true, state: { from: location.pathname } });
    }
  }, [location.pathname, navigate]);

  function logout() {
    sessionStorage.removeItem("demo-authenticated");
    navigate("/login", { replace: true });
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
        <h1>Good morning, Alex.</h1>
        <p className="subtitle">
          Your account details will appear here after backend connection.
        </p>
        <div className="dashboard-grid">
          <Card className="profile-card">
            <div className="avatar">
              <UserRound size={24} />
            </div>
            <div>
              <span className="card-label">USER PROFILE</span>
              <h3>Your name</h3>
              <p>your-email@example.com</p>
            </div>
            <CheckCircle2 className="verified" size={20} />
          </Card>
          <Card>
            <span className="card-label">ACCOUNT STATUS</span>
            <div className="status">
              <span className="status-dot" /> Email verification ready
            </div>
            <p>
              Live user data will be loaded from the secure profile endpoint.
            </p>
          </Card>
        </div>
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
              <button className="dialog-confirm" onClick={logout}>
                Sign out
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
