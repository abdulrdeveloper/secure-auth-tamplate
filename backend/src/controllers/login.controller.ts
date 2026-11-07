import type { Request, Response } from "express";
import crypto from "node:crypto";
import bcrypt from "bcrypt";
import userModel from "../models/user.model.js";
import { setAuthCookies } from "../utils/token.util.js";
import { toPublicUser } from "../utils/user.util.js";
import { BCRYPT_ROUNDS } from "../config/auth.config.js";

const TIMING_HASH = bcrypt.hashSync(crypto.randomUUID(), BCRYPT_ROUNDS);

async function loginUser(req: Request, res: Response) {
  const { email, password } = req.body;

  const user = await userModel.findOne({ email }).select("+password");
  const isPasswordValid = await bcrypt.compare(password, user?.password ?? TIMING_HASH);

  if (!user || !isPasswordValid || !user.isEmailVerified) {
    return res.status(401).json({ message: "Invalid email or password." });
  }

  await setAuthCookies(res, user._id);

  return res.status(200).json({
    message: "Login successful",
    user: toPublicUser(user),
  });
}

export { loginUser };
