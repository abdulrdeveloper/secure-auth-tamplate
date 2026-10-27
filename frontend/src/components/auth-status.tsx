import { CheckCircle2 } from "lucide-react";
import type { ReactNode } from "react";

type AuthStatusProps = {
  eyebrow: string;
  title: string;
  description: string;
  action?: ReactNode;
};

export function AuthStatus({
  eyebrow,
  title,
  description,
  action,
}: AuthStatusProps) {
  return (
    <div className="text-center">
      <CheckCircle2 className="mx-auto mb-[22px] text-lime-300" size={64} />
      <p className="text-[11px] font-bold tracking-[.14em] text-zinc-400">
        {eyebrow}
      </p>
      <h2 className="mt-5 text-[31px] font-bold tracking-[-0.05em] text-zinc-50">
        {title}
      </h2>
      <p className="mb-[31px] text-sm leading-relaxed text-zinc-400">
        {description}
      </p>
      {action}
    </div>
  );
}
