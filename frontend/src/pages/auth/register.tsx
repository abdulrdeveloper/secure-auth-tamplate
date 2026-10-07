import { useState } from "react";
import { ArrowRight, Mail } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { AuthHeader } from "../../components/auth-layout";
import {
  Field,
  ErrorMessage,
  NameField,
  PasswordField,
  SubmitButton,
} from "../../components/auth-fields";
import { getSafeAuthMessage } from "../../lib/auth-messages";

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
      const response = await fetch(
        `${import.meta.env.VITE_API_URL ?? "http://localhost:3000"}/api/auth/register`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        },
      );
      if (!response.ok) {
        throw new Error(getSafeAuthMessage("register", response.status));
      }
      const cooldownKey = `verify-cooldown:${form.email.trim().toLowerCase()}`;
      localStorage.setItem(cooldownKey, String(Date.now() + 60_000));
      navigate(`/verify-email?email=${encodeURIComponent(form.email)}`);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : getSafeAuthMessage("register"),
      );
    } finally {
      setLoading(false);
    }
  }
  return (
    <>
      <AuthHeader
        eyebrow="GET STARTED"
        title="Create your account"
        description="Join securely with your email and password."
      />
      <form onSubmit={submit}>
        <NameField
          name="name"
          value={form.name}
          onChange={(event) => setForm({ ...form, name: event.target.value })}
        />
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
        {error && <ErrorMessage message={error} />}
        <SubmitButton loading={loading} icon={<ArrowRight size={17} />}>
          {loading ? "Creating account" : "Create account"}
        </SubmitButton>
      </form>
      <p className="form-footer">
        Already have an account?{" "}
        <Link className="inline-link" to="/login">
          Sign in
        </Link>
      </p>
    </>
  );
}
