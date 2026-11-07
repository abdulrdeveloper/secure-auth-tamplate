import type { Request, Response } from "express";
import bcrypt from "bcrypt";

import {
  BCRYPT_ROUNDS,
  OTP_COOLDOWN_SECONDS,
  UNVERIFIED_ACCOUNT_TTL_MS,
} from "../config/auth.config.js";
import userModel from "../models/user.model.js";
import {
  checkCooldown,
  clearOtp,
  generateAndStoreOtp,
} from "../services/otp.service.js";
import { sendVerificationEmail } from "../services/mail.service.js";

async function registerUser(req: Request, res: Response) {
  const { name, email, password } = req.body;

  const successResponse = {
    message: "Registration successful. Please check your email for the verification OTP.",
    email,
    resendAfter: OTP_COOLDOWN_SECONDS,
  };

  if (await userModel.exists({ email, isEmailVerified: true })) {
    return res
      .status(400)
      .json({ message: "Unable to create an account with these details." });
  }

  if (await checkCooldown(email, "verify")) {
    return res.status(201).json(successResponse);
  }

  await userModel.updateOne(
    { email },
    {
      name,
      password: await bcrypt.hash(password, BCRYPT_ROUNDS),
      verificationExpiresAt: new Date(Date.now() + UNVERIFIED_ACCOUNT_TTL_MS),
    },
    { upsert: true },
  );

  const otp = await generateAndStoreOtp(email, "verify");

  try {
    await sendVerificationEmail(email, otp);
  } catch (emailError) {
    console.error("Email send failed in registerUser:", emailError);
    await clearOtp(email, "verify");
    return res.status(500).json({
      message: "Failed to send verification email. Please try again.",
    });
  }

  return res.status(201).json(successResponse);
}

export { registerUser };
