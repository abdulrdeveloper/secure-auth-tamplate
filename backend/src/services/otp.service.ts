import crypto from "crypto";
import {
  OTP_COOLDOWN_SECONDS,
  OTP_MAX_ATTEMPTS,
  OTP_TTL_SECONDS,
} from "../config/auth.config.js";
import redis from "./redis.service.js";

export type OtpType = "verify" | "reset";

export type VerificationResult =
  | { success: true }
  | { success: false; reason: "expired" | "invalid" | "too_many_attempts" };

function getKeys(email: string, type: OtpType) {
  return {
    otp: `auth:${type}_otp:${email}`,
    cooldown: `auth:${type}_cooldown:${email}`,
    attempts: `auth:${type}_attempts:${email}`,
  };
}

export async function checkCooldown(email: string, type: OtpType): Promise<boolean> {
  const keys = getKeys(email, type);
  const exists = await redis.get(keys.cooldown);
  return Boolean(exists);
}

export async function generateAndStoreOtp(email: string, type: OtpType): Promise<string> {
  const otp = crypto.randomInt(100000, 1000000).toString();
  const keys = getKeys(email, type);

  await redis.set(keys.otp, otp, { ex: OTP_TTL_SECONDS });
  await redis.set(keys.cooldown, "1", { ex: OTP_COOLDOWN_SECONDS });
  await redis.del(keys.attempts);

  return otp;
}

export async function verifyOtpWithRateLimit(
  email: string,
  otp: string,
  type: OtpType,
  consumeOnSuccess = true,
): Promise<VerificationResult> {
  const keys = getKeys(email, type);

  const attempts = await redis.incr(keys.attempts);
  if (attempts === 1) {
    await redis.expire(keys.attempts, OTP_TTL_SECONDS);
  }

  if (attempts > OTP_MAX_ATTEMPTS) {
    await redis.del(keys.otp);
    return { success: false, reason: "too_many_attempts" };
  }

  const storedOtp = await redis.get<string>(keys.otp);

  if (!storedOtp) {
    return { success: false, reason: "expired" };
  }

  const isMatch = String(storedOtp).trim() === String(otp).trim();

  if (isMatch) {
    if (consumeOnSuccess) {
      await redis.del(keys.otp, keys.attempts);
    } else {
      await redis.del(keys.attempts);
    }
    return { success: true };
  }

  if (attempts === OTP_MAX_ATTEMPTS) {
    await redis.del(keys.otp, keys.attempts);
    return { success: false, reason: "too_many_attempts" };
  }

  return { success: false, reason: "invalid" };
}

export async function validateOtpWithRateLimit(
  email: string,
  otp: string,
  type: OtpType,
): Promise<VerificationResult> {
  return verifyOtpWithRateLimit(email, otp, type, false);
}

export async function clearOtp(email: string, type: OtpType): Promise<void> {
  const keys = getKeys(email, type);
  await redis.del(keys.otp, keys.cooldown, keys.attempts);
}
