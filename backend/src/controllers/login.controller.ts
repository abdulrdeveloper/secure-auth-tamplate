import type { Request, Response } from "express";
import bcrypt from "bcrypt";
import userModel from "../models/user.model.js";
import { setAuthCookies } from "../utils/token.util.js";
import { toPublicUser } from "../utils/user.util.js";

async function loginUser(req: Request, res: Response) {
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

  await setAuthCookies(res, user._id);

  return res.status(200).json({
    message: "Login successful",
    user: toPublicUser(user),
  });
}

export { loginUser };
