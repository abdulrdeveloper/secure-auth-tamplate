import { useState } from "react";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import { AuthHeader } from "../../components/auth-layout";
import {
  OtpField,
  PasswordField,
  SubmitButton,
} from "../../components/auth-fields";

export function ResetPasswordPage() {
  const [step, setStep] = useState<"otp" | "password">("otp");
  const [completed, setCompleted] = useState(false);
  if (completed) return <ResetSuccess />;
  return (
    <>
      <AuthHeader
        eyebrow="ACCOUNT RECOVERY"
        title={
          step === "otp" ? "Enter your reset code" : "Choose a new password"
        }
        description={
          step === "otp"
            ? "Use the code sent to your email to continue."
            : "Create a new password for your secure account."
        }
      />
      <form
        onSubmit={(event) => {
          event.preventDefault();
          step === "otp" ? setStep("password") : setCompleted(true);
        }}
      >
        {step === "otp" ? (
          <>
            <OtpField />
            <p className="helper-text">
              Use the reset code sent to your email.
            </p>
          </>
        ) : (
          <>
            <PasswordField label="New password" />
            <PasswordField label="Confirm password" />
          </>
        )}
        <SubmitButton icon={<ArrowRight size={17} />}>
          {step === "otp" ? "Continue" : "Reset password"}
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

function ResetSuccess() {
  return (
    <div className="success-panel">
      <CheckCircle2 className="success-icon" size={64} />
      <p className="eyebrow">PASSWORD UPDATED</p>
      <h2>Password reset complete</h2>
      <p className="subtitle">
        Your password has been updated successfully. You can now sign in with
        your new password.
      </p>
      <Link className="primary-button success-link" to="/login" replace>
        Go back to sign in <ArrowRight size={17} />
      </Link>
    </div>
  );
}
