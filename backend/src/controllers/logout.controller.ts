import type { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { clearAuthCookies } from "../utils/token.util.js";

async function logoutUser(req: Request, res: Response) {
  try {
    const refreshToken = req.cookies?.refreshToken;
    let userId: string | undefined;

    if (refreshToken) {
      try {
        const secret =
          process.env.REFRESH_TOKEN_SECRET || (process.env.JWT_SECRET as string);
        const decoded = jwt.decode(refreshToken) as { userId?: string } | null;
        userId = decoded?.userId;
      } catch {
        userId = undefined;
      }
    }

    await clearAuthCookies(res, userId);

    return res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.error("Error in logoutUser:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export { logoutUser };
