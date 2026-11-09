import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { SITE } from "../../config/site";
import { useReveal } from "./use-reveal";

export function FinalCta() {
  const ref = useReveal<HTMLDivElement>();

  return (
    <section className="border-t border-zinc-800/80 py-28">
      <div ref={ref} className="reveal mx-auto max-w-3xl px-6 text-center">
        <h2 className="text-3xl font-semibold tracking-tight sm:text-5xl">
          Give your apps one front door.
        </h2>
        <p className="mx-auto mt-5 max-w-lg text-zinc-400">
          Create an account, register your first app, and run your first sign-in today.
        </p>
        <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
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
            Read the code
          </a>
        </div>
      </div>
    </section>
  );
}
