import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useMagnetic } from "./use-magnetic";
import { useReveal } from "./use-reveal";

export function FinalCta() {
  const ref = useReveal<HTMLDivElement>();
  const cta = useMagnetic<HTMLAnchorElement>();

  return (
    <section className="border-t border-zinc-800/80">
      <div ref={ref} className="mx-auto max-w-5xl px-5 py-24 text-center">
        <div className="reveal">
          <h2 className="text-balance text-3xl font-semibold tracking-tight text-zinc-50 sm:text-4xl">
            Give your apps one front door.
          </h2>
          <p className="mx-auto mt-4 max-w-md text-base text-zinc-400">
            Create an account, register your first app, and run your first sign-in today.
          </p>
          <Link
            to="/register"
            ref={cta}
            className="group mt-8 inline-flex h-10 items-center gap-2 rounded-lg bg-white px-4 text-sm font-semibold text-zinc-950 transition-[background-color,transform] duration-300 ease-out hover:bg-zinc-200"
          >
            Get started
            <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
