import crypto from "node:crypto";
import type { Request, Response } from "express";
import { z } from "zod";
import userModel from "../models/user.model.js";
import { authenticateClient } from "../services/oauth-client.service.js";
import { consumeAuthCode } from "../services/auth-code.service.js";
import { generateAccessToken, generateIdToken, verifyAccessToken } from "../services/token.service.js";
import { OIDC_CONFIG } from "../config/oidc.config.js";
import { isGrantActive, touchGrant } from "../services/grant.service.js";

const tokenSchema = z.object({
  grant_type: z.literal("authorization_code"),
  code: z.string(),
  redirect_uri: z.string().url(),
  code_verifier: z.string().optional(),
});

const oauthError = (res: Response, status: number, error: string, description: string) =>
  res.status(status).json({ error, error_description: description });

function getClientCredentials(req: Request): { id: string; secret: string } | null {
  const header = req.headers.authorization;
  if (header?.startsWith("Basic ")) {
    const decoded = Buffer.from(header.slice(6), "base64").toString("utf8");
    const colon = decoded.indexOf(":");
    if (colon === -1) return null;
    try {
      return {
        id: decodeURIComponent(decoded.slice(0, colon)),
        secret: decodeURIComponent(decoded.slice(colon + 1)),
      };
    } catch {
      return null;
    }
  }

  const { client_id, client_secret } = req.body ?? {};
  if (typeof client_id === "string" && typeof client_secret === "string") {
    return { id: client_id, secret: client_secret };
  }
  return null;
}

export const exchangeToken = async (req: Request, res: Response) => {
  const parsed = tokenSchema.safeParse(req.body);
  if (!parsed.success) {
    return oauthError(res, 400, "invalid_request", parsed.error.issues[0]?.message ?? "Invalid request");
  }
  const { code, redirect_uri, code_verifier } = parsed.data;

  const credentials = getClientCredentials(req);
  const client = credentials ? await authenticateClient(credentials.id, credentials.secret) : null;
  if (!client) {
    res.setHeader("WWW-Authenticate", 'Basic realm="OAuth"');
    return oauthError(res, 401, "invalid_client", "Client authentication failed");
  }

  const data = await consumeAuthCode(code);
  if (!data || data.clientId !== client.clientId || data.redirectUri !== redirect_uri) {
    return oauthError(res, 400, "invalid_grant", "Invalid, expired, or already used authorization code");
  }

  if (data.codeChallenge) {
    const challenge = code_verifier
      ? crypto.createHash("sha256").update(code_verifier).digest("base64url")
      : undefined;
    if (challenge !== data.codeChallenge) {
      return oauthError(res, 400, "invalid_grant", "Invalid code_verifier");
    }
  }

  if (!(await isGrantActive(data.grantId, data.userId, client.clientId))) {
    return oauthError(res, 400, "invalid_grant", "The user removed this app's access");
  }

  const user = await userModel.findById(data.userId);
  if (!user) {
    return oauthError(res, 400, "invalid_grant", "User not found");
  }
  await touchGrant(data.grantId);

  res.setHeader("Cache-Control", "no-store");
  res.setHeader("Pragma", "no-cache");
  return res.status(200).json({
    access_token: generateAccessToken(String(user._id), client.clientId, data.scope, data.grantId),
    token_type: "Bearer",
    expires_in: OIDC_CONFIG.accessTokenTTL,
    id_token: generateIdToken(user, client.clientId, data.scope, data.nonce),
    scope: data.scope.join(" "),
  });
};

export const getUserInfo = async (req: Request, res: Response) => {
  const header = req.headers.authorization;
  const payload = header?.startsWith("Bearer ") ? verifyAccessToken(header.slice(7).trim()) : null;
  const active = payload ? await isGrantActive(payload.gid, payload.sub, payload.aud) : false;
  const user = active && payload?.sub ? await userModel.findById(payload.sub) : null;

  if (!payload || !user) {
    res.setHeader("WWW-Authenticate", 'Bearer error="invalid_token"');
    return oauthError(res, 401, "invalid_token", "Invalid or expired access token");
  }

  const scopes = String(payload.scope ?? "").split(" ");

  res.setHeader("Cache-Control", "no-store");
  res.setHeader("Pragma", "no-cache");
  return res.status(200).json({
    sub: String(user._id),
    ...(scopes.includes("profile") && { name: user.name }),
    ...(scopes.includes("email") && { email: user.email, email_verified: user.isEmailVerified }),
  });
};
