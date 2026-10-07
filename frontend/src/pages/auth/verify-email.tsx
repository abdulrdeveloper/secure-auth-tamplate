import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { AuthHeader } from "../../components/auth-layout";
import { OtpField, SubmitButton } from "../../components/auth-fields";
import { VerificationSuccess } from "./verification-success";

export function VerifyEmailPage() {
  const navigate = useNavigate();
  const [completed, setCompleted] = useState(false);
  useEffect(() => {
    if (completed) {
      sessionStorage.setItem("demo-authenticated", "true");
      const timer = window.setTimeout(
        () => navigate("/dashboard", { replace: true }),
        1200,
      );
      return () => window.clearTimeout(timer);
    }
  }, [completed, navigate]);
  if (completed) return <VerificationSuccess />;
  return (
    <>
      <AuthHeader
        eyebrow="EMAIL VERIFICATION"
        title="Check your inbox"
        description="Enter the 6-digit code we sent to verify your email."
      />
      <form
        onSubmit={(event) => {
          event.preventDefault();
          setCompleted(true);
        }}
      >
        <OtpField />
        <div className="resend-row">
          <span>Didn't receive the code?</span>
          <button type="button" className="inline-link resend-button">
            Resend code
          </button>
        </div>
        <SubmitButton icon={<ArrowRight size={17} />}>
          Verify email
        </SubmitButton>
      </form>
      <p className="form-footer">
        <Link className="inline-link" to="/login">
          ← Back to sign in
        </Link>
      </p>
    </>
  );
}
