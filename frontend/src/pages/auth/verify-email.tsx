import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthHeader } from "../../components/auth-layout";
import {
  ErrorMessage,
  OtpField,
  ResendCode,
  SubmitButton,
} from "../../components/auth-fields";
import { apiRequest, getErrorMessage } from "../../lib/api";
import { getOtpCooldownKey } from "../../lib/otp-cooldown";
import { useAuth, type AuthUser } from "../../context/auth-context";
import { VerificationSuccess } from "./verification-success";

export function VerifyEmailPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setUser } = useAuth();
  const email =
    new URLSearchParams(location.search).get("email") ??
    (location.state as { email?: string } | null)?.email ??
    "";
  const [verifiedUser, setVerifiedUser] = useState<AuthUser | null>(null);
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (verifiedUser) {
      const timer = window.setTimeout(() => {
        setUser(verifiedUser);
        navigate("/dashboard", { replace: true });
      }, 1200);
      return () => window.clearTimeout(timer);
    }
  }, [verifiedUser, setUser, navigate]);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await apiRequest<{ user: AuthUser }>("/auth/verify-email", {
        method: "POST",
        data: { email, otp },
      });
      setVerifiedUser(response.user);
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setLoading(false);
    }
  }

  const backToLogin = (
    <p className="mt-7 text-center text-[13px] text-zinc-500">
      <Link
        className="group inline-flex items-center gap-1.5 text-[13px] font-semibold text-lime-300 hover:underline"
        to="/login"
      >
        <ArrowLeft size={15} className="transition-transform duration-200 ease-out group-hover:-translate-x-1" />
        Back to sign in
      </Link>
    </p>
  );

  if (!email) {
    return (
      <>
        <AuthHeader
          eyebrow="EMAIL VERIFICATION"
          title="Verification link incomplete"
          description="Return to sign in and use your account email to continue."
        />
        <ErrorMessage message="We could not find the email address for this verification request." />
        {backToLogin}
      </>
    );
  }

  if (verifiedUser) return <VerificationSuccess />;

  return (
    <>
      <AuthHeader
        eyebrow="EMAIL VERIFICATION"
        title="Check your inbox"
        description="Enter the 6-digit code we sent to verify your email."
      />
      <form onSubmit={submit}>
        <OtpField value={otp} onValueChange={setOtp} />
        <ResendCode
          cooldownKey={getOtpCooldownKey(email, "verify")}
          onResend={() =>
            apiRequest<{ resendAfter: number }>("/auth/resend-otp", {
              method: "POST",
              data: { email },
            })
          }
          onError={setError}
        />
        {error && <ErrorMessage message={error} />}
        <SubmitButton loading={loading} icon={<ArrowRight size={17} />}>
          {loading ? "Verifying..." : "Verify email"}
        </SubmitButton>
      </form>
      {backToLogin}
    </>
  );
}
