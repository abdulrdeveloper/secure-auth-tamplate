import type { Request, Response } from "express";
import {
  clearAuthCookies,
  findActiveSession,
  refreshSession,
} from "../utils/token.util.js";

export async function refreshToken(req: Request, res: Response) {
  const session = await findActiveSession(req.cookies?.refreshToken);

  if (!session) {
    clearAuthCookies(res);
    return res
      .status(401)
      .json({ message: "Session expired. Please sign in again." });
  }

  await refreshSession(req, res, session);

  return res.status(200).json({ message: "Token refreshed successfully" });
}
