import type { ReactNode } from "react";

type SectionProps = {
  id?: string;
  kicker: string;
  title: ReactNode;
  lead?: ReactNode;
  band?: boolean;
  center?: boolean;
  children: ReactNode;
};

export function Section({ id, kicker, title, lead, band = false, center = false, children }: SectionProps) {
  const headingId = id ? `${id}-title` : undefined;
  return (
    <section
      id={id}
      aria-labelledby={headingId}
      className={`scroll-mt-14 py-16 ${band ? "border-y border-zinc-800/80 bg-[#09090b]" : ""}`}
    >
      <div className="mx-auto max-w-5xl px-5">
        <div className={center ? "text-center" : ""}>
          <p className="text-sm font-medium text-brass">{kicker}</p>
          <h2
            id={headingId}
            className={`mt-3 max-w-2xl text-balance text-2xl font-semibold leading-tight tracking-tight text-zinc-50 sm:text-3xl ${
              center ? "mx-auto" : ""
            }`}
          >
            {title}
          </h2>
          {lead && (
            <p className={`mt-3 max-w-xl text-sm leading-relaxed text-zinc-400 ${center ? "mx-auto" : ""}`}>
              {lead}
            </p>
          )}
        </div>
        <div className="mt-9">{children}</div>
      </div>
    </section>
  );
}
