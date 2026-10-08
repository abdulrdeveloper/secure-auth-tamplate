import { useState } from "react";
import { ArrowLeft, ArrowRight, Mail } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { AuthHeader } from "../../components/auth-layout";
import {
  ErrorMessage,
  Field,
  SubmitButton,
} from "../../components/auth-fields";
import { apiRequest } from "../../lib/api";
import { startResetOtpCooldown } from "../../lib/reset-otp-cooldown";

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
            await apiRequest("/forgot-password", {
              method: "POST",
              data: { email },
              action: "forgot-password",
            });
            startResetOtpCooldown(email);
            navigate("/reset-password", { state: { email } });
          } catch (requestError) {
            setError(
              requestError instanceof Error
                ? requestError.message
                : "We couldn't process your request right now. Please try again in a moment.",
            );
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
      <p className="form-footer">
        <Link className="inline-link" to="/login">
          <ArrowLeft size={15} /> Back to sign in
        </Link>
      </p>
    </>
  );
}
