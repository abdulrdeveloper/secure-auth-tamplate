import type { Request, Response } from "express";
import bcrypt from "bcrypt";

import userModel from "../models/user.model.js";
import {
  clearOtp,
  validateOtpWithRateLimit,
} from "../services/otp.service.js";

async function passwordReset(req: Request, res: Response) {
  try {
    const { email, otp, newPassword } = req.body;
    const user = await userModel.findOne({ email });

    if (!user?.isEmailVerified) {
      return res
        .status(400)
        .json({
          message: "Invalid or expired reset code. Request a new one if needed.",
        });
    }

    const verification = await validateOtpWithRateLimit(email, otp, "reset");
    if (!verification.success) {
      return res.status(400).json({
        message: "Invalid or expired reset code. Request a new one if needed.",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();
    await clearOtp(email, "reset");

    return res.status(200).json({
      message:
        "Password reset successful. Please login with your new password.",
    });
  } catch (error) {
    console.error("Error in passwordReset:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export { passwordReset };
