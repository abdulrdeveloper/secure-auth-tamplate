import type { Request, Response } from "express";
import userModel from "../models/user.model.js";
import { verifyOtpWithRateLimit } from "../services/otp.service.js";
import { setAuthCookies } from "../utils/token.util.js";
import { toPublicUser } from "../utils/user.util.js";

async function verifyOtp(req: Request, res: Response) {
  try {
    const { email, otp } = req.body;
    const verification = await verifyOtpWithRateLimit(email, otp, "verify");
    if (!verification.success && verification.reason === "expired") {
      return res
        .status(400)
        .json({ message: "Verification code has expired or is invalid" });
    }

    if (!verification.success) {
      if (verification.reason === "too_many_attempts") {
        return res.status(400).json({
          message: "Too many failed attempts. Please request a new code.",
        });
      }

      return res.status(400).json({ message: "Invalid verification code" });
    }

    const user = await userModel.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ message: "The verification code is invalid or expired." });
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
  } catch (error) {
    console.error("Error in verifyOtp:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export { verifyOtp };
