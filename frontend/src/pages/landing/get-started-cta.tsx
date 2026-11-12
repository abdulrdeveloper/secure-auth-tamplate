import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useReveal } from "./use-reveal";

export function GetStartedCta() {
  const ref = useReveal<HTMLDivElement>();

  return (
    <section aria-label="Get Started" className="relative border-t border-zinc-800/80 bg-[#050506] py-20 sm:py-24">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 size-[340px] rounded-full bg-[#c9a15a]/4 blur-[130px]"
      />

      <div ref={ref} className="reveal relative z-10 mx-auto max-w-5xl px-5 text-center">
        <h2 className="mx-auto max-w-xl text-balance text-2xl font-semibold tracking-tight text-zinc-50 sm:text-3xl lg:text-[34px] leading-snug">
          Ready to ship authentication you{" "}
          <span className="text-[#c9a15a]">actually own?</span>
        </h2>

        <p className="mx-auto mt-3 max-w-md text-xs sm:text-sm leading-relaxed text-zinc-400">
          Create an account, register your first client app, and run your first standard OIDC sign-in in minutes.
        </p>

        <Link
          to="/register"
          className="group mt-7 inline-flex h-9.5 items-center gap-2 rounded-lg bg-zinc-100 px-4 text-xs sm:text-sm font-medium text-zinc-950 shadow-sm transition-colors duration-150 hover:bg-white active:bg-zinc-200"
        >
          Get started
          <ArrowRight
            size={14}
            className="transition-transform duration-200 group-hover:translate-x-0.5"
          />
        </Link>
      </div>
    </section>
  );
}
