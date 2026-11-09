import { Logo } from "../../components/auth-layout";
import { SITE } from "../../config/site";

const DOCS = [
  { label: "Privacy", file: "PRIVACY.md" },
  { label: "Terms", file: "TERMS.md" },
  { label: "Security", file: "SECURITY.md" },
];

export function LandingFooter() {
  return (
    <footer className="border-t border-zinc-800/80">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-5 py-10 sm:px-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Logo />
          <span className="text-sm text-zinc-400">Open source under the MIT license</span>
        </div>
        <ul className="flex flex-wrap gap-x-6 gap-y-2 text-[15px] text-zinc-300">
          <li>
            <a href={SITE.githubUrl} target="_blank" rel="noreferrer" className="hover:text-zinc-50">
              GitHub
            </a>
          </li>
          {DOCS.map((doc) => (
            <li key={doc.file}>
              <a
                href={`${SITE.githubUrl}/blob/main/${doc.file}`}
                target="_blank"
                rel="noreferrer"
                className="hover:text-zinc-50"
              >
                {doc.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}
