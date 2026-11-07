import { CheckCircle2 } from "lucide-react";
import type { ReactNode } from "react";

export function AuthStatus({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="text-center">
      <div className="mx-auto mb-5 grid size-12 place-items-center rounded-full bg-white/10 text-zinc-100">
        <CheckCircle2 size={26} />
      </div>
      <h1 className="text-xl font-semibold text-zinc-50">{title}</h1>
      <p className="mt-1.5 text-sm text-zinc-400">{description}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
