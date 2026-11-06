import type { Request, Response } from "express";
import { z } from "zod";
import { getClientById, validateRedirectUri } from "../services/oauth-client.service.js";
import { createAuthorizationCode } from "../services/auth-code.service.js";
import { OIDC_CONFIG } from "../config/oidc.config.js";

const authorizeSchema = z.object({
  client_id: z.string(),
  redirect_uri: z.string().url(),
  response_type: z.literal("code"),
  scope: z.string(),
  state: z.string().optional(),
  code_challenge: z.string().optional(),
  code_challenge_method: z.enum(["S256", "plain"]).optional(),
});

const consentBodySchema = z.object({
  client_id: z.string(),
  redirect_uri: z.string().url(),
  scope: z.string(),
  state: z.string().optional(),
  code_challenge: z.string().optional(),
  code_challenge_method: z.enum(["S256", "plain"]).optional(),
});

export const authorize = async (req: Request, res: Response) => {
  try {
    const validation = authorizeSchema.safeParse(req.query);

    if (!validation.success) {
      return res.status(400).json({
        error: "invalid_request",
        error_description: validation.error.issues[0]?.message || "Invalid request",
      });
    }

    const {
      client_id,
      redirect_uri,
      scope,
      state,
      code_challenge,
      code_challenge_method,
    } = validation.data;

    const client = await getClientById(client_id);
    if (!client) {
      return res.status(401).json({
        error: "invalid_client",
        error_description: "Client not found",
      });
    }

    const isValidRedirect = await validateRedirectUri(client_id, redirect_uri);
    if (!isValidRedirect) {
      return res.status(400).json({
        error: "invalid_request",
        error_description: "Invalid redirect_uri for this client",
      });
    }

    const requestedScopes = scope.split(" ").filter(Boolean);
    const supported = OIDC_CONFIG.supportedScopes as readonly string[];
    const invalidScopes = requestedScopes.filter(
      (s) => !supported.includes(s) || !client.allowedScopes.includes(s)
    );

    if (invalidScopes.length > 0) {
      return res.status(400).json({
        error: "invalid_scope",
        error_description: `Unsupported or disallowed scopes: ${invalidScopes.join(", ")}`,
      });
    }

    if (!requestedScopes.includes("openid")) {
      return res.status(400).json({
        error: "invalid_scope",
        error_description: "openid scope is required",
      });
    }

    const userId = req.userId;
    if (!userId) {
      const frontendUrl =
        (process.env.FRONTEND_URL ?? "http://localhost:5173").split(",")[0] ??
        "http://localhost:5173";
      const returnUrl = encodeURIComponent(req.originalUrl);
      return res.redirect(`${frontendUrl}/login?return_to=${returnUrl}`);
    }

    if (client.isTrusted) {
      const authCode = await createAuthorizationCode(
        userId,
        client_id,
        redirect_uri,
        requestedScopes,
        code_challenge,
        code_challenge_method
      );

      const redirectUrl = new URL(redirect_uri);
      redirectUrl.searchParams.set("code", authCode);
      if (state) redirectUrl.searchParams.set("state", state);

      return res.redirect(redirectUrl.toString());
    }

    const frontendUrl =
      (process.env.FRONTEND_URL ?? "http://localhost:5173").split(",")[0] ??
      "http://localhost:5173";

    const consentUrl = new URL(`${frontendUrl}/consent`);
    consentUrl.searchParams.set("client_id", client_id);
    consentUrl.searchParams.set("redirect_uri", redirect_uri);
    consentUrl.searchParams.set("scope", scope);
    if (state) consentUrl.searchParams.set("state", state);
    if (code_challenge) consentUrl.searchParams.set("code_challenge", code_challenge);
    if (code_challenge_method) {
      consentUrl.searchParams.set("code_challenge_method", code_challenge_method);
    }

    return res.redirect(consentUrl.toString());
  } catch (error) {
    console.error("Authorization error");
    res.status(500).json({
      error: "server_error",
      error_description: "Authorization failed",
    });
  }
};

export const approveConsent = async (req: Request, res: Response) => {
  try {
    const validation = consentBodySchema.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({
        error: "invalid_request",
        error_description: validation.error.issues[0]?.message || "Invalid consent payload",
      });
    }

    const {
      client_id,
      redirect_uri,
      scope,
      state,
      code_challenge,
      code_challenge_method,
    } = validation.data;

    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({
        error: "unauthorized",
        error_description: "User not authenticated",
      });
    }

    const client = await getClientById(client_id);
    if (!client) {
      return res.status(401).json({
        error: "invalid_client",
        error_description: "Client not found",
      });
    }

    const isValidRedirect = await validateRedirectUri(client_id, redirect_uri);
    if (!isValidRedirect) {
      return res.status(400).json({
        error: "invalid_request",
        error_description: "Invalid redirect_uri",
      });
    }

    const scopes = scope.split(" ").filter(Boolean);
    const supported = OIDC_CONFIG.supportedScopes as readonly string[];
    const invalidScopes = scopes.filter(
      (s) => !supported.includes(s) || !client.allowedScopes.includes(s)
    );

    if (invalidScopes.length > 0) {
      return res.status(400).json({
        error: "invalid_scope",
        error_description: `Unsupported or disallowed scopes: ${invalidScopes.join(", ")}`,
      });
    }

    if (!scopes.includes("openid")) {
      return res.status(400).json({
        error: "invalid_scope",
        error_description: "openid scope is required",
      });
    }

    const authCode = await createAuthorizationCode(
      userId,
      client_id,
      redirect_uri,
      scopes,
      code_challenge,
      code_challenge_method
    );

    const redirectUrl = new URL(redirect_uri);
    redirectUrl.searchParams.set("code", authCode);
    if (state) redirectUrl.searchParams.set("state", state);

    res.json({ redirect_url: redirectUrl.toString() });
  } catch (error) {
    console.error("Consent approval error");
    res.status(500).json({
      error: "server_error",
      error_description: "Consent approval failed",
    });
  }
};
