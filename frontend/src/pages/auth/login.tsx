import { useState } from "react";
import { ArrowRight, Mail } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { AuthHeader } from "../../components/auth-layout";
import {
  Field,
  ErrorMessage,
  PasswordField,
  SubmitButton,
} from "../../components/auth-fields";
import { apiRequest } from "../../lib/api";

export function LoginPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      await apiRequest("/login", {
        method: "POST",
        data: form,
        action: "login",
      });
      navigate("/dashboard", { replace: true });
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "We couldn't sign you in right now. Please try again in a moment.",
      );
    } finally {
      setLoading(false);
    }
  }
  return (
    <>
      <AuthHeader
        eyebrow="SECURE ACCESS"
        title="Welcome back"
        description="Enter your details to access your account."
      />
      <form onSubmit={submit}>
        <Field
          label="Email address"
          icon={Mail}
          type="email"
          placeholder="you@example.com"
          name="email"
          value={form.email}
          onChange={(event) => setForm({ ...form, email: event.target.value })}
        />
        <PasswordField
          name="password"
          value={form.password}
          onChange={(event) =>
            setForm({ ...form, password: event.target.value })
          }
        />
        <Link className="inline-link forgot-link" to="/forgot-password">
          Forgot password?
        </Link>
        {error && <ErrorMessage message={error} />}
        <SubmitButton loading={loading} icon={<ArrowRight size={17} />}>
          {loading ? "Signing in" : "Sign in"}
        </SubmitButton>
      </form>
      <p className="form-footer">
        Don’t have an account?{" "}
        <Link className="inline-link" to="/register">
          Create one
        </Link>
      </p>
    </>
  );
}
