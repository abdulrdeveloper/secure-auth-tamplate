import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { KeyVisual } from "./key-visual";
import { useReveal } from "./use-reveal";

export function FinalCta() {
  const ref = useReveal<HTMLDivElement>();

  return (
    <section className="relative overflow-hidden border-t border-zinc-800/80">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(50%_60%_at_72%_50%,rgba(201,161,90,0.07),transparent_70%)]"
      />
      <div
        ref={ref}
        className="relative mx-auto grid max-w-5xl items-center gap-4 px-5 py-16 md:grid-cols-2 md:py-8"
      >
        <div className="reveal text-center md:text-left">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Give your apps one front door.
          </h2>
          <p className="mx-auto mt-3 max-w-sm text-sm text-zinc-400 md:mx-0">
            Create an account, register your first app, and run your first sign-in today.
          </p>
          <Link
            to="/register"
            className="group mt-6 inline-flex h-10 items-center gap-2 rounded-lg bg-white px-4 text-sm font-semibold text-zinc-950 transition-colors hover:bg-zinc-200"
          >
            Get started
            <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        <KeyVisual className="mx-auto hidden max-w-[380px] md:block" />
      </div>
    </section>
  );
}
