export type OtpType = "verify" | "reset";

export function getOtpCooldownKey(email: string, type: OtpType): string {
  return `${type}-cooldown:${email.trim().toLowerCase()}`;
}

export function getCooldownRemaining(key: string): number {
  const expiresAt = Number(localStorage.getItem(key));
  if (!Number.isFinite(expiresAt)) return 0;
  return Math.max(Math.ceil((expiresAt - Date.now()) / 1000), 0);
}

export function startOtpCooldown(key: string, seconds: number): void {
  localStorage.setItem(key, String(Date.now() + seconds * 1000));
}
