import { useState } from "react";
import { ArrowLeft, ArrowRight, Mail } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { AuthHeader } from "../../components/auth-layout";
import {
  ErrorMessage,
  Field,
  SubmitButton,
} from "../../components/auth-fields";
import { apiRequest, getErrorMessage } from "../../lib/api";
import { getOtpCooldownKey, startOtpCooldown } from "../../lib/otp-cooldown";

export function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  return (
    <>
      <AuthHeader
        eyebrow="ACCOUNT RECOVERY"
        title="Forgot password?"
        description="Enter your email and we’ll send you a reset code."
      />
      <form
        onSubmit={async (event) => {
          event.preventDefault();
          setError("");
          setLoading(true);
          try {
            const { resendAfter } = await apiRequest<{ resendAfter: number }>(
              "/auth/forgot-password",
              { method: "POST", data: { email } },
            );
            startOtpCooldown(getOtpCooldownKey(email, "reset"), resendAfter);
            navigate("/reset-password", { state: { email } });
          } catch (requestError) {
            setError(getErrorMessage(requestError));
          } finally {
            setLoading(false);
          }
        }}
      >
        <Field
          label="Email address"
          icon={Mail}
          type="email"
          placeholder="you@example.com"
          name="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
        {error && <ErrorMessage message={error} />}
        <SubmitButton loading={loading} icon={<ArrowRight size={17} />}>
          {loading ? "Sending code" : "Send reset code"}
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
