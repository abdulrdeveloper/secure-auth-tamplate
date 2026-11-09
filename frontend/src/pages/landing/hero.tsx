import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { SITE } from "../../config/site";
import { BrandMark } from "./brand-mark";
import { ProductDemo } from "./product-demo";

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-16">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[640px] bg-[radial-gradient(60%_50%_at_75%_20%,rgba(201,161,90,0.10),transparent_70%)]"
      />
      <div className="relative mx-auto grid max-w-6xl grid-cols-1 items-center gap-14 px-6 pb-20 pt-16 lg:min-h-[calc(100svh-4rem)] lg:grid-cols-[1fr_1.05fr] lg:py-16">
        <div className="hero-enter">
          <a
            href={`${SITE.githubUrl}#readme`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/60 py-1 pl-1.5 pr-3 text-xs text-zinc-400 transition-colors hover:border-zinc-700 hover:text-zinc-200"
          >
            <span className="flex size-5 items-center justify-center rounded-full bg-zinc-800">
              <BrandMark name="openid" className="size-3 text-[#F78C40]" />
            </span>
            OpenID Connect provider, self-hosted
          </a>
          <h1 className="mt-6 max-w-xl text-4xl font-semibold leading-[1.05] tracking-[-0.03em] text-zinc-50 sm:text-5xl lg:text-[64px]">
            One sign-in for every app you build.
          </h1>
          <p className="mt-6 max-w-lg text-base leading-relaxed text-zinc-400 sm:text-lg">
            {SITE.name} is an identity provider you run on your own servers. Users sign in once,
            and each of your apps gets a signed ID token it can verify by itself.
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
              className="inline-flex h-11 items-center gap-2 rounded-lg border border-zinc-800 px-5 text-sm font-medium text-zinc-200 transition-colors hover:border-zinc-600 hover:text-zinc-50"
            >
              <BrandMark name="github" className="size-4" />
              View on GitHub
            </a>
          </div>
          <p className="mt-10 font-mono text-xs text-zinc-500">
            MIT licensed · Node.js, MongoDB and Redis
          </p>
        </div>

        <ProductDemo />
      </div>
    </section>
  );
}
