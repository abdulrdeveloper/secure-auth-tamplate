import { Logo } from "../../components/auth-layout";
import { SITE } from "../../config/site";

const LINKS = [
  { label: "GitHub", href: SITE.githubUrl },
  { label: "Privacy", href: `${SITE.githubUrl}/blob/main/PRIVACY.md` },
  { label: "Terms", href: `${SITE.githubUrl}/blob/main/TERMS.md` },
  { label: "Security", href: `${SITE.githubUrl}/blob/main/SECURITY.md` },
];

export function LandingFooter() {
  return (
    <footer className="border-t border-zinc-800/80">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 px-5 py-6 sm:flex-row">
        <div className="flex items-center gap-3">
          <Logo />
          <span className="text-xs text-zinc-400">MIT licensed</span>
        </div>
        <ul className="flex flex-wrap justify-center gap-x-5 gap-y-2 text-sm text-zinc-400">
          {LINKS.map((link) => (
            <li key={link.label}>
              <a href={link.href} target="_blank" rel="noreferrer" className="hover:text-zinc-50">
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}
