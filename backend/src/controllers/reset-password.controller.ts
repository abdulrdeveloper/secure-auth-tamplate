import type { Request, Response } from "express";
import bcrypt from "bcrypt";

import userModel from "../models/user.model.js";
import {
  clearOtp,
  validateOtpWithRateLimit,
} from "../services/otp.service.js";
import { revokeRefreshToken } from "../utils/token.util.js";
import { BCRYPT_ROUNDS } from "../config/auth.config.js";

const INVALID_RESET_CODE = {
  message: "Invalid or expired reset code. Request a new one if needed.",
};

async function passwordReset(req: Request, res: Response) {
  const { email, otp, newPassword } = req.body;
  const user = await userModel.findOne({ email });

  if (!user?.isEmailVerified) {
    return res.status(400).json(INVALID_RESET_CODE);
  }

  const verification = await validateOtpWithRateLimit(email, otp, "reset");
  if (!verification.success) {
    return res.status(400).json(INVALID_RESET_CODE);
  }

  user.password = await bcrypt.hash(newPassword, BCRYPT_ROUNDS);
  await user.save();
  await clearOtp(email, "reset");
  await revokeRefreshToken(user._id);

  return res.status(200).json({
    message: "Password reset successful. Please login with your new password.",
  });
}

export { passwordReset };
