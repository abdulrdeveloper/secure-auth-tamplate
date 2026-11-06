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
});

export const authorize = async (req: Request, res: Response) => {
  try {
    const validation = authorizeSchema.safeParse(req.query);

    if (!validation.success) {
      return res.status(400).json({
        error: "invalid_request",
        error_description: validation.error.errors[0].message,
      });
    }

    const { client_id, redirect_uri, scope, state } = validation.data;

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

    const requestedScopes = scope.split(" ");
    const invalidScopes = requestedScopes.filter(
      (s) => !OIDC_CONFIG.supportedScopes.includes(s)
    );

    if (invalidScopes.length > 0) {
      return res.status(400).json({
        error: "invalid_scope",
        error_description: `Unsupported scopes: ${invalidScopes.join(", ")}`,
      });
    }

    if (!requestedScopes.includes("openid")) {
      return res.status(400).json({
        error: "invalid_scope",
        error_description: "openid scope is required",
      });
    }

    if (!req.user) {
      const returnUrl = encodeURIComponent(req.originalUrl);
      return res.redirect(`/login?return_to=${returnUrl}`);
    }

    if (client.isTrusted) {
      const authCode = await createAuthorizationCode(
        req.user._id.toString(),
        client_id,
        redirect_uri,
        requestedScopes
      );

      const redirectUrl = new URL(redirect_uri);
      redirectUrl.searchParams.set("code", authCode);
      if (state) redirectUrl.searchParams.set("state", state);

      return res.redirect(redirectUrl.toString());
    }

    return res.render("consent", {
      client,
      scopes: requestedScopes,
      state,
      redirect_uri,
    });
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
    const { client_id, redirect_uri, scope, state } = req.body;

    if (!req.user) {
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

    const scopes = scope.split(" ");
    const authCode = await createAuthorizationCode(
      req.user._id.toString(),
      client_id,
      redirect_uri,
      scopes
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
