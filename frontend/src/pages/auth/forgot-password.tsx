import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthHeader } from "../../components/auth-layout";
import {
  Field,
  SubmitButton,
} from "../../components/auth-fields";
import { FormError } from "../../components/toast";
import { apiRequest, getErrorMessage } from "../../lib/api";
import { getOtpCooldownKey, startOtpCooldown } from "../../lib/otp-cooldown";

export function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: React.FormEvent) {
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
  }

  return (
    <>
      <AuthHeader
        title="Forgot password?"
        description="Enter your email and we will send you a reset code."
      />
      <form onSubmit={submit}>
        <Field
          label="Email address"
          type="email"
          placeholder="you@example.com"
          name="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
        {error && <FormError message={error} />}
        <SubmitButton loading={loading}>
          {loading ? "Sending code..." : "Send reset code"}
        </SubmitButton>
      </form>
      <p className="mt-6 text-center text-sm">
        <Link className="font-medium text-zinc-100 hover:text-white" to="/login">
          Back to sign in
        </Link>
      </p>
    </>
  );
}
