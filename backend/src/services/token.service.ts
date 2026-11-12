import jwt from "jsonwebtoken";
import { getKeyId, getPrivateKey, getPublicKey } from "./key.service.js";
import { OIDC_CONFIG } from "../config/oidc.config.js";
import type { User } from "../models/user.model.js";

function sign(claims: object, subject: string, audience: string, expiresIn: number) {
  return jwt.sign(claims, getPrivateKey(), {
    algorithm: "RS256",
    keyid: getKeyId(),
    issuer: OIDC_CONFIG.issuer,
    subject,
    audience,
    expiresIn,
  });
}

export function generateIdToken(
  user: User & { _id: unknown },
  clientId: string,
  scope: string[],
  nonce?: string,
) {
  const claims = {
    token_use: "id_token",
    ...(nonce && { nonce }),
    ...(scope.includes("profile") && { name: user.name }),
    ...(scope.includes("email") && { email: user.email, email_verified: user.isEmailVerified }),
  };
  return sign(claims, String(user._id), clientId, OIDC_CONFIG.idTokenTTL);
}

export function generateAccessToken(userId: string, clientId: string, scope: string[], grantId: string) {
  const claims = { token_use: "access_token", scope: scope.join(" "), gid: grantId };
  return sign(claims, userId, clientId, OIDC_CONFIG.accessTokenTTL);
}

export function verifyAccessToken(token: string): jwt.JwtPayload | null {
  try {
    const payload = jwt.verify(token, getPublicKey(), {
      algorithms: ["RS256"],
      issuer: OIDC_CONFIG.issuer,
    });
    return typeof payload === "object" && payload.token_use === "access_token" ? payload : null;
  } catch {
    return null;
  }
}
