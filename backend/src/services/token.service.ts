import jwt from "jsonwebtoken";
import { getPrivateKey, getPublicKey, getKeyId } from "./key.service.js";
import { OIDC_CONFIG } from "../config/oidc.config.js";
import type { User } from "../models/user.model.js";

interface IdTokenPayload {
  sub: string;
  aud: string;
  iss: string;
  iat: number;
  exp: number;
  token_use: "id_token";
  nonce?: string;
  email?: string;
  email_verified?: boolean;
  name?: string;
}

export const generateIdToken = (
  user: User & { _id: unknown },
  clientId: string,
  scope: string[],
  nonce?: string
): string => {
  const now = Math.floor(Date.now() / 1000);

  const payload: IdTokenPayload = {
    sub: String(user._id),
    aud: clientId,
    iss: OIDC_CONFIG.issuer,
    iat: now,
    exp: now + OIDC_CONFIG.idTokenTTL,
    token_use: "id_token",
    ...(nonce && { nonce }),
  };

  if (scope.includes("email")) {
    payload.email = user.email;
    payload.email_verified = user.isEmailVerified;
  }

  if (scope.includes("profile")) {
    payload.name = user.name;
  }

  return jwt.sign(payload, getPrivateKey(), {
    algorithm: "RS256",
    keyid: getKeyId(),
  });
};

export const generateAccessToken = (
  userId: string,
  clientId: string,
  scope: string[]
): string => {
  const now = Math.floor(Date.now() / 1000);

  const payload = {
    sub: userId,
    aud: clientId,
    iss: OIDC_CONFIG.issuer,
    iat: now,
    exp: now + OIDC_CONFIG.accessTokenTTL,
    scope: scope.join(" "),
    token_use: "access_token",
  };

  return jwt.sign(payload, getPrivateKey(), {
    algorithm: "RS256",
    keyid: getKeyId(),
  });
};

export const verifyAccessToken = (token: string): jwt.JwtPayload | null => {
  try {
    const payload = jwt.verify(token, getPublicKey(), {
      algorithms: ["RS256"],
    }) as jwt.JwtPayload;

    if (payload.token_use !== "access_token") {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
};
