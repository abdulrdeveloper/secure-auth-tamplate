import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, LoaderCircle } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthHeader } from "../../components/auth-layout";
import {
  ErrorMessage,
  OtpField,
  SubmitButton,
} from "../../components/auth-fields";
import { apiRequest } from "../../lib/api";
import { getOtpCooldownKey } from "../../lib/otp-cooldown";
import { useCooldown } from "../../hooks/use-cooldown";
import { VerificationSuccess } from "./verification-success";

export function VerifyEmailPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const email =
    new URLSearchParams(location.search).get("email") ??
    (location.state as { email?: string } | null)?.email ??
    "";
  const cooldownKey = getOtpCooldownKey(email, "verify");
  const { secondsLeft: resendIn, start: triggerCooldown } = useCooldown(cooldownKey);
  const [completed, setCompleted] = useState(false);
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  useEffect(() => {
    if (completed) {
      const timer = window.setTimeout(
        () => navigate("/dashboard", { replace: true }),
        1200,
      );
      return () => window.clearTimeout(timer);
    }
  }, [completed, navigate]);

  if (!email) {
    return (
      <>
        <AuthHeader
          eyebrow="EMAIL VERIFICATION"
          title="Verification link incomplete"
          description="Return to sign in and use your account email to continue."
        />
        <p
          className="mt-[-5px] mb-[18px] flex items-start gap-2 rounded-lg border border-red-900/70 bg-red-950/40 px-3 py-2.5 text-xs leading-relaxed text-red-300"
          role="alert"
        >
          We could not find the email address for this verification request.
        </p>
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
          setError("");
          setLoading(true);
          apiRequest("/verify-email", {
            method: "POST",
            data: { email, otp },
            action: "verify-email",
          })
            .then(() => {
              setCompleted(true);
            })
            .catch((requestError) =>
              setError(
                requestError instanceof Error
                  ? requestError.message
                  : "We couldn't verify your email right now. Please try again in a moment.",
              ),
            )
            .finally(() => setLoading(false));
        }}
      >
        <OtpField
          name="otp"
          value={otp}
          onChange={(event) => setOtp(event.target.value)}
        />
        <div className="mt-[-3px] mb-5 flex items-center justify-between text-xs text-zinc-500">
          <span>Didn't receive the code?</span>
          <button
            type="button"
            className="inline-flex cursor-pointer items-center gap-1 border-0 bg-transparent p-0 text-[13px] font-semibold text-lime-300 hover:underline disabled:cursor-not-allowed disabled:opacity-60"
            disabled={resending || resendIn > 0}
            onClick={() => {
              setResending(true);
              setError("");
              apiRequest("/resend-otp", {
                method: "POST",
                data: { email },
                action: "resend-code",
              })
                .then(() => {
                  triggerCooldown(60);
                })
                .catch((requestError) => {
                  setError(
                    requestError instanceof Error
                      ? requestError.message
                      : "We couldn't send a new code right now. Please try again in a moment.",
                  );
                })
                .finally(() => setResending(false));
            }}
          >
            {resending && <LoaderCircle className="animate-spin" size={13} />}
            {resending
              ? "Sending..."
              : resendIn > 0
                ? `Resend in ${resendIn}s`
                : "Resend code"}
          </button>
        </div>
        {error && <ErrorMessage message={error} />}
        <SubmitButton loading={loading} icon={<ArrowRight size={17} />}>
          {loading ? "Verifying..." : "Verify email"}
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
