import type { Request, Response } from "express";
import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import 'dotenv/config';


async function registerUser (req: Request, res: Response) {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new userModel({ name, email, password: hashedPassword });
    await newUser.save();

    const token = jwt.sign(
      { userId: newUser._id },
      process.env.JWT_SECRET as string,
      { expiresIn: "1h" },
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      path: "/",
      maxAge: 60 * 60 * 1000,
    });

    const passwordlessUser = newUser.toObject();
    delete passwordlessUser.password;

    return res.status(201).json({
      message: "User registered successfully",
      user: passwordlessUser,
    });

  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ message: "Server error", error: (error as Error).message });
  }
};

async function loginUser (req: Request, res: Response) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await userModel.findOne({ email }).select("+password");
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password as string);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET as string,
      { expiresIn: "1h" },
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      path: "/",
      maxAge: 60 * 60 * 1000,
    });
    
    const passwordlessUser = user.toObject();
    delete passwordlessUser.password;

    return res.status(200).json({
      message: "Login successful",
      user: passwordlessUser,
    });

  } catch (error) {
    console.error("Error logging in user:", error);
    res.status(500).json({ message: "Server error", error: (error as Error).message });
  }
};

async function passwordReset (req: Request, res: Response) {
  try {
    const { email, newPassword } = req.body;
    if (!email || !newPassword) {
      return res.status(400).json({ message: "Email and new password are required" });
    }

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    return res.status(200).json({ message: "Password reset successful" });

  } catch (error) {
    console.error("Error resetting password:", error);
    res.status(500).json({ message: "Server error", error: (error as Error).message });
  }
};

async function logoutUser (req: Request, res: Response) {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      path: "/",
      maxAge: 0,
    });

    return res.status(200).json({ message: "Logout successful" });

  } catch (error) {
    console.error("Error logging out user:", error);
    res.status(500).json({ message: "Server error", error: (error as Error).message });
  }
};

export {registerUser, loginUser, logoutUser, passwordReset};
