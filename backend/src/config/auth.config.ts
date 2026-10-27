export const ACCESS_TOKEN_TTL_SECONDS = 15 * 60;
export const REFRESH_TOKEN_TTL_SECONDS = 7 * 24 * 60 * 60;

export const OTP_TTL_SECONDS = 5 * 60;
export const OTP_COOLDOWN_SECONDS = 60;
export const OTP_MAX_ATTEMPTS = 5;

export const UNVERIFIED_ACCOUNT_TTL_MS = 24 * 60 * 60 * 1000;

export const BCRYPT_ROUNDS = 10;
export const PASSWORD_MIN_LENGTH = 6;
export const BODY_LIMIT = "10kb";

export const RATE_LIMIT_WINDOW_SECONDS = 15 * 60;
export const RATE_LIMIT_MAX = {
  login: 10,
  email: 10,
  otp: 20,
};
