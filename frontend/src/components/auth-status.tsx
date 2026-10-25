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
    <div className="success-panel">
      <CheckCircle2 className="success-icon" size={64} />
      <p className="eyebrow">{eyebrow}</p>
      <h2>{title}</h2>
      <p className="subtitle">{description}</p>
      {action}
    </div>
  );
}

