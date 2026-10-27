import type { Request, Response } from "express";

import { UNVERIFIED_ACCOUNT_TTL_MS } from "../config/auth.config.js";
import userModel from "../models/user.model.js";
import {
  checkCooldown,
  clearOtp,
  generateAndStoreOtp,
} from "../services/otp.service.js";
import { sendVerificationEmail } from "../services/mail.service.js";

const GENERIC_RESPONSE = {
  message: "If an account matches this email, a verification code will be sent.",
};

async function resendOtp(req: Request, res: Response) {
  try {
    const { email } = req.body;
    const user = await userModel.findOne({ email });

    if (!user || user.isEmailVerified || (await checkCooldown(email, "verify"))) {
      return res.status(200).json(GENERIC_RESPONSE);
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

    return res.status(200).json(GENERIC_RESPONSE);
  } catch (error) {
    console.error("Error in resendOtp:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export { resendOtp };
