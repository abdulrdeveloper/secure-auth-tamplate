import crypto from "node:crypto";
import redis from "./redis.service.js";
import { OIDC_CONFIG } from "../config/oidc.config.js";

export interface AuthCodeData {
  userId: string;
  clientId: string;
  redirectUri: string;
  scope: string[];
  nonce?: string | undefined;
  codeChallenge?: string | undefined;
}

const codeKey = (code: string) => `oauth_code:${code}`;

export async function createAuthorizationCode(data: AuthCodeData): Promise<string> {
  const code = crypto.randomBytes(32).toString("hex");
  await redis.set(codeKey(code), JSON.stringify(data), { ex: OIDC_CONFIG.authCodeTTL });
  return code;
}

export async function consumeAuthCode(code: string): Promise<AuthCodeData | null> {
  const data = await redis.getdel<AuthCodeData | string>(codeKey(code));
  if (!data) return null;

  try {
    return typeof data === "string" ? (JSON.parse(data) as AuthCodeData) : data;
  } catch {
    return null;
  }
}
