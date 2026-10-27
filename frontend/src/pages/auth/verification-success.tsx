import { AuthStatus } from "../../components/auth-status";

export function VerificationSuccess() {
  return (
    <AuthStatus
      eyebrow="EMAIL VERIFIED"
      title="You're all set"
      description="Your email has been verified. Taking you to your dashboard..."
    />
  );
}
