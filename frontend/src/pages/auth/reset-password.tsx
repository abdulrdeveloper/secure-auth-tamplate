import { useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Link, Navigate, useLocation } from "react-router-dom";
import { AuthHeader } from "../../components/auth-layout";
import {
  ErrorMessage,
  OtpField,
  PasswordField,
  ResendCode,
  SubmitButton,
} from "../../components/auth-fields";
import { AuthStatus } from "../../components/auth-status";
import { apiRequest, getErrorMessage } from "../../lib/api";
import { getOtpCooldownKey } from "../../lib/otp-cooldown";

export function ResetPasswordPage() {
  const email = (useLocation().state as { email?: string } | null)?.email ?? "";
  const [step, setStep] = useState<"otp" | "password">("otp");
  const [completed, setCompleted] = useState(false);
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function resendCode() {
    const response = await apiRequest<{ resendAfter: number }>(
      "/auth/forgot-password",
      { method: "POST", data: { email } },
    );
    setOtp("");
    return response;
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setError("");

    if (step === "otp" && otp.length !== 6) {
      setError("Enter the 6-digit reset code sent to your email.");
      return;
    }

    if (step === "password" && newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      if (step === "otp") {
        await apiRequest("/auth/verify-reset-otp", {
          method: "POST",
          data: { email, otp },
        });
        setStep("password");
      } else {
        await apiRequest("/auth/reset-password", {
          method: "POST",
          data: { email, otp, newPassword },
        });
        setCompleted(true);
      }
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setLoading(false);
    }
  }

  if (!email) {
    return <Navigate to="/forgot-password" replace />;
  }

  if (completed) {
    return (
      <AuthStatus
        eyebrow="PASSWORD UPDATED"
        title="Password reset complete"
        description="Your password has been updated successfully. You can now sign in with your new password."
        action={
          <Link
            className="mt-7 flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-lg border-0 bg-lime-300 font-bold text-zinc-950 no-underline transition-[filter,transform] hover:-translate-y-px hover:brightness-110"
            to="/login"
            replace
          >
            Go back to sign in <ArrowRight size={17} />
          </Link>
        }
      />
    );
  }

  const isOtpStep = step === "otp";

  return (
    <>
      <AuthHeader
        eyebrow="ACCOUNT RECOVERY"
        title={isOtpStep ? "Enter your reset code" : "Choose a new password"}
        description={
          isOtpStep
            ? "Use the code sent to your email to continue."
            : "Create a new password for your secure account."
        }
      />
      <form onSubmit={submit}>
        {isOtpStep ? (
          <>
            <OtpField value={otp} onValueChange={setOtp} />
            <ResendCode
              cooldownKey={getOtpCooldownKey(email, "reset")}
              onResend={resendCode}
              onError={setError}
            />
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
          {isOtpStep
            ? loading ? "Continuing" : "Continue"
            : loading ? "Resetting password" : "Reset password"}
        </SubmitButton>
      </form>
      <p className="mt-7 text-center text-[13px] text-zinc-500">
        <Link
          className="inline-flex items-center gap-1 text-[13px] font-semibold text-lime-300 hover:underline"
          to="/login"
        >
          <ArrowLeft size={15} /> Back to sign in
        </Link>
      </p>
    </>
  );
}
