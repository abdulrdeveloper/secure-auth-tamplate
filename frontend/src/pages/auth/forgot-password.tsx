import { useState } from "react";
import { ArrowLeft, ArrowRight, Mail } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { AuthHeader } from "../../components/auth-layout";
import {
  ErrorMessage,
  Field,
  SubmitButton,
} from "../../components/auth-fields";
import { getSafeAuthMessage } from "../../lib/auth-messages";

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
            const response = await fetch(
              `${import.meta.env.VITE_API_URL ?? "http://localhost:3000"}/api/auth/forgot-password`,
              {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
              },
            );
            if (!response.ok) {
              throw new Error(getSafeAuthMessage("forgot-password", response.status));
            }
            navigate("/reset-password", { state: { email } });
          } catch (requestError) {
            setError(
              requestError instanceof Error
                ? requestError.message
                : getSafeAuthMessage("forgot-password"),
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
