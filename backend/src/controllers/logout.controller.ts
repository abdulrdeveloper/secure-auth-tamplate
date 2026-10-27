import type { Request, Response } from "express";
import {
  clearAuthCookies,
  isRefreshTokenActive,
  revokeRefreshToken,
  verifyRefreshToken,
} from "../utils/token.util.js";

async function logoutUser(req: Request, res: Response) {
  const token = req.cookies?.refreshToken;
  const payload = token ? verifyRefreshToken(token) : null;

  if (payload && (await isRefreshTokenActive(payload))) {
    await revokeRefreshToken(payload.userId);
  }

  clearAuthCookies(res);

  return res.status(200).json({ message: "Logout successful" });
}

export { logoutUser };
