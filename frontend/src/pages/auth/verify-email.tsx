import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, LoaderCircle } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthHeader } from "../../components/auth-layout";
import {
  ErrorMessage,
  OtpField,
  SubmitButton,
} from "../../components/auth-fields";
import { getSafeAuthMessage } from "../../lib/auth-messages";
import { VerificationSuccess } from "./verification-success";

export function VerifyEmailPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const email =
    new URLSearchParams(location.search).get("email") ??
    (location.state as { email?: string } | null)?.email ??
    "";
  const cooldownKey = `verify-cooldown:${email.trim().toLowerCase()}`;
  const [completed, setCompleted] = useState(false);
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [resendIn, setResendIn] = useState(() =>
    getCooldownSeconds(cooldownKey),
  );

  useEffect(() => {
    const updateCountdown = () => {
      const remaining = getCooldownSeconds(cooldownKey);
      setResendIn(remaining);
      if (remaining === 0) {
        localStorage.removeItem(cooldownKey);
      }
    };
    updateCountdown();
    const timer = window.setInterval(updateCountdown, 1000);

    return () => window.clearInterval(timer);
  }, [cooldownKey]);

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
        <p className="error-message" role="alert">
          We could not find the email address for this verification request.
        </p>
        <p className="form-footer">
          <Link className="inline-link" to="/login">
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
          fetch(
            `${import.meta.env.VITE_API_URL ?? "http://localhost:3000"}/api/auth/verify-email`,
            {
              method: "POST",
              credentials: "include",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ email, otp }),
            },
          )
            .then(async (response) => {
              if (!response.ok) {
                throw new Error(getSafeAuthMessage("verify-email", response.status));
              }
              setCompleted(true);
            })
            .catch((requestError) =>
              setError(
                requestError instanceof Error
                  ? requestError.message
                  : getSafeAuthMessage("verify-email"),
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
        <div className="resend-row">
          <span>Didn't receive the code?</span>
          <button
            type="button"
            className="inline-link resend-button"
            disabled={resending || resendIn > 0}
            onClick={() => {
              setResending(true);
              setError("");
              fetch(
                `${import.meta.env.VITE_API_URL ?? "http://localhost:3000"}/api/auth/resend-otp`,
                {
                  method: "POST",
                  credentials: "include",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ email }),
                },
              )
                .then(async (response) => {
                  if (!response.ok) {
                    throw new Error(getSafeAuthMessage("resend-code", response.status));
                  }
                  startCooldown(cooldownKey);
                  setResendIn(60);
                })
                .catch((requestError) => {
                  const message =
                    requestError instanceof Error
                      ? requestError.message
                      : getSafeAuthMessage("resend-code");
                  const cooldown = message.match(/(\d+)\s*seconds?/i);
                  if (cooldown) {
                    startCooldown(cooldownKey, Number(cooldown[1]));
                    setResendIn(Number(cooldown[1]));
                    setError("");
                    return;
                  }

                  setError(message);
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
      <p className="form-footer">
        <Link className="inline-link" to="/login">
          <ArrowLeft size={15} /> Back to sign in
        </Link>
      </p>
    </>
  );
}

function getCooldownSeconds(key: string) {
  const expiresAt = Number(localStorage.getItem(key));
  if (!Number.isFinite(expiresAt)) return 0;
  return Math.max(Math.ceil((expiresAt - Date.now()) / 1000), 0);
}

function startCooldown(key: string, seconds = 60) {
  localStorage.setItem(key, String(Date.now() + seconds * 1000));
}
