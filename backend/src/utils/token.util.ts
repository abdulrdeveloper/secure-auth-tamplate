import type { Response } from "express";
import jwt from "jsonwebtoken";
import { COOKIE_OPTIONS } from "../config/cookie.config.js";

export function setAuthCookie(res: Response, userId: unknown): string {
  const token = jwt.sign(
    { userId },
    process.env.JWT_SECRET as string,
    { expiresIn: "1h" },
  );

  res.cookie("token", token, COOKIE_OPTIONS);
  return token;
}

