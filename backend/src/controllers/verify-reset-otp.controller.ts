import type { Request, Response } from "express";

import userModel from "../models/user.model.js";
import { validateOtpWithRateLimit } from "../services/otp.service.js";

async function verifyResetOtp(req: Request, res: Response) {
  try {
    const { email, otp } = req.body;
    const user = await userModel.findOne({ email });

    if (!user?.isEmailVerified) {
      return res.status(400).json({
        message: "Invalid or expired reset code. Request a new one if needed.",
      });
    }

    const verification = await validateOtpWithRateLimit(email, otp, "reset");

    if (!verification.success) {
      return res.status(400).json({
        message: "Invalid or expired reset code. Request a new one if needed.",
      });
    }

    return res.status(200).json({ message: "Reset OTP verified" });
  } catch (error) {
    console.error("Error in verifyResetOtp:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export { verifyResetOtp };
