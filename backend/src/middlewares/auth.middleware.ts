import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

function readUserId(req: Request): string | undefined {
  const header = req.headers.authorization;
  const token =
    req.cookies?.accessToken ||
    (header?.startsWith("Bearer ") ? header.slice(7).trim() : undefined);
  if (!token) return undefined;

  try {
    const payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string) as { userId: string };
    return payload.userId;
  } catch {
    return undefined;
  }
}

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const userId = readUserId(req);
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  req.userId = userId;
  next();
};

export const resolveSession = (req: Request, _res: Response, next: NextFunction) => {
  const userId = readUserId(req);
  if (userId) req.userId = userId;
  next();
};
