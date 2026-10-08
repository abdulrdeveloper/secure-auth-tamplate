export type AuthAction =
  | "register"
  | "login"
  | "forgot-password"
  | "verify-email"
  | "resend-code"
  | "reset-password";

export function getSafeAuthMessage(action: AuthAction, status?: number): string {
  if (action === "login") {
    return status === 400 || status === 401
      ? "We couldn't sign you in with those details. Check your email and password, then try again."
      : "We couldn't sign you in right now. Please try again in a moment.";
  }

  if (action === "register") {
    return status === 400
      ? "We couldn't create an account with those details. Check them or try signing in."
      : "We couldn't create your account right now. Please try again in a moment.";
  }

  if (action === "forgot-password") {
    return "We couldn't process your request right now. Please try again in a moment.";
  }

  if (action === "verify-email") {
    return status === 400
      ? "That verification code couldn't be confirmed. Check the code or request a new one."
      : "We couldn't verify your email right now. Please try again in a moment.";
  }

  if (action === "resend-code") {
    return status === 429
      ? "Please wait a little before requesting another code."
      : "We couldn't send a new code right now. Please try again in a moment.";
  }

  return status === 400
    ? "That reset code couldn't be confirmed. Check the code or request a new one."
    : "We couldn't reset your password right now. Please try again in a moment.";
}

export function getSafeApiMessage(status?: number): string {
  if (status === 401 || status === 403) {
    return "Your session has expired. Please sign in again.";
  }

  if (status === 404) {
    return "The requested information could not be found.";
  }

  if (status !== undefined && status >= 500) {
    return "The service is temporarily unavailable. Please try again in a moment.";
  }

  return "We couldn't complete that request. Please try again.";
}
