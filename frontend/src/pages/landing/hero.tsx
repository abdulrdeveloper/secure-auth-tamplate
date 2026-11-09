import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { SITE } from "../../config/site";
import { ProductDemo } from "./product-demo";

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-14">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[520px] bg-[radial-gradient(60%_50%_at_75%_20%,rgba(201,161,90,0.09),transparent_70%)]"
      />
      <div className="relative mx-auto grid max-w-5xl grid-cols-1 items-center gap-12 px-5 pb-16 pt-14 lg:grid-cols-[1fr_1.05fr] lg:py-20">
        <div className="hero-enter">
          <h1 className="max-w-md text-balance text-4xl font-semibold leading-[1.08] tracking-tight text-zinc-50 sm:text-5xl">
            One sign-in for every app you build.
          </h1>
          <p className="mt-5 max-w-md text-base leading-relaxed text-zinc-400">
            {SITE.name} is an OpenID Connect provider you run yourself. Users sign in once, and each
            app gets a signed ID token it can verify on its own.
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-2.5">
            <Link
              to="/register"
              className="group inline-flex h-10 items-center gap-2 rounded-lg bg-white px-4 text-sm font-semibold text-zinc-950 transition-colors hover:bg-zinc-200"
            >
              Get started
              <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
            </Link>
            <a
              href={SITE.githubUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-10 items-center rounded-lg border border-zinc-800 px-4 text-sm font-medium text-zinc-200 transition-colors hover:border-zinc-600 hover:text-zinc-50"
            >
              View source
            </a>
          </div>
        </div>

        <ProductDemo />
      </div>
    </section>
  );
}
