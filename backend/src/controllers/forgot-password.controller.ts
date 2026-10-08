import type { Request, Response } from "express";

import userModel from "../models/user.model.js";
import {
  checkCooldown,
  clearOtp,
  generateAndStoreOtp,
} from "../services/otp.service.js";
import { sendPasswordResetEmail } from "../services/mail.service.js";

async function forgotPassword(req: Request, res: Response) {
  try {
    const { email } = req.body;

    const user = await userModel.findOne({ email });
    const genericResponse = {
      message:
        "If an account matches this email, reset instructions will be sent.",
    };

    if (!user || !user.isEmailVerified) {
      return res.status(200).json(genericResponse);
    }

    if (await checkCooldown(email, "reset")) {
      return res.status(200).json(genericResponse);
    }

    const otp = await generateAndStoreOtp(email, "reset");

    try {
      await sendPasswordResetEmail(email, otp);
    } catch (emailError) {
      console.error("Email send failed in forgotPassword:", emailError);
      await clearOtp(email, "reset");
      throw emailError;
    }

    return res.status(200).json(genericResponse);
  } catch (error) {
    console.error("Error in forgotPassword:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export { forgotPassword };
