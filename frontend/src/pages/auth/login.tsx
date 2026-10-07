import { ArrowRight, Mail } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { AuthHeader } from "../../components/auth-layout";
import {
  Field,
  PasswordField,
  SubmitButton,
} from "../../components/auth-fields";

export function LoginPage() {
  const navigate = useNavigate();
  function submit(event: React.FormEvent) {
    event.preventDefault();
    sessionStorage.setItem("demo-authenticated", "true");
    navigate("/dashboard", { replace: true });
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
        />
        <PasswordField />
        <Link className="inline-link forgot-link" to="/forgot-password">
          Forgot password?
        </Link>
        <SubmitButton icon={<ArrowRight size={17} />}>Sign in</SubmitButton>
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
