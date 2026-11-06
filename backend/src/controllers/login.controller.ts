import type { Request, Response } from "express";
import bcrypt from "bcrypt";
import userModel from "../models/user.model.js";
import { setAuthCookies } from "../utils/token.util.js";
import { toPublicUser } from "../utils/user.util.js";

// Dummy hash for constant-time comparison when email is not found
const DUMMY_HASH = "$2b$10$abcdefghijklmnopqrstuuABCDEFGHIJKLMNOPQRSTUVWXYZ012345";

async function loginUser(req: Request, res: Response) {
  const { email, password } = req.body;

  const user = await userModel.findOne({ email }).select("+password");
  const hashToCompare = user?.password ?? DUMMY_HASH;

  const isPasswordValid = await bcrypt.compare(password, hashToCompare);

  if (!user || !isPasswordValid) {
    return res.status(401).json({ message: "Invalid email or password." });
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
