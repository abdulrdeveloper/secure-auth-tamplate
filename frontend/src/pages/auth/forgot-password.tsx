import { ArrowRight, Mail } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { AuthHeader } from "../../components/auth-layout";
import { Field, SubmitButton } from "../../components/auth-fields";

export function ForgotPasswordPage() {
  const navigate = useNavigate();
  return (
    <>
      <AuthHeader
        eyebrow="ACCOUNT RECOVERY"
        title="Forgot password?"
        description="Enter your email and we’ll send you a reset code."
      />
      <form
        onSubmit={(event) => {
          event.preventDefault();
          navigate("/reset-password");
        }}
      >
        <Field
          label="Email address"
          icon={Mail}
          type="email"
          placeholder="you@example.com"
        />
        <SubmitButton icon={<ArrowRight size={17} />}>
          Send reset code
        </SubmitButton>
      </form>
      <p className="form-footer">
        <Link className="inline-link" to="/login">
          ← Back to sign in
        </Link>
      </p>
    </>
  );
}
