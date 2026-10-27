import crypto from "node:crypto";
import type { Response } from "express";
import jwt from "jsonwebtoken";
import {
  ACCESS_TOKEN_TTL_SECONDS,
  REFRESH_TOKEN_TTL_SECONDS,
} from "../config/auth.config.js";
import {
  ACCESS_COOKIE_OPTIONS,
  REFRESH_COOKIE_OPTIONS,
  COOKIE_CLEAR_OPTIONS,
} from "../config/cookie.config.js";
import redis from "../services/redis.service.js";

export interface RefreshPayload {
  userId: string;
  tokenId: string;
}

function refreshKey(userId: unknown): string {
  return `refreshToken:${String(userId)}`;
}

function createAccessToken(userId: unknown): string {
  return jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET as string, {
    expiresIn: ACCESS_TOKEN_TTL_SECONDS,
  });
}

async function createRefreshToken(userId: unknown): Promise<string> {
  const tokenId = crypto.randomUUID();
  const refreshToken = jwt.sign(
    { userId, tokenId },
    process.env.REFRESH_TOKEN_SECRET as string,
    { expiresIn: REFRESH_TOKEN_TTL_SECONDS },
  );

  await redis.set(refreshKey(userId), tokenId, {
    ex: REFRESH_TOKEN_TTL_SECONDS,
  });

  return refreshToken;
}

export function verifyRefreshToken(token: string): RefreshPayload | null {
  try {
    return jwt.verify(
      token,
      process.env.REFRESH_TOKEN_SECRET as string,
    ) as RefreshPayload;
  } catch {
    return null;
  }
}

export async function revokeRefreshToken(userId: unknown): Promise<void> {
  await redis.del(refreshKey(userId));
}

export async function isRefreshTokenActive(
  payload: RefreshPayload,
): Promise<boolean> {
  const storedTokenId = await redis.get<string>(refreshKey(payload.userId));
  return storedTokenId === payload.tokenId;
}

export async function setAuthCookies(
  res: Response,
  userId: unknown,
): Promise<void> {
  const accessToken = createAccessToken(userId);
  const refreshToken = await createRefreshToken(userId);

  res.cookie("accessToken", accessToken, ACCESS_COOKIE_OPTIONS);
  res.cookie("refreshToken", refreshToken, REFRESH_COOKIE_OPTIONS);
}

export function clearAuthCookies(res: Response): void {
  res.clearCookie("accessToken", COOKIE_CLEAR_OPTIONS);
  res.clearCookie("refreshToken", COOKIE_CLEAR_OPTIONS);
}
