import crypto from "node:crypto";
import type { Request, Response } from "express";
import { z } from "zod";
import userModel from "../models/user.model.js";
import { authenticateClient } from "../services/oauth-client.service.js";
import { consumeAuthCode } from "../services/auth-code.service.js";
import { generateAccessToken, generateIdToken, verifyAccessToken } from "../services/token.service.js";
import { OIDC_CONFIG } from "../config/oidc.config.js";

const tokenSchema = z.object({
  grant_type: z.literal("authorization_code"),
  code: z.string(),
  redirect_uri: z.string().url(),
  client_id: z.string().optional(),
  client_secret: z.string().optional(),
  code_verifier: z.string().optional(),
});

export const exchangeToken = async (req: Request, res: Response) => {
  try {
    let clientId = req.body?.client_id;
    let clientSecret = req.body?.client_secret;

    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Basic ")) {
      const credentials = Buffer.from(authHeader.slice(6).trim(), "base64").toString("utf8");
      const colonIndex = credentials.indexOf(":");
      if (colonIndex !== -1) {
        const basicId = decodeURIComponent(credentials.slice(0, colonIndex));
        const basicSecret = decodeURIComponent(credentials.slice(colonIndex + 1));
        if (basicId) clientId = basicId;
        if (basicSecret) clientSecret = basicSecret;
      }
    }

    const validation = tokenSchema.safeParse({
      ...req.body,
      client_id: clientId,
      client_secret: clientSecret,
    });

    if (!validation.success) {
      return res.status(400).json({
        error: "invalid_request",
        error_description: validation.error.issues[0]?.message || "Invalid request parameters",
      });
    }

    const { code, redirect_uri, code_verifier } = validation.data;

    if (!clientId || !clientSecret) {
      return res.status(401).json({
        error: "invalid_client",
        error_description: "Client credentials are required",
      });
    }

    const client = await authenticateClient(clientId, clientSecret);
    if (!client) {
      return res.status(401).json({
        error: "invalid_client",
        error_description: "Client authentication failed",
      });
    }

    const authCodeData = await consumeAuthCode(code);
    if (!authCodeData) {
      return res.status(400).json({
        error: "invalid_grant",
        error_description: "Invalid or expired authorization code",
      });
    }

    if (authCodeData.clientId !== client.clientId) {
      return res.status(400).json({
        error: "invalid_grant",
        error_description: "Authorization code was not issued to this client",
      });
    }

    if (authCodeData.redirectUri !== redirect_uri) {
      return res.status(400).json({
        error: "invalid_grant",
        error_description: "Redirect URI mismatch",
      });
    }

    if (authCodeData.codeChallenge) {
      if (!code_verifier) {
        return res.status(400).json({
          error: "invalid_grant",
          error_description: "code_verifier is required for PKCE",
        });
      }

      let computedChallenge = code_verifier;
      if (authCodeData.codeChallengeMethod === "S256") {
        computedChallenge = crypto
          .createHash("sha256")
          .update(code_verifier)
          .digest("base64url");
      }

      if (computedChallenge !== authCodeData.codeChallenge) {
        return res.status(400).json({
          error: "invalid_grant",
          error_description: "Invalid code_verifier",
        });
      }
    }

    const user = await userModel.findById(authCodeData.userId);
    if (!user) {
      return res.status(400).json({
        error: "invalid_grant",
        error_description: "User not found",
      });
    }

    const idToken = generateIdToken(user, client.clientId, authCodeData.scope);
    const accessToken = generateAccessToken(
      String(user._id),
      client.clientId,
      authCodeData.scope
    );

    res.setHeader("Cache-Control", "no-store");
    res.setHeader("Pragma", "no-cache");

    return res.status(200).json({
      access_token: accessToken,
      token_type: "Bearer",
      expires_in: OIDC_CONFIG.accessTokenTTL,
      id_token: idToken,
      scope: authCodeData.scope.join(" "),
    });
  } catch (error) {
    console.error("Token exchange error");
    return res.status(500).json({
      error: "server_error",
      error_description: "Failed to exchange token",
    });
  }
};

export const getUserInfo = async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        error: "invalid_token",
        error_description: "Bearer token required",
      });
    }

    const token = authHeader.slice(7).trim();
    const payload = verifyAccessToken(token);

    if (!payload || !payload.sub) {
      return res.status(401).json({
        error: "invalid_token",
        error_description: "Invalid or expired access token",
      });
    }

    const user = await userModel.findById(payload.sub);
    if (!user) {
      return res.status(404).json({
        error: "invalid_token",
        error_description: "User not found",
      });
    }

    const scopeString = (payload as { scope?: string }).scope ?? "";
    const scopes = scopeString.split(" ");

    const response: Record<string, unknown> = {
      sub: String(user._id),
    };

    if (scopes.includes("profile")) {
      response.name = user.name;
    }

    if (scopes.includes("email")) {
      response.email = user.email;
      response.email_verified = user.isEmailVerified;
    }

    res.setHeader("Cache-Control", "no-store");
    res.setHeader("Pragma", "no-cache");

    return res.status(200).json(response);
  } catch (error) {
    console.error("UserInfo error");
    return res.status(500).json({
      error: "server_error",
      error_description: "Failed to fetch user info",
    });
  }
};
