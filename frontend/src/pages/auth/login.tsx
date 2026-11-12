import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth, type AuthUser } from "../../context/auth-context";
import { AuthHeader } from "../../components/auth-layout";
import {
  Field,
  PasswordField,
  SubmitButton,
} from "../../components/auth-fields";
import { FormError } from "../../components/toast";
import { apiRequest, getErrorMessage } from "../../lib/api";

export function LoginPage() {
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
      setUser(response.user);
    } catch (requestError) {
      setError(getErrorMessage(requestError));
      setLoading(false);
    }
  }

  return (
    <>
      <AuthHeader
        title="Welcome back"
        description="Sign in to continue to Clavis."
      />
      <form onSubmit={submit}>
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
        <div className="-mt-2 mb-5 flex justify-end">
          <Link
            className="text-sm font-medium text-zinc-100 hover:text-white"
            to="/forgot-password"
          >
            Forgot password?
          </Link>
        </div>
        {error && <FormError message={error} />}
        <SubmitButton loading={loading}>
          {loading ? "Signing in..." : "Sign in"}
        </SubmitButton>
      </form>
      <p className="mt-6 text-center text-sm text-zinc-400">
        Don&apos;t have an account?{" "}
        <Link className="font-medium text-zinc-100 hover:text-white" to="/register">
          Sign up
        </Link>
      </p>
    </>
  );
}
