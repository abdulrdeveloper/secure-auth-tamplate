import type { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

import userModel from "../models/user.model.js";
import { COOKIE_OPTIONS } from "../config/cookie.config.js";

async function loginUser(req: Request, res: Response) {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email }).select("+password");
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      user.password as string,
    );
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    if (!user.isEmailVerified) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

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
      message: "Login successful",
      user: passwordlessUser,
    });
  } catch (error) {
    console.error("Error in loginUser:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export { loginUser };
