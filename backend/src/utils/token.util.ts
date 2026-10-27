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

export interface RefreshPayload {
  userId: string;
  tokenId: string;
}

function refreshKey(userId: unknown): string {
  return `refreshToken:${String(userId)}`;
}

function createAccessToken(userId: unknown): string {
  return jwt.sign({ userId }, process.env.JWT_SECRET as string, {
    expiresIn: "15m",
  });
}

async function createRefreshToken(userId: unknown): Promise<string> {
  const tokenId = crypto.randomUUID();
  const refreshToken = jwt.sign(
    { userId, tokenId },
    process.env.REFRESH_TOKEN_SECRET as string,
    { expiresIn: "7d" },
  );

  await redis.set(refreshKey(userId), tokenId, { ex: REFRESH_TOKEN_EXPIRY });

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
