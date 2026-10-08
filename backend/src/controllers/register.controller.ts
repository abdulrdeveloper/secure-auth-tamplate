import type { Request, Response } from "express";
import bcrypt from "bcrypt";

import { UNVERIFIED_ACCOUNT_TTL_MS } from "../config/auth.config.js";
import userModel from "../models/user.model.js";
import {
  checkCooldown,
  clearOtp,
  generateAndStoreOtp,
} from "../services/otp.service.js";
import { sendVerificationEmail } from "../services/mail.service.js";

async function registerUser(req: Request, res: Response) {
  try {
    const { name, email, password } = req.body;
    const existingUser = await userModel.findOne({ email });

    if (existingUser?.isEmailVerified) {
      return res
        .status(400)
        .json({ message: "Unable to create an account with these details." });
    }

    if (!existingUser) {
      const hashedPassword = await bcrypt.hash(password, 10);
      await new userModel({
        name,
        email,
        password: hashedPassword,
        isEmailVerified: false,
        verificationExpiresAt: new Date(Date.now() + UNVERIFIED_ACCOUNT_TTL_MS),
      }).save();
    }

    if (existingUser && !existingUser.verificationExpiresAt) {
      existingUser.verificationExpiresAt = new Date(
        existingUser.createdAt.getTime() + UNVERIFIED_ACCOUNT_TTL_MS,
      );
      await existingUser.save();
    }

    if (existingUser && (await checkCooldown(email, "verify"))) {
      return res.status(201).json({
        message:
          "Registration successful. Please check your email for the verification OTP.",
        email,
      });
    }

    if (existingUser) {
      existingUser.verificationExpiresAt = new Date(
        Date.now() + UNVERIFIED_ACCOUNT_TTL_MS,
      );
      await existingUser.save();
    }

    const otp = await generateAndStoreOtp(email, "verify");

    try {
      await sendVerificationEmail(email, otp);
    } catch (emailError) {
      console.error("Email send failed in registerUser:", emailError);
      await clearOtp(email, "verify");
      return res.status(500).json({
        message: "Failed to send verification email. Please try again.",
      });
    }

    return res.status(201).json({
      message:
        "Registration successful. Please check your email for the verification OTP.",
      email,
    });
  } catch (error) {
    console.error("Error in registerUser:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export { registerUser };
