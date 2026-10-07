export type AuthAction =
  | "register"
  | "login"
  | "forgot-password"
  | "verify-email"
  | "resend-code"
  | "reset-password";

export function getSafeAuthMessage(action: AuthAction, status?: number) {
  if (action === "login") {
    return status === 400 || status === 401
      ? "The email or password is incorrect."
      : "We couldn't sign you in right now. Please try again.";
  }

  if (action === "register") {
    return "We couldn't create your account right now. Please check your details and try again.";
  }

  if (action === "forgot-password") {
    return "We couldn't process your request right now. Please try again.";
  }

  if (action === "verify-email") {
    return "We couldn't verify that code. Please check it and try again.";
  }

  if (action === "resend-code") {
    return "We couldn't send a new code right now. Please try again shortly.";
  }

  return "We couldn't reset your password right now. Please try again.";
}
