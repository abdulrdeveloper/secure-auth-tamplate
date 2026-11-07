import { AuthStatus } from "../../components/auth-status";

export function VerificationSuccess() {
  return (
    <AuthStatus
      title="Email verified"
      description="Your account is ready. Taking you to your dashboard..."
    />
  );
}
