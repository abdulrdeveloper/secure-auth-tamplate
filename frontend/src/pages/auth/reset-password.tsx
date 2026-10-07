import { useState } from "react";
import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { AuthHeader } from "../../components/auth-layout";
import {
  OtpField,
  ErrorMessage,
  PasswordField,
  SubmitButton,
} from "../../components/auth-fields";
import { getSafeAuthMessage } from "../../lib/auth-messages";

export function ResetPasswordPage() {
  const [step, setStep] = useState<"otp" | "password">("otp");
  const [completed, setCompleted] = useState(false);
  const email = (useLocation().state as { email?: string } | null)?.email ?? "";
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    if (step === "otp") {
      if (!/^\d{6}$/.test(otp)) {
        setError("Enter the 6-digit reset code sent to your email.");
        return;
      }
      setLoading(true);
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL ?? "http://localhost:3000"}/api/auth/verify-reset-otp`,
          {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, otp }),
          },
        );
        if (!response.ok) {
          throw new Error(getSafeAuthMessage("reset-password", response.status));
        }
        setStep("password");
      } catch (requestError) {
        setError(
          requestError instanceof Error
            ? requestError.message
            : getSafeAuthMessage("reset-password"),
        );
      } finally {
        setLoading(false);
      }
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL ?? "http://localhost:3000"}/api/auth/reset-password`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, otp, newPassword }),
        },
      );
      const data = await response.json();
      if (!response.ok) {
        throw new Error(getSafeAuthMessage("reset-password", response.status));
      }
      setCompleted(true);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : getSafeAuthMessage("reset-password"),
      );
    } finally {
      setLoading(false);
    }
  }

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
      <form onSubmit={submit}>
        {step === "otp" ? (
          <>
            <OtpField
              name="otp"
              value={otp}
              onChange={(event) =>
                setOtp(event.target.value.replace(/\D/g, "").slice(0, 6))
              }
              inputMode="numeric"
              maxLength={6}
            />
            <p className="helper-text">
              Use the reset code sent to your email.
            </p>
          </>
        ) : (
          <>
            <PasswordField
              label="New password"
              name="newPassword"
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
            />
            <PasswordField
              label="Confirm password"
              name="confirmPassword"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
            />
          </>
        )}
        {error && <ErrorMessage message={error} />}
        <SubmitButton loading={loading} icon={<ArrowRight size={17} />}>
          {loading
            ? step === "otp"
              ? "Continuing"
              : "Resetting password"
            : step === "otp"
              ? "Continue"
              : "Reset password"}
        </SubmitButton>
      </form>
      <p className="form-footer">
        <Link className="inline-link" to="/login">
          <ArrowLeft size={15} /> Back to sign in
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
