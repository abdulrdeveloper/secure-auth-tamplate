import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface AccessPayload {
  userId: string;
}

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const token =
    req.cookies?.accessToken ||
    (req.headers.authorization?.startsWith("Bearer ")
      ? req.headers.authorization.slice(7).trim()
      : undefined);

  if (!token) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET as string,
    ) as AccessPayload;

    req.userId = decoded.userId;
    next();
  } catch {
    return res
      .status(401)
      .json({ message: "Unauthorized: Invalid or expired token" });
  }
};

export const resolveSession = (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  const token =
    req.cookies?.accessToken ||
    (req.headers.authorization?.startsWith("Bearer ")
      ? req.headers.authorization.slice(7).trim()
      : undefined);

  if (token) {
    try {
      const decoded = jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET as string,
      ) as AccessPayload;
      req.userId = decoded.userId;
    } catch {
      // Invalid/expired token: req.userId remains undefined
    }
  }

  next();
};
