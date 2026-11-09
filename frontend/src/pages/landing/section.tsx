import type { ReactNode } from "react";

// One section shape for the whole page: kicker, heading, optional lead, content.
// Spacing, type sizes and the alternating tinted band live here and nowhere else.

type SectionProps = {
  id?: string;
  kicker: string;
  title: ReactNode;
  lead?: ReactNode;
  band?: boolean;
  children: ReactNode;
};

export function Section({ id, kicker, title, lead, band = false, children }: SectionProps) {
  const headingId = id ? `${id}-title` : undefined;
  return (
    <section
      id={id}
      aria-labelledby={headingId}
      className={`scroll-mt-16 py-20 sm:py-28 ${
        band ? "border-y border-zinc-800/80 bg-[#09090b]" : ""
      }`}
    >
      <div className="mx-auto max-w-6xl px-5 sm:px-6">
        <p className="font-mono text-[13px] font-medium uppercase tracking-[0.16em] text-brass">
          {kicker}
        </p>
        <h2
          id={headingId}
          className="mt-4 max-w-3xl text-balance text-[34px] font-semibold leading-[1.1] tracking-[-0.02em] text-zinc-50 sm:text-5xl"
        >
          {title}
        </h2>
        {lead && <p className="mt-5 max-w-2xl text-base leading-relaxed text-zinc-400 sm:text-lg">{lead}</p>}
        <div className="mt-12 sm:mt-14">{children}</div>
      </div>
    </section>
  );
}
