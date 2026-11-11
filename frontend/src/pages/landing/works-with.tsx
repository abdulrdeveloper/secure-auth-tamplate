import type { CSSProperties } from "react";
import type { BrandName } from "./brand-icons";
import { BrandMark } from "./brand-mark";

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
    <section aria-label="Compatible frameworks" className="border-t border-zinc-800/80 py-10">
      <div className="mx-auto max-w-5xl px-5 text-center">
        <p className="text-xs font-medium uppercase tracking-wider text-zinc-400">
          Works with any OIDC client
        </p>

        <div className="relative mt-6 w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
          <ul className="animate-marquee flex items-center gap-10">
            {[...STACKS, ...STACKS].map((stack, index) => (
              <li
                key={`${stack.brand}-${index}`}
                style={{ "--brand": stack.color } as CSSProperties}
                className="group flex shrink-0 items-center gap-2.5 text-sm text-zinc-400 transition-colors hover:text-zinc-100"
              >
                <BrandMark
                  name={stack.brand}
                  className="size-4.5 transition-colors group-hover:text-[var(--brand)]"
                />
                <span className="font-medium">{stack.name}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
