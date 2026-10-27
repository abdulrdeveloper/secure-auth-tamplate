import type { Request, Response } from "express";

import { OTP_COOLDOWN_SECONDS } from "../config/auth.config.js";
import userModel from "../models/user.model.js";
import {
  checkCooldown,
  clearOtp,
  generateAndStoreOtp,
} from "../services/otp.service.js";
import { sendPasswordResetEmail } from "../services/mail.service.js";

const GENERIC_RESPONSE = {
  message: "If an account matches this email, reset instructions will be sent.",
  resendAfter: OTP_COOLDOWN_SECONDS,
};

async function forgotPassword(req: Request, res: Response) {
  const { email } = req.body;
  const user = await userModel.findOne({ email });

  if (!user?.isEmailVerified || (await checkCooldown(email, "reset"))) {
    return res.status(200).json(GENERIC_RESPONSE);
  }

  const otp = await generateAndStoreOtp(email, "reset");

  try {
    await sendPasswordResetEmail(email, otp);
  } catch (emailError) {
    await clearOtp(email, "reset");
    throw emailError;
  }

  return res.status(200).json(GENERIC_RESPONSE);
}

export { forgotPassword };
