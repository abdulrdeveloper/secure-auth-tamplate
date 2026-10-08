export const RESET_OTP_COOLDOWN_SECONDS = 60;

export function resetOtpCooldownKey(email: string) {
  return `reset-cooldown:${email.trim().toLowerCase()}`;
}

export function getResetOtpCooldownSeconds(key: string) {
  const expiresAt = Number(localStorage.getItem(key));
  if (!Number.isFinite(expiresAt)) return 0;
  return Math.max(Math.ceil((expiresAt - Date.now()) / 1000), 0);
}

export function startResetOtpCooldown(email: string) {
  localStorage.setItem(
    resetOtpCooldownKey(email),
    String(Date.now() + RESET_OTP_COOLDOWN_SECONDS * 1000),
  );
}
