import crypto from "node:crypto";
import { redis } from "../config/db.js";
import { OIDC_CONFIG } from "../config/oidc.config.js";

interface AuthCodeData {
  userId: string;
  clientId: string;
  redirectUri: string;
  scope: string[];
  createdAt: number;
}

const AUTH_CODE_PREFIX = "oauth_code:";

export const generateAuthCode = (): string => {
  return crypto.randomBytes(32).toString("hex");
};

export const storeAuthCode = async (
  code: string,
  data: Omit<AuthCodeData, "createdAt">
): Promise<void> => {
  const authData: AuthCodeData = {
    ...data,
    createdAt: Date.now(),
  };

  await redis.setex(
    `${AUTH_CODE_PREFIX}${code}`,
    OIDC_CONFIG.authCodeTTL,
    JSON.stringify(authData)
  );
};

export const consumeAuthCode = async (
  code: string
): Promise<AuthCodeData | null> => {
  const key = `${AUTH_CODE_PREFIX}${code}`;
  const data = await redis.get(key);

  if (!data) {
    return null;
  }

  await redis.del(key);

  try {
    return JSON.parse(data) as AuthCodeData;
  } catch (error) {
    console.error("Failed to parse auth code data");
    return null;
  }
};

export const createAuthorizationCode = async (
  userId: string,
  clientId: string,
  redirectUri: string,
  scope: string[]
): Promise<string> => {
  const code = generateAuthCode();
  await storeAuthCode(code, { userId, clientId, redirectUri, scope });
  return code;
};
