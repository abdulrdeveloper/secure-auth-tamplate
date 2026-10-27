import type { Request, Response } from "express";

import userModel from "../models/user.model.js";
import { verifyOtpWithRateLimit } from "../services/otp.service.js";
import { setAuthCookies } from "../utils/token.util.js";
import { toPublicUser } from "../utils/user.util.js";

const OTP_ERROR_MESSAGES = {
  expired: "Verification code has expired. Please request a new one.",
  invalid: "Invalid verification code",
  too_many_attempts: "Too many failed attempts. Please request a new code.",
};

async function verifyOtp(req: Request, res: Response) {
  const { email, otp } = req.body;
  const verification = await verifyOtpWithRateLimit(email, otp, "verify");

  if (!verification.success) {
    return res
      .status(400)
      .json({ message: OTP_ERROR_MESSAGES[verification.reason] });
  }

  const user = await userModel.findOne({ email });
  if (!user) {
    return res.status(400).json({ message: OTP_ERROR_MESSAGES.expired });
  }

  user.isEmailVerified = true;
  user.emailVerifiedAt = new Date();
  user.verificationExpiresAt = null;
  await user.save();

  await setAuthCookies(res, user._id);

  return res.status(200).json({
    message: "Email verified successfully",
    user: toPublicUser(user),
  });
}

export { verifyOtp };
