import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Logo } from "../../components/auth-layout";
import { SITE } from "../../config/site";
import { useAuth } from "../../context/auth-context";
import { BrandMark } from "./brand-mark";

const LINKS = [
  { label: "How it works", href: "#how-it-works", external: false },
  { label: "Security", href: "#security", external: false },
  { label: "Integrate", href: "#integrate", external: false },
  { label: "Docs", href: `${SITE.githubUrl}#readme`, external: true },
];

export function LandingNav() {
  const { user, loading } = useAuth();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 border-b transition-colors duration-300 ${
        scrolled
          ? "border-zinc-800/80 bg-[#050506]/85 backdrop-blur-md"
          : "border-transparent bg-transparent"
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-6">
        <div className="flex items-center gap-8">
          <Logo />
          <ul className="hidden items-center gap-7 text-[15px] text-zinc-300 md:flex">
            {LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  {...(link.external && { target: "_blank", rel: "noreferrer" })}
                  className="transition-colors hover:text-zinc-50"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex items-center gap-1 sm:gap-2">
          <a
            href={SITE.githubUrl}
            target="_blank"
            rel="noreferrer"
            aria-label="Clavis on GitHub"
            className="hidden rounded-md p-2 text-zinc-400 transition-colors hover:text-zinc-50 sm:block"
          >
            <BrandMark name="github" className="size-[18px]" />
          </a>
          {!loading && user ? (
            <Link
              to="/dashboard"
              className="rounded-md bg-white px-4 py-2 text-[15px] font-semibold text-zinc-950 transition-colors hover:bg-zinc-200"
            >
              Dashboard
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                className="rounded-md px-3 py-2 text-[15px] text-zinc-300 transition-colors hover:text-zinc-50"
              >
                Sign in
              </Link>
              <Link
                to="/register"
                className="rounded-md bg-white px-4 py-2 text-[15px] font-semibold text-zinc-950 transition-colors hover:bg-zinc-200"
              >
                Get started
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
