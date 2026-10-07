import { ArrowRight, Mail } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { AuthHeader } from "../../components/auth-layout";
import {
  Field,
  NameField,
  PasswordField,
  SubmitButton,
} from "../../components/auth-fields";

export function RegisterPage() {
  const navigate = useNavigate();
  return (
    <>
      <AuthHeader
        eyebrow="GET STARTED"
        title="Create your account"
        description="Join securely with your email and password."
      />
      <form
        onSubmit={(event) => {
          event.preventDefault();
          navigate("/verify-email");
        }}
      >
        <NameField />
        <Field
          label="Email address"
          icon={Mail}
          type="email"
          placeholder="you@example.com"
        />
        <PasswordField />
        <SubmitButton icon={<ArrowRight size={17} />}>
          Create account
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
