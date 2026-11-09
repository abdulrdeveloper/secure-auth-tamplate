import type { CSSProperties } from "react";
import type { BrandName } from "./brand-icons";
import { BrandMark } from "./brand-mark";

// Clavis speaks standard OpenID Connect, so these frameworks' OIDC clients work
// with it unchanged. A compatibility line, not a customer list.
const STACKS: { brand: BrandName; name: string; color: string }[] = [
  { brand: "nextjs", name: "Next.js", color: "#ffffff" },
  { brand: "node", name: "Node.js", color: "#5FA04E" },
  { brand: "express", name: "Express", color: "#ffffff" },
  { brand: "spring", name: "Spring", color: "#6DB33F" },
  { brand: "django", name: "Django", color: "#44B78B" },
  { brand: "laravel", name: "Laravel", color: "#FF2D20" },
  { brand: "dotnet", name: ".NET", color: "#8B6FEF" },
  { brand: "go", name: "Go", color: "#00ADD8" },
];

export function WorksWith() {
  return (
    <section aria-label="Compatible frameworks" className="border-t border-zinc-800/80 py-8">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-5 px-5 sm:flex-row sm:justify-between">
        <p className="shrink-0 text-sm text-zinc-400">Works with any OIDC client</p>
        <ul className="flex flex-wrap justify-center gap-x-6 gap-y-3">
          {STACKS.map((stack) => (
            <li
              key={stack.brand}
              style={{ "--brand": stack.color } as CSSProperties}
              className="group flex items-center gap-2 text-sm text-zinc-400 transition-colors hover:text-zinc-100"
            >
              <BrandMark
                name={stack.brand}
                className="size-4 transition-colors group-hover:text-[var(--brand)]"
              />
              {stack.name}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
