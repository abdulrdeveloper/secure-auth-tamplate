import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Logo } from "../../components/auth-layout";
import { SITE } from "../../config/site";
import { useAuth } from "../../context/auth-context";

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
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Logo />
        <div className="flex items-center gap-1 sm:gap-2">
          <a
            href={SITE.githubUrl}
            target="_blank"
            rel="noreferrer"
            className="hidden rounded-md px-3 py-1.5 text-sm text-zinc-400 transition-colors hover:text-zinc-50 sm:block"
          >
            GitHub
          </a>
          {!loading && user ? (
            <Link
              to="/dashboard"
              className="rounded-md bg-white px-3.5 py-1.5 text-sm font-semibold text-zinc-950 transition-colors hover:bg-zinc-200"
            >
              Dashboard
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                className="rounded-md px-3 py-1.5 text-sm text-zinc-400 transition-colors hover:text-zinc-50"
              >
                Sign in
              </Link>
              <Link
                to="/register"
                className="rounded-md bg-white px-3.5 py-1.5 text-sm font-semibold text-zinc-950 transition-colors hover:bg-zinc-200"
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
