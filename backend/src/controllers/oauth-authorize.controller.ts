import type { Request, Response } from "express";
import { z } from "zod";
import { getClientById } from "../services/oauth-client.service.js";
import { createAuthorizationCode } from "../services/auth-code.service.js";
import { OIDC_CONFIG } from "../config/oidc.config.js";
import type { IOAuthClient } from "../models/oauth-client.model.js";

const FRONTEND_URL =
  (process.env.FRONTEND_URL ?? "").split(",")[0]?.trim() || "http://localhost:5173";

const authRequestSchema = z.object({
  client_id: z.string(),
  redirect_uri: z.string().url(),
  scope: z.string(),
  state: z.string().optional(),
  nonce: z.string().optional(),
  code_challenge: z.string().optional(),
  code_challenge_method: z.literal("S256").optional(),
});

const authorizeQuerySchema = authRequestSchema.extend({ response_type: z.literal("code") });
const consentBodySchema = authRequestSchema.extend({ approve: z.boolean() });

type AuthRequest = z.infer<typeof authRequestSchema>;

type CheckResult =
  | { ok: true; client: IOAuthClient; scopes: string[] }
  | { ok: false; error: string; description: string };

async function checkAuthRequest(p: AuthRequest): Promise<CheckResult> {
  const client = await getClientById(p.client_id);
  if (!client) {
    return { ok: false, error: "invalid_client", description: "Client not found" };
  }
  if (!client.redirectUris.includes(p.redirect_uri)) {
    return { ok: false, error: "invalid_request", description: "Invalid redirect_uri for this client" };
  }
  if (p.code_challenge && p.code_challenge_method !== "S256") {
    return { ok: false, error: "invalid_request", description: "code_challenge_method must be S256" };
  }

  const scopes = p.scope.split(" ").filter(Boolean);
  const supported: readonly string[] = OIDC_CONFIG.supportedScopes;
  const invalid = scopes.filter((s) => !supported.includes(s) || !client.allowedScopes.includes(s));
  if (invalid.length > 0) {
    return { ok: false, error: "invalid_scope", description: `Unsupported or disallowed scopes: ${invalid.join(", ")}` };
  }
  if (!scopes.includes("openid")) {
    return { ok: false, error: "invalid_scope", description: "openid scope is required" };
  }

  return { ok: true, client, scopes };
}

function withParams(base: string, params: Record<string, string | undefined>): string {
  const url = new URL(base);
  for (const [key, value] of Object.entries(params)) {
    if (value) url.searchParams.set(key, value);
  }
  return url.toString();
}

function issueCode(userId: string, p: AuthRequest, scopes: string[]) {
  return createAuthorizationCode({
    userId,
    clientId: p.client_id,
    redirectUri: p.redirect_uri,
    scope: scopes,
    nonce: p.nonce,
    codeChallenge: p.code_challenge,
  });
}

export const authorize = async (req: Request, res: Response) => {
  const parsed = authorizeQuerySchema.safeParse(req.query);
  if (!parsed.success) {
    return res.status(400).json({
      error: "invalid_request",
      error_description: parsed.error.issues[0]?.message ?? "Invalid request",
    });
  }
  const p = parsed.data;

  const check = await checkAuthRequest(p);
  if (!check.ok) {
    if (check.error === "invalid_scope") {
      return res.redirect(
        withParams(p.redirect_uri, { error: check.error, error_description: check.description, state: p.state }),
      );
    }
    return res.status(400).json({ error: check.error, error_description: check.description });
  }

  if (!req.userId) {
    return res.redirect(withParams(`${FRONTEND_URL}/login`, { return_to: req.originalUrl }));
  }

  if (check.client.isTrusted) {
    const code = await issueCode(req.userId, p, check.scopes);
    return res.redirect(withParams(p.redirect_uri, { code, state: p.state }));
  }

  return res.redirect(
    withParams(`${FRONTEND_URL}/consent`, {
      client_id: p.client_id,
      redirect_uri: p.redirect_uri,
      scope: p.scope,
      state: p.state,
      nonce: p.nonce,
      code_challenge: p.code_challenge,
      code_challenge_method: p.code_challenge_method,
    }),
  );
};

export const approveConsent = async (req: Request, res: Response) => {
  const parsed = consentBodySchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      error: "invalid_request",
      error_description: parsed.error.issues[0]?.message ?? "Invalid consent request",
    });
  }
  const p = parsed.data;

  const check = await checkAuthRequest(p);
  if (!check.ok) {
    return res.status(400).json({ error: check.error, error_description: check.description });
  }

  if (!p.approve) {
    return res.json({
      redirect_url: withParams(p.redirect_uri, {
        error: "access_denied",
        error_description: "User denied authorization",
        state: p.state,
      }),
    });
  }

  const code = await issueCode(req.userId as string, p, check.scopes);
  return res.json({ redirect_url: withParams(p.redirect_uri, { code, state: p.state }) });
};
