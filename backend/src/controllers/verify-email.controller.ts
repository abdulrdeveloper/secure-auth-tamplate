import type { Request, Response } from "express";
import jwt from "jsonwebtoken";

import userModel from "../models/user.model.js";
import { COOKIE_OPTIONS } from "../config/cookie.config.js";
import { verifyOtpWithRateLimit } from "../services/otp.service.js";

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

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET as string,
      { expiresIn: "1h" },
    );

    res.cookie("token", token, COOKIE_OPTIONS);

    const passwordlessUser = user.toObject();
    delete passwordlessUser.password;
    delete passwordlessUser.verificationExpiresAt;

    return res.status(200).json({
      message: "Email verified successfully",
      user: passwordlessUser,
    });
  } catch (error) {
    console.error("Error in verifyOtp:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export { verifyOtp };
