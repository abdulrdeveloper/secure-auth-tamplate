import jwt from "jsonwebtoken";
import { getPrivateKey, getKeyId } from "./key.service.js";
import { OIDC_CONFIG } from "../config/oidc.config.js";
import type { IUser } from "../models/user.model.js";

interface TokenPayload {
  sub: string;
  aud: string;
  iss: string;
  iat: number;
  exp: number;
  email?: string;
  email_verified?: boolean;
  name?: string;
}

export const generateIdToken = (
  user: IUser,
  clientId: string,
  scope: string[]
): string => {
  const now = Math.floor(Date.now() / 1000);

  const payload: TokenPayload = {
    sub: user._id.toString(),
    aud: clientId,
    iss: OIDC_CONFIG.issuer,
    iat: now,
    exp: now + OIDC_CONFIG.idTokenTTL,
  };

  if (scope.includes("email")) {
    payload.email = user.email;
    payload.email_verified = user.isVerified;
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
  };

  return jwt.sign(payload, getPrivateKey(), {
    algorithm: "RS256",
    keyid: getKeyId(),
  });
};

export const verifyAccessToken = (token: string): any => {
  try {
    return jwt.verify(token, getPrivateKey(), {
      algorithms: ["RS256"],
    });
  } catch (error) {
    return null;
  }
};
