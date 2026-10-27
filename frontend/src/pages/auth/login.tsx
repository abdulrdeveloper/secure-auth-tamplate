import { useState } from "react";
import { ArrowRight, Mail } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth, type AuthUser } from "../../context/auth-context";
import { AuthHeader } from "../../components/auth-layout";
import {
  Field,
  ErrorMessage,
  PasswordField,
  SubmitButton,
} from "../../components/auth-fields";
import { apiRequest, getErrorMessage } from "../../lib/api";

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setUser } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await apiRequest<{ user: AuthUser }>("/auth/login", {
        method: "POST",
        data: form,
      });
      const from = (location.state as { from?: string } | null)?.from;
      setUser(response.user);
      navigate(from ?? "/dashboard", { replace: true });
    } catch (requestError) {
      setError(getErrorMessage(requestError));
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
        <Link
          className="-mt-1.5 mb-[22px] block text-right text-[13px] font-semibold text-lime-300 hover:underline"
          to="/forgot-password"
        >
          Forgot password?
        </Link>
        {error && <ErrorMessage message={error} />}
        <SubmitButton loading={loading} icon={<ArrowRight size={17} />}>
          {loading ? "Signing in" : "Sign in"}
        </SubmitButton>
      </form>
      <p className="mt-7 text-center text-[13px] text-zinc-500">
        Don’t have an account?{" "}
        <Link
          className="inline-flex items-center gap-1 text-[13px] font-semibold text-lime-300 hover:underline"
          to="/register"
        >
          Create one
        </Link>
      </p>
    </>
  );
}
