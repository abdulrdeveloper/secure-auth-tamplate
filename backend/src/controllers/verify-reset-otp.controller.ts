import type { Request, Response } from "express";

import userModel from "../models/user.model.js";
import { validateOtpWithRateLimit } from "../services/otp.service.js";

const INVALID_RESET_CODE = {
  message: "Invalid or expired reset code. Request a new one if needed.",
};

async function verifyResetOtp(req: Request, res: Response) {
  const { email, otp } = req.body;
  const user = await userModel.findOne({ email });

  if (!user?.isEmailVerified) {
    return res.status(400).json(INVALID_RESET_CODE);
  }

  const verification = await validateOtpWithRateLimit(email, otp, "reset");
  if (!verification.success) {
    return res.status(400).json(INVALID_RESET_CODE);
  }

  return res.status(200).json({ message: "Reset OTP verified" });
}

export { verifyResetOtp };
