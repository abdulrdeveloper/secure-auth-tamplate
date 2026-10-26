import type { Request, Response } from "express";
import jwt from "jsonwebtoken";
import redis from "../services/redis.service.js";
import { setAuthCookies } from "../utils/token.util.js";

interface RefreshPayload {
  userId: string;
  tokenId: string;
}

export async function refreshToken(req: Request, res: Response) {
  const token = req.cookies?.refreshToken;

  if (!token) {
    return res.status(401).json({ message: "No refresh token provided" });
  }

  try {
    const secret =
      process.env.REFRESH_TOKEN_SECRET || (process.env.JWT_SECRET as string);
    const decoded = jwt.verify(token, secret) as RefreshPayload;

    const storedTokenId = await redis.get<string>(
      `refreshToken:${decoded.userId}`,
    );
    if (!storedTokenId || storedTokenId !== decoded.tokenId) {
      return res
        .status(401)
        .json({ message: "Invalid or revoked refresh token" });
    }

    await setAuthCookies(res, decoded.userId);

    return res.status(200).json({ message: "Token refreshed successfully" });
  } catch {
    return res
      .status(401)
      .json({ message: "Invalid or expired refresh token" });
  }
}

