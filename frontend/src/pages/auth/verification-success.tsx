import { CheckCircle2 } from "lucide-react";
import { AuthLayout } from "../../components/auth-layout";

export function VerificationSuccess() {
  return (
    <AuthLayout>
      <div className="success-panel">
        <CheckCircle2 className="success-icon" size={64} />
        <p className="eyebrow">EMAIL VERIFIED</p>
        <h2>You're all set</h2>
        <p className="subtitle">
          Your email has been verified. Taking you to your dashboard...
        </p>
      </div>
    </AuthLayout>
  );
}
