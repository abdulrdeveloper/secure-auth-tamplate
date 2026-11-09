import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { SITE } from "../../config/site";
import { BrandMark } from "./brand-mark";
import { KeyVisual } from "./key-visual";
import { useReveal } from "./use-reveal";

export function FinalCta() {
  const ref = useReveal<HTMLDivElement>();

  return (
    <section className="relative overflow-hidden border-t border-zinc-800/80">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(50%_60%_at_70%_50%,rgba(201,161,90,0.08),transparent_70%)]"
      />
      <div
        ref={ref}
        className="relative mx-auto grid max-w-6xl items-center gap-6 px-6 py-20 md:grid-cols-[1fr_1fr] md:py-12"
      >
        <div className="reveal text-center md:text-left">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-5xl">
            Give your apps one front door.
          </h2>
          <p className="mx-auto mt-5 max-w-md text-zinc-400 md:mx-0">
            Create an account, register your first app, and run your first sign-in today.
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-3 md:justify-start">
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
              className="inline-flex h-11 items-center gap-2 rounded-lg border border-zinc-800 px-5 text-sm font-medium text-zinc-200 transition-colors hover:border-zinc-600 hover:text-zinc-50"
            >
              <BrandMark name="github" className="size-4" />
              Read the code
            </a>
          </div>
        </div>

        <KeyVisual className="mx-auto hidden max-w-[460px] md:block" />
      </div>
    </section>
  );
}
