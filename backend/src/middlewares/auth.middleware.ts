import type { Request, Response, NextFunction } from "express";
import { getSession } from "../services/session.service.js";
import { verifyAccessToken } from "../utils/token.util.js";

async function readSession(req: Request): Promise<{ userId: string; sessionId: string } | undefined> {
  const header = req.headers.authorization;
  const token =
    req.cookies?.accessToken ||
    (header?.startsWith("Bearer ") ? header.slice(7).trim() : undefined);
  const payload = token ? verifyAccessToken(token) : null;
  if (!payload) return undefined;

  const session = await getSession(payload.sid);
  if (!session || session.userId !== payload.userId) return undefined;
  return { userId: payload.userId, sessionId: payload.sid };
}

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  const session = await readSession(req);
  if (!session) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  req.userId = session.userId;
  req.sessionId = session.sessionId;
  next();
};

export const resolveSession = async (req: Request, _res: Response, next: NextFunction) => {
  const session = await readSession(req);
  if (session) {
    req.userId = session.userId;
    req.sessionId = session.sessionId;
  }
  next();
};
