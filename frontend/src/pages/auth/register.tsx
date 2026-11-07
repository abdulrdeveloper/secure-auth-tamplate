import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthHeader } from "../../components/auth-layout";
import {
  Field,
  ErrorMessage,
  NameField,
  PasswordField,
  SubmitButton,
} from "../../components/auth-fields";
import { apiRequest, getErrorMessage } from "../../lib/api";
import { getOtpCooldownKey, startOtpCooldown } from "../../lib/otp-cooldown";

export function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { resendAfter } = await apiRequest<{ resendAfter: number }>(
        "/auth/register",
        { method: "POST", data: form },
      );
      startOtpCooldown(getOtpCooldownKey(form.email, "verify"), resendAfter);
      navigate(`/verify-email?email=${encodeURIComponent(form.email)}`);
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <AuthHeader
        title="Create your account"
        description="Sign up with your email and a password."
      />
      <form onSubmit={submit}>
        <NameField
          name="name"
          value={form.name}
          onChange={(event) => setForm({ ...form, name: event.target.value })}
        />
        <Field
          label="Email address"
          type="email"
          placeholder="you@example.com"
          name="email"
          value={form.email}
          onChange={(event) => setForm({ ...form, email: event.target.value })}
        />
        <PasswordField
          name="password"
          value={form.password}
          onChange={(event) => setForm({ ...form, password: event.target.value })}
        />
        {error && <ErrorMessage message={error} />}
        <SubmitButton loading={loading}>
          {loading ? "Creating account..." : "Continue"}
        </SubmitButton>
      </form>
      <p className="mt-6 text-center text-sm text-zinc-400">
        Already have an account?{" "}
        <Link className="font-medium text-zinc-100 hover:text-white" to="/login">
          Sign in
        </Link>
      </p>
    </>
  );
}
