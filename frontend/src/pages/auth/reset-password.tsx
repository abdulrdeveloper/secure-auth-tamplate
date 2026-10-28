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
            className="group relative mt-7 flex h-12 w-full cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-xl border border-lime-200/50 bg-gradient-to-b from-lime-300 via-lime-300 to-lime-400 text-[14px] font-semibold text-zinc-950 no-underline tracking-[-0.01em] shadow-[inset_0_1px_0_rgba(255,255,255,0.45),0_1px_3px_rgba(0,0,0,0.4),0_0_20px_-3px_rgba(190,242,100,0.3)] transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-lime-200/80 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.65),0_8px_20px_-4px_rgba(0,0,0,0.5),0_0_30px_rgba(190,242,100,0.5)] active:translate-y-0 active:scale-[0.985]"
            to="/login"
            replace
          >
            <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/35 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full" />
            <span className="pointer-events-none absolute inset-x-0 top-0 h-px bg-white/40" />
            <span className="relative z-10 flex items-center gap-2">
              <span>Go back to sign in</span>
              <span className="inline-flex transition-transform duration-200 ease-out group-hover:translate-x-1.5">
                <ArrowRight size={17} />
              </span>
            </span>
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
          className="group inline-flex items-center gap-1.5 text-[13px] font-semibold text-lime-300 hover:underline"
          to="/login"
        >
          <ArrowLeft size={15} className="transition-transform duration-200 ease-out group-hover:-translate-x-1" />
          Back to sign in
        </Link>
      </p>
    </>
  );
}
