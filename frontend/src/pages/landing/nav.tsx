import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Logo } from "../../components/auth-layout";
import { useAuth } from "../../context/auth-context";

const LINKS = [
  { label: "How it works", href: "#how-it-works" },
  { label: "Security", href: "#security" },
  { label: "Integrate", href: "#integrate" },
];

// Progressive blur: two stacked backdrop layers, each masked to fade out as it
// goes down, so content dissolves under the bar instead of hitting a hard edge.
const SOFT = "linear-gradient(to bottom, #000 0%, #000 30%, transparent 70%)";
const STRONG = "linear-gradient(to bottom, #000 0%, transparent 45%)";

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
    <header className="fixed inset-x-0 top-0 z-40">
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-x-0 top-0 h-24 transition-opacity duration-300 ${
          scrolled ? "opacity-100" : "opacity-0"
        }`}
      >
        <div
          className="absolute inset-0 backdrop-blur-[2px]"
          style={{ maskImage: SOFT, WebkitMaskImage: SOFT }}
        />
        <div
          className="absolute inset-0 backdrop-blur-md"
          style={{ maskImage: STRONG, WebkitMaskImage: STRONG }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#050506] via-[#050506]/80 to-transparent" />
      </div>

      <nav className="relative mx-auto flex h-14 max-w-5xl items-center justify-between px-5">
        <Logo />
        <ul className="hidden items-center gap-6 text-sm text-zinc-400 sm:flex">
          {LINKS.map((link) => (
            <li key={link.href}>
              <a href={link.href} className="transition-colors hover:text-zinc-50">
                {link.label}
              </a>
            </li>
          ))}
        </ul>
        <Link
          to={!loading && user ? "/dashboard" : "/login"}
          className="rounded-lg bg-white px-3.5 py-1.5 text-sm font-medium text-zinc-950 transition-colors hover:bg-zinc-200"
        >
          {!loading && user ? "Dashboard" : "Sign in"}
        </Link>
      </nav>
    </header>
  );
}
