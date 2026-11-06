import crypto from "node:crypto";
import redis from "./redis.service.js";
import { OIDC_CONFIG } from "../config/oidc.config.js";

export interface AuthCodeData {
  userId: string;
  clientId: string;
  redirectUri: string;
  scope: string[];
  createdAt: number;
  codeChallenge?: string | undefined;
  codeChallengeMethod?: string | undefined;
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

  await redis.set(
    `${AUTH_CODE_PREFIX}${code}`,
    JSON.stringify(authData),
    { ex: OIDC_CONFIG.authCodeTTL }
  );
};

export const getAuthCode = async (
  code: string
): Promise<AuthCodeData | null> => {
  const key = `${AUTH_CODE_PREFIX}${code}`;
  const data = await redis.get<AuthCodeData | string>(key);

  if (!data) {
    return null;
  }

  try {
    return (typeof data === "string" ? JSON.parse(data) : data) as AuthCodeData;
  } catch {
    return null;
  }
};

/**
 * Minimal store contract needed to redeem an authorization code.
 * The default implementation is the shared Upstash Redis client.
 */
export interface AuthCodeStore {
  getdel<TData>(key: string): Promise<TData | null>;
}

/**
 * Redeems an authorization code exactly once.
 *
 * Uses Redis GETDEL so the read and delete happen as a single atomic
 * operation: when several token requests race with the same code, only
 * one of them receives the payload and all others get `null`.
 */
export const consumeAuthCode = async (
  code: string,
  store: AuthCodeStore = redis
): Promise<AuthCodeData | null> => {
  const key = `${AUTH_CODE_PREFIX}${code}`;
  const data = await store.getdel<AuthCodeData | string>(key);

  if (!data) {
    return null;
  }

  try {
    return (typeof data === "string" ? JSON.parse(data) : data) as AuthCodeData;
  } catch {
    return null;
  }
};

export const createAuthorizationCode = async (
  userId: string,
  clientId: string,
  redirectUri: string,
  scope: string[],
  codeChallenge?: string | undefined,
  codeChallengeMethod?: string | undefined
): Promise<string> => {
  const code = generateAuthCode();
  await storeAuthCode(code, {
    userId,
    clientId,
    redirectUri,
    scope,
    ...(codeChallenge && { codeChallenge }),
    ...(codeChallengeMethod && { codeChallengeMethod }),
  });
  return code;
};
