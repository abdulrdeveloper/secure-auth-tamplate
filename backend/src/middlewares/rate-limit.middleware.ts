import type { NextFunction, Request, Response } from "express";
import redis from "../services/redis.service.js";

export function rateLimit(name: string, limit: number, windowSeconds: number) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const key = `ratelimit:${name}:${req.ip}`;

    try {
      const count = await redis.incr(key);
      if (count === 1) {
        await redis.expire(key, windowSeconds);
      }

      if (count > limit) {
        return res
          .status(429)
          .json({ message: "Too many requests. Please try again later." });
      }
    } catch (error) {
      console.error("Rate limit check failed:", error);
    }

    next();
  };
}
