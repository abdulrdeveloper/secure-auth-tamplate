import { useEffect, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  LoaderCircle,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { AuthHeader } from "../../components/auth-layout";
import {
  OtpField,
  ErrorMessage,
  PasswordField,
  SubmitButton,
} from "../../components/auth-fields";
import { apiRequest } from "../../lib/api";
import {
  getResetOtpCooldownSeconds,
  resetOtpCooldownKey,
  startResetOtpCooldown,
} from "../../lib/reset-otp-cooldown";

export function ResetPasswordPage() {
  const [step, setStep] = useState<"otp" | "password">("otp");
  const [completed, setCompleted] = useState(false);
  const email = (useLocation().state as { email?: string } | null)?.email ?? "";
  const cooldownKey = resetOtpCooldownKey(email);
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [resendIn, setResendIn] = useState(() =>
    getResetOtpCooldownSeconds(cooldownKey),
  );

  useEffect(() => {
    const updateCountdown = () => {
      const remaining = getResetOtpCooldownSeconds(cooldownKey);
      setResendIn(remaining);
      if (remaining === 0) localStorage.removeItem(cooldownKey);
    };
    updateCountdown();
    const timer = window.setInterval(updateCountdown, 1000);
    return () => window.clearInterval(timer);
  }, [cooldownKey]);

  async function resendCode() {
    setError("");
    setResending(true);
    try {
      await apiRequest("/forgot-password", {
        method: "POST",
        data: { email },
        action: "forgot-password",
      });
      startResetOtpCooldown(email);
      setResendIn(getResetOtpCooldownSeconds(cooldownKey));
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
