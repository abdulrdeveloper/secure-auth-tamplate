import type { Request, Response } from "express";
import { deleteSession } from "../services/session.service.js";
import { clearAuthCookies, findActiveSession } from "../utils/token.util.js";

async function logoutUser(req: Request, res: Response) {
  const session = await findActiveSession(req.cookies?.refreshToken);

  if (session) {
    await deleteSession(session.userId, session.id);
  }

  clearAuthCookies(res);

  return res.status(200).json({ message: "Logout successful" });
}

export { logoutUser };
