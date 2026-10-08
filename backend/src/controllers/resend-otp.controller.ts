import type { Request, Response } from "express";

import { UNVERIFIED_ACCOUNT_TTL_MS } from "../config/auth.config.js";
import userModel from "../models/user.model.js";
import {
  checkCooldown,
  clearOtp,
  generateAndStoreOtp,
} from "../services/otp.service.js";
import { sendVerificationEmail } from "../services/mail.service.js";

async function resendOtp(req: Request, res: Response) {
  try {
    const { email } = req.body;
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(200).json({
        message:
          "If an account matches this email, a verification code will be sent.",
      });
    }

    if (user.isEmailVerified) {
      return res.status(200).json({
        message:
          "If an account matches this email, a verification code will be sent.",
      });
    }

    if (!user.verificationExpiresAt) {
      user.verificationExpiresAt = new Date(
        user.createdAt.getTime() + UNVERIFIED_ACCOUNT_TTL_MS,
      );
      await user.save();
    }

    if (await checkCooldown(email, "verify")) {
      return res.status(200).json({
        message:
          "If an account matches this email, a verification code will be sent.",
      });
    }

    user.verificationExpiresAt = new Date(
      Date.now() + UNVERIFIED_ACCOUNT_TTL_MS,
    );
    await user.save();

    const otp = await generateAndStoreOtp(email, "verify");

    try {
      await sendVerificationEmail(email, otp);
    } catch (emailError) {
      console.error("Email send failed in resendOtp:", emailError);
      await clearOtp(email, "verify");
      throw emailError;
    }

    return res
      .status(200)
      .json({ message: "Verification OTP resent successfully" });
  } catch (error) {
    console.error("Error in resendOtp:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export { resendOtp };
