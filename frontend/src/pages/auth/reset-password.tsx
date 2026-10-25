import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  LoaderCircle,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { AuthHeader } from "../../components/auth-layout";
import {
  OtpField,
  ErrorMessage,
  PasswordField,
  SubmitButton,
} from "../../components/auth-fields";
import { apiRequest } from "../../lib/api";
import { getOtpCooldownKey } from "../../lib/otp-cooldown";
import { useCooldown } from "../../hooks/use-cooldown";
import { AuthStatus } from "../../components/auth-status";

export function ResetPasswordPage() {
  const [step, setStep] = useState<"otp" | "password">("otp");
  const [completed, setCompleted] = useState(false);
  const email = (useLocation().state as { email?: string } | null)?.email ?? "";
  const cooldownKey = getOtpCooldownKey(email, "reset");
  const { secondsLeft: resendIn, start: triggerCooldown } = useCooldown(cooldownKey);
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  async function resendCode() {
    setError("");
    setResending(true);
    try {
      await apiRequest("/forgot-password", {
        method: "POST",
        data: { email },
        action: "forgot-password",
      });
      triggerCooldown(60);
      setOtp("");
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "We couldn't process your request right now. Please try again in a moment.",
      );
    } finally {
      setResending(false);
    }
  }

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
        await apiRequest("/verify-reset-otp", {
          method: "POST",
          data: { email, otp },
          action: "reset-password",
        });
        setStep("password");
      } catch (requestError) {
        setError(
          requestError instanceof Error
            ? requestError.message
            : "We couldn't reset your password right now. Please try again in a moment.",
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
      await apiRequest("/reset-password", {
        method: "POST",
        data: { email, otp, newPassword },
        action: "reset-password",
      });
      setCompleted(true);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "We couldn't reset your password right now. Please try again in a moment.",
      );
    } finally {
      setLoading(false);
    }
  }

  if (completed) {
    return (
      <AuthStatus
        eyebrow="PASSWORD UPDATED"
        title="Password reset complete"
        description="Your password has been updated successfully. You can now sign in with your new password."
        action={
          <Link className="primary-button success-link" to="/login" replace>
            Go back to sign in <ArrowRight size={17} />
          </Link>
        }
      />
    );
  }

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
            <div className="resend-row">
              <span>Didn't receive the code?</span>
              <button
                type="button"
                className="inline-link resend-button"
                disabled={resending || resendIn > 0}
                onClick={resendCode}
              >
                {resending && <LoaderCircle className="animate-spin" size={13} />}
                {resending
                  ? "Sending..."
                  : resendIn > 0
                    ? `Resend in ${resendIn}s`
                    : "Resend code"}
              </button>
            </div>
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
