import type { Request, Response } from "express";
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
import {
  createSession,
  getSession,
  rotateSession,
  type ClientMeta,
  type Session,
} from "../services/session.service.js";

interface AccessPayload {
  userId: string;
  sid: string;
}

interface RefreshPayload extends AccessPayload {
  tokenId: string;
}

function clientMeta(req: Request): ClientMeta {
  return { userAgent: req.get("user-agent") ?? "", ip: req.ip ?? "" };
}

function setCookies(res: Response, session: Session): void {
  const accessToken = jwt.sign(
    { userId: session.userId, sid: session.id } satisfies AccessPayload,
    process.env.ACCESS_TOKEN_SECRET as string,
    { expiresIn: ACCESS_TOKEN_TTL_SECONDS },
  );
  const refreshToken = jwt.sign(
    { userId: session.userId, sid: session.id, tokenId: session.tokenId } satisfies RefreshPayload,
    process.env.REFRESH_TOKEN_SECRET as string,
    { expiresIn: REFRESH_TOKEN_TTL_SECONDS },
  );

  res.cookie("accessToken", accessToken, ACCESS_COOKIE_OPTIONS);
  res.cookie("refreshToken", refreshToken, REFRESH_COOKIE_OPTIONS);
}

function isPayload(value: unknown, keys: string[]): boolean {
  return (
    typeof value === "object" &&
    value !== null &&
    keys.every((key) => typeof (value as Record<string, unknown>)[key] === "string")
  );
}

export function verifyAccessToken(token: string): AccessPayload | null {
  try {
    const payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string);
    return isPayload(payload, ["userId", "sid"]) ? (payload as AccessPayload) : null;
  } catch {
    return null;
  }
}

function verifyRefreshToken(token: string): RefreshPayload | null {
  try {
    const payload = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET as string);
    return isPayload(payload, ["userId", "sid", "tokenId"]) ? (payload as RefreshPayload) : null;
  } catch {
    return null;
  }
}

export async function findActiveSession(refreshToken: string | undefined): Promise<Session | null> {
  const payload = refreshToken ? verifyRefreshToken(refreshToken) : null;
  if (!payload) return null;
  const session = await getSession(payload.sid);
  return session && session.userId === payload.userId && session.tokenId === payload.tokenId
    ? session
    : null;
}

export async function startSession(req: Request, res: Response, userId: unknown): Promise<void> {
  setCookies(res, await createSession(String(userId), clientMeta(req)));
}

export async function refreshSession(req: Request, res: Response, session: Session): Promise<void> {
  setCookies(res, await rotateSession(session, clientMeta(req)));
}

export function clearAuthCookies(res: Response): void {
  res.clearCookie("accessToken", COOKIE_CLEAR_OPTIONS);
  res.clearCookie("refreshToken", COOKIE_CLEAR_OPTIONS);
}
