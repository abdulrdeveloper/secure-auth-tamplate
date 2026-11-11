import { Link } from "react-router-dom";
import { Logo } from "../../components/auth-layout";
import { SITE } from "../../config/site";

const FOOTER_PAGES = [
  { label: "How It Works", href: "#how-it-works", isAnchor: true },
  { label: "Security", href: "#security", isAnchor: true },
  { label: "Integrate", href: "#integrate", isAnchor: true },
  { label: "Dashboard", href: "/dashboard", isAnchor: false },
];

const FOOTER_RESOURCES = [
  { label: "Documentation", href: `${SITE.githubUrl}#readme`, external: true },
  { label: "Discovery Doc", href: "/oauth/.well-known/openid-configuration", external: true },
  { label: "Live JWKS", href: "/oauth/.well-known/jwks.json", external: true },
  { label: "GitHub Repository", href: SITE.githubUrl, external: true },
];

const FOOTER_DEVELOPERS = [
  { label: "Register Client", href: "/developers", isAnchor: false },
  { label: "Developer Sign In", href: "/login", isAnchor: false },
  { label: "Create Account", href: "/register", isAnchor: false },
  { label: "Security Policy", href: `${SITE.githubUrl}/blob/main/SECURITY.md`, external: true },
];

export function LandingFooter() {
  return (
    <footer className="border-t border-zinc-800/80 bg-[#09090b]">
      <div className="mx-auto max-w-5xl px-5 py-12 sm:py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr] lg:gap-8">
          {/* Brand info */}
          <div className="flex flex-col justify-between space-y-4">
            <div>
              <Logo />
              <p className="mt-3 max-w-xs text-xs leading-relaxed text-zinc-400">
                Self-hosted, developer-friendly OpenID Connect identity provider for modern web applications.
              </p>
            </div>
            <p className="text-xs text-zinc-500">
              © {new Date().getFullYear()} {SITE.name}. Open source under MIT.
            </p>
          </div>

          {/* Column: Pages */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-300">
              Pages
            </h3>
            <ul className="mt-4 space-y-2.5 text-xs text-zinc-400">
              {FOOTER_PAGES.map((item) => (
                <li key={item.label}>
                  {item.isAnchor ? (
                    <a
                      href={item.href}
                      className="transition-colors hover:text-zinc-200"
                    >
                      {item.label}
                    </a>
                  ) : (
                    <Link
                      to={item.href}
                      className="transition-colors hover:text-zinc-200"
                    >
                      {item.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Column: Resources */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-300">
              Resources
            </h3>
            <ul className="mt-4 space-y-2.5 text-xs text-zinc-400">
              {FOOTER_RESOURCES.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                    className="transition-colors hover:text-zinc-200"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column: Developers */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-300">
              Developers
            </h3>
            <ul className="mt-4 space-y-2.5 text-xs text-zinc-400">
              {FOOTER_DEVELOPERS.map((item) => (
                <li key={item.label}>
                  {item.external ? (
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noreferrer"
                      className="transition-colors hover:text-zinc-200"
                    >
                      {item.label}
                    </a>
                  ) : (
                    <Link
                      to={item.href}
                      className="transition-colors hover:text-zinc-200"
                    >
                      {item.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
