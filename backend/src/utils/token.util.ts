import crypto from "node:crypto";
import type { Response } from "express";
import jwt from "jsonwebtoken";
import {
  ACCESS_COOKIE_OPTIONS,
  REFRESH_COOKIE_OPTIONS,
  COOKIE_CLEAR_OPTIONS,
} from "../config/cookie.config.js";
import redis from "../services/redis.service.js";

const REFRESH_TOKEN_EXPIRY = 7 * 24 * 60 * 60;

export function createAccessToken(userId: unknown): string {
  return jwt.sign({ userId }, process.env.JWT_SECRET as string, {
    expiresIn: "15m",
  });
}

export async function createRefreshToken(userId: unknown): Promise<string> {
  const tokenId = crypto.randomUUID();
  const secret =
    process.env.REFRESH_TOKEN_SECRET || (process.env.JWT_SECRET as string);
  const refreshToken = jwt.sign({ userId, tokenId }, secret, {
    expiresIn: "7d",
  });

  await redis.set(`refreshToken:${String(userId)}`, tokenId, {
    ex: REFRESH_TOKEN_EXPIRY,
  });

  return refreshToken;
}

export async function setAuthCookies(
  res: Response,
  userId: unknown,
): Promise<{ accessToken: string; refreshToken: string }> {
  const accessToken = createAccessToken(userId);
  const refreshToken = await createRefreshToken(userId);

  res.cookie("accessToken", accessToken, ACCESS_COOKIE_OPTIONS);
  res.cookie("refreshToken", refreshToken, REFRESH_COOKIE_OPTIONS);

  return { accessToken, refreshToken };
}

export async function clearAuthCookies(
  res: Response,
  userId?: string,
): Promise<void> {
  if (userId) {
    await redis.del(`refreshToken:${userId}`);
  }
  res.clearCookie("accessToken", COOKIE_CLEAR_OPTIONS);
  res.clearCookie("refreshToken", COOKIE_CLEAR_OPTIONS);
}

