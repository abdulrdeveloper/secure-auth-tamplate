import type { CSSProperties } from "react";
import type { BrandName } from "./brand-icons";
import { BrandMark } from "./brand-mark";

// Clavis speaks standard OpenID Connect, so these well-known client libraries
// work with it unchanged. This is a compatibility list, not a customer list.
const STACKS: { brand: BrandName; framework: string; library: string; color: string }[] = [
  { brand: "nextjs", framework: "Next.js", library: "Auth.js", color: "#ffffff" },
  { brand: "node", framework: "Node.js", library: "openid-client", color: "#5FA04E" },
  { brand: "express", framework: "Express", library: "Passport", color: "#ffffff" },
  { brand: "spring", framework: "Spring Boot", library: "Spring Security", color: "#6DB33F" },
  { brand: "django", framework: "Django", library: "mozilla-django-oidc", color: "#44B78B" },
  { brand: "laravel", framework: "Laravel", library: "Socialite", color: "#FF2D20" },
  { brand: "dotnet", framework: ".NET", library: "ASP.NET Core", color: "#8B6FEF" },
  { brand: "go", framework: "Go", library: "go-oidc", color: "#00ADD8" },
];

export function WorksWith() {
  return (
    <section aria-labelledby="works-with" className="border-t border-zinc-800/80 py-14">
      <div className="mx-auto max-w-6xl px-6">
        <p id="works-with" className="text-center text-sm text-zinc-500">
          Works with the OpenID Connect library you already use
        </p>
        <ul className="mt-8 grid grid-cols-2 overflow-hidden rounded-2xl border border-zinc-800 sm:grid-cols-4">
          {STACKS.map((stack) => (
            <li
              key={stack.brand}
              style={{ "--brand": stack.color } as CSSProperties}
              className="group -mb-px -mr-px flex items-center gap-3 border-b border-r border-zinc-800 px-5 py-5 transition-colors hover:bg-zinc-900/60"
            >
              <BrandMark
                name={stack.brand}
                className="size-6 shrink-0 text-zinc-400 transition-colors group-hover:text-[var(--brand)]"
              />
              <div className="min-w-0">
                <p className="text-sm font-medium text-zinc-200">{stack.framework}</p>
                <p className="truncate font-mono text-[11px] text-zinc-500">{stack.library}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
