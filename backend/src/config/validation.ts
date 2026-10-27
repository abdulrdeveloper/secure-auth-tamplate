import { z } from "zod";
import { PASSWORD_MIN_LENGTH } from "./auth.config.js";

const email = z
  .string({ message: "Email is required" })
  .trim()
  .email("Invalid email address")
  .toLowerCase();

const password = z
  .string({ message: "Password is required" })
  .min(
    PASSWORD_MIN_LENGTH,
    `Password must be at least ${PASSWORD_MIN_LENGTH} characters`,
  );

const otp = z
  .string({ message: "OTP code is required" })
  .trim()
  .regex(/^\d{6}$/, "OTP must be a 6-digit code");

export const registerSchema = z.object({
  name: z
    .string({ message: "Name is required" })
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must not exceed 100 characters"),
  email,
  password,
});

export const loginSchema = z.object({ email, password });

export const emailSchema = z.object({ email });

export const verifyOtpSchema = z.object({ email, otp });

export const resetPasswordSchema = z.object({
  email,
  otp,
  newPassword: password,
});
