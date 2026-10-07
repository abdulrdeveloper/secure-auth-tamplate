import { Fingerprint, ShieldCheck } from "lucide-react";
import { type ReactNode } from "react";
import { Link, Outlet } from "react-router-dom";

export function AuthLayout({ children }: { children?: ReactNode }) {
  return (
    <main className="auth-layout">
      <aside className="brand-panel">
        <Logo />
        <div className="brand-message">
          <p className="eyebrow">PRIVATE BY DESIGN</p>
          <h1>
            Your account,
            <br />
            <em>protected.</em>
          </h1>
          <p className="description">
            Simple, secure authentication for everything that matters.
          </p>
        </div>
        <div className="trust-row">
          <Fingerprint size={17} /> Built with security at every layer
        </div>
      </aside>
      <section className="form-panel">
        <div className="mobile-logo">
          <Logo />
        </div>
        <div className="form-container">{children ?? <Outlet />}</div>
      </section>
    </main>
  );
}

export function Logo() {
  return (
    <Link to="/login" className="logo">
      <span className="logo-mark">
        <ShieldCheck size={20} />
      </span>
      <span>
        secure<span className="logo-muted">auth</span>
      </span>
    </Link>
  );
}

export function AuthHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <>
      <p className="eyebrow">{eyebrow}</p>
      <h2>{title}</h2>
      <p className="subtitle">{description}</p>
    </>
  );
}
