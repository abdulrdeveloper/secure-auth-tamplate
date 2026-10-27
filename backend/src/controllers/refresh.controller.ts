import type { Request, Response } from "express";
import {
  clearAuthCookies,
  isRefreshTokenActive,
  setAuthCookies,
  verifyRefreshToken,
} from "../utils/token.util.js";

export async function refreshToken(req: Request, res: Response) {
  const token = req.cookies?.refreshToken;
  const payload = token ? verifyRefreshToken(token) : null;

  if (!payload || !(await isRefreshTokenActive(payload))) {
    clearAuthCookies(res);
    return res
      .status(401)
      .json({ message: "Session expired. Please sign in again." });
  }

  await setAuthCookies(res, payload.userId);

  return res.status(200).json({ message: "Token refreshed successfully" });
}
