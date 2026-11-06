import type { Request, Response, NextFunction } from "express";
import {
  getClientById,
  validateRedirectUri,
  authenticateClient,
} from "../services/oauth-client.service.js";

export const validateClient = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { client_id } = req.query;

    if (!client_id || typeof client_id !== "string") {
      return res.status(400).json({
        error: "invalid_request",
        error_description: "client_id is required",
      });
    }

    const client = await getClientById(client_id);
    if (!client) {
      return res.status(401).json({
        error: "invalid_client",
        error_description: "Client not found",
      });
    }

    req.oauthClient = client;
    next();
  } catch (error) {
    console.error("Client validation error");
    res.status(500).json({
      error: "server_error",
      error_description: "Client validation failed",
    });
  }
};

export const validateRedirectUriMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { client_id, redirect_uri } = req.query;

    if (!redirect_uri || typeof redirect_uri !== "string") {
      return res.status(400).json({
        error: "invalid_request",
        error_description: "redirect_uri is required",
      });
    }

    if (!client_id || typeof client_id !== "string") {
      return res.status(400).json({
        error: "invalid_request",
        error_description: "client_id is required",
      });
    }

    const isValid = await validateRedirectUri(client_id, redirect_uri);
    if (!isValid) {
      return res.status(400).json({
        error: "invalid_request",
        error_description: "Invalid redirect_uri for this client",
      });
    }

    next();
  } catch (error) {
    console.error("Redirect URI validation error");
    res.status(500).json({
      error: "server_error",
      error_description: "Redirect URI validation failed",
    });
  }
};

export const authenticateClientMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { client_id, client_secret } = req.body;

    if (!client_id || !client_secret) {
      return res.status(400).json({
        error: "invalid_request",
        error_description: "client_id and client_secret are required",
      });
    }

    const client = await authenticateClient(client_id, client_secret);
    if (!client) {
      return res.status(401).json({
        error: "invalid_client",
        error_description: "Client authentication failed",
      });
    }

    req.oauthClient = client;
    next();
  } catch (error) {
    console.error("Client authentication error");
    res.status(500).json({
      error: "server_error",
      error_description: "Client authentication failed",
    });
  }
};
