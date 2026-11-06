import type { Request, Response } from "express";
import { z } from "zod";
import {
  createClient,
  listClients,
  getClientById,
  deleteClient,
} from "../services/oauth-client.service.js";
import { OIDC_CONFIG } from "../config/oidc.config.js";
import type { IOAuthClient } from "../models/oauth-client.model.js";

const isDev = process.env.NODE_ENV !== "production";

const isValidRedirectUri = (val: string): boolean => {
  try {
    const url = new URL(val);
    if (url.hash) return false;
    if (url.protocol === "https:") return true;
    if (isDev && url.protocol === "http:" && (url.hostname === "localhost" || url.hostname === "127.0.0.1")) {
      return true;
    }
    return false;
  } catch {
    return false;
  }
};

const registerClientSchema = z.object({
  name: z.string().trim().min(1, "Client name is required").max(100),
  redirectUris: z
    .array(
      z.string().url().refine(isValidRedirectUri, {
        message: "redirectUris must be https URLs without fragments (http://localhost is permitted in development)",
      })
    )
    .min(1, "At least one redirect URI is required")
    .max(20),
  allowedScopes: z
    .array(z.string())
    .refine(
      (scopes) => scopes.every((s) => (OIDC_CONFIG.supportedScopes as readonly string[]).includes(s)),
      { message: "One or more requested scopes are not supported" }
    )
    .optional(),
  logoUrl: z
    .string()
    .url()
    .refine((val) => val.startsWith("https://") || (isDev && val.startsWith("http://")), {
      message: "logoUrl must use https",
    })
    .optional(),
  description: z.string().trim().max(500).optional(),
});

const toClientDto = (client: IOAuthClient, clientSecret?: string) => ({
  client_id: client.clientId,
  ...(clientSecret && { client_secret: clientSecret }),
  name: client.name,
  redirect_uris: client.redirectUris,
  allowed_scopes: client.allowedScopes,
  is_trusted: client.isTrusted,
  logo_url: client.logoUrl,
  description: client.description,
  created_at: client.createdAt,
});

export const registerClient = async (req: Request, res: Response) => {
  try {
    const validation = registerClientSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        error: "invalid_request",
        error_description: validation.error.issues[0]?.message || "Invalid client registration payload",
      });
    }

    const { name, redirectUris, allowedScopes, logoUrl, description } = validation.data;

    const { client, clientSecret } = await createClient({
      name,
      redirectUris,
      isTrusted: false,
      ...(allowedScopes && { allowedScopes }),
      ...(logoUrl && { logoUrl }),
      ...(description && { description }),
      ...(req.userId && { owner: req.userId }),
    });

    res.status(201).json(toClientDto(client, clientSecret));
  } catch (error) {
    console.error("Error registering client:", error);
    res.status(500).json({
      error: "server_error",
      error_description: "Failed to register client",
    });
  }
};

export const getClients = async (req: Request, res: Response) => {
  try {
    const clients = await listClients(req.userId);

    res.json({
      clients: clients.map((client) => toClientDto(client)),
    });
  } catch (error) {
    console.error("Error fetching clients:", error);
    res.status(500).json({
      error: "server_error",
      error_description: "Failed to fetch clients",
    });
  }
};

export const getClient = async (req: Request, res: Response) => {
  try {
    const clientId = req.params.clientId as string;
    const client = await getClientById(clientId);

    if (!client) {
      return res.status(404).json({
        error: "not_found",
        error_description: "Client not found",
      });
    }

    // Ownerless clients (seeded system clients) are restricted from standard user access,
    // and owned clients can only be accessed by their owner.
    if (!client.owner || String(client.owner) !== req.userId) {
      return res.status(403).json({
        error: "forbidden",
        error_description: "You do not have access to this client",
      });
    }

    res.json(toClientDto(client));
  } catch (error) {
    console.error("Error fetching client:", error);
    res.status(500).json({
      error: "server_error",
      error_description: "Failed to fetch client",
    });
  }
};

export const removeClient = async (req: Request, res: Response) => {
  try {
    const clientId = req.params.clientId as string;
    const deleted = await deleteClient(clientId, req.userId);

    if (!deleted) {
      return res.status(404).json({
        error: "not_found",
        error_description: "Client not found or you are not authorized to delete it",
      });
    }

    res.status(204).send();
  } catch (error) {
    console.error("Error deleting client:", error);
    res.status(500).json({
      error: "server_error",
      error_description: "Failed to delete client",
    });
  }
};
