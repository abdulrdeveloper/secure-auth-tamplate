import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { SITE } from "../../config/site";
import { KeyPoster } from "./key-poster";

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-16">
      <div className="mx-auto grid min-h-[calc(100svh-4rem)] max-w-6xl items-center gap-10 px-6 py-16 lg:grid-cols-[1.05fr_1fr]">
        <div className="hero-enter">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-brass">
            Self-hosted OpenID Connect
          </p>
          <h1 className="mt-5 max-w-xl text-4xl font-semibold leading-[1.08] tracking-tight text-zinc-50 sm:text-5xl lg:text-6xl">
            One sign-in for every app you build.
          </h1>
          <p className="mt-6 max-w-lg text-base leading-relaxed text-zinc-400 sm:text-lg">
            {SITE.name} is an identity provider you run yourself. Users sign in once, and your
            apps get signed tokens they can check on their own.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Link
              to="/register"
              className="group inline-flex h-11 items-center gap-2 rounded-lg bg-white px-5 text-sm font-semibold text-zinc-950 transition-colors hover:bg-zinc-200"
            >
              Get started
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
            </Link>
            <a
              href={SITE.githubUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-11 items-center rounded-lg border border-zinc-800 px-5 text-sm font-medium text-zinc-200 transition-colors hover:border-zinc-600 hover:text-zinc-50"
            >
              View on GitHub
            </a>
          </div>
        </div>

        <div className="relative mx-auto aspect-square w-full max-w-[520px]">
          <KeyPoster className="absolute inset-0 size-full" />
        </div>
      </div>
    </section>
  );
}
