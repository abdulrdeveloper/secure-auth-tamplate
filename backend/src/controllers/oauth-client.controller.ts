import type { Request, Response } from "express";
import { z } from "zod";
import {
  createClient,
  deleteClient,
  getClientById,
  getOwnedClient,
  listClients,
} from "../services/oauth-client.service.js";
import { OIDC_CONFIG } from "../config/oidc.config.js";
import type { IOAuthClient } from "../models/oauth-client.model.js";

const isProduction = process.env.NODE_ENV === "production";
const supportedScopes: readonly string[] = OIDC_CONFIG.supportedScopes;

function isAllowedUrl(value: string, allowFragment = false) {
  try {
    const url = new URL(value);
    if (url.hash && !allowFragment) return false;
    if (url.protocol === "https:") return true;
    return (
      !isProduction &&
      url.protocol === "http:" &&
      ["localhost", "127.0.0.1"].includes(url.hostname)
    );
  } catch {
    return false;
  }
}

const registerClientSchema = z.object({
  name: z.string().trim().min(1, "name is required").max(100),
  redirectUris: z
    .array(
      z.string().refine((uri) => isAllowedUrl(uri), {
        message: "Redirect URLs must start with https:// (http://localhost works while developing) and can't contain #.",
      }),
    )
    .min(1, "At least one redirect URI is required")
    .max(20),
  allowedScopes: z
    .array(z.string().refine((s) => supportedScopes.includes(s), { message: "Unsupported scope" }))
    .refine((scopes) => scopes.includes("openid"), { message: "allowedScopes must include openid" })
    .optional(),
  logoUrl: z
    .string()
    .refine((url) => isAllowedUrl(url, true), { message: "logoUrl must be an https URL" })
    .optional(),
  description: z.string().trim().max(500).optional(),
});

const toClientDto = (client: IOAuthClient) => ({
  client_id: client.clientId,
  name: client.name,
  redirect_uris: client.redirectUris,
  allowed_scopes: client.allowedScopes,
  is_trusted: client.isTrusted,
  logo_url: client.logoUrl,
  description: client.description,
  created_at: client.createdAt,
});

const clientNotFound = (res: Response) =>
  res.status(404).json({ error: "not_found", error_description: "Client not found" });

export const registerClient = async (req: Request, res: Response) => {
  const parsed = registerClientSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      error: "invalid_request",
      error_description: parsed.error.issues[0]?.message ?? "Invalid client registration",
    });
  }

  const { client, clientSecret } = await createClient({
    ...parsed.data,
    isTrusted: false,
    owner: req.userId,
  });

  return res.status(201).json({ ...toClientDto(client), client_secret: clientSecret });
};

export const getClientInfo = async (req: Request, res: Response) => {
  const clientId = typeof req.query.client_id === "string" ? req.query.client_id : "";
  const client = clientId ? await getClientById(clientId) : null;
  if (!client) return clientNotFound(res);
  return res.json({ name: client.name, description: client.description ?? null });
};

export const getClients = async (req: Request, res: Response) => {
  const clients = await listClients(req.userId as string);
  return res.json({ clients: clients.map((client) => toClientDto(client)) });
};

export const getClient = async (req: Request, res: Response) => {
  const client = await getOwnedClient(String(req.params.clientId), req.userId as string);
  return client ? res.json(toClientDto(client)) : clientNotFound(res);
};

export const removeClient = async (req: Request, res: Response) => {
  const deleted = await deleteClient(String(req.params.clientId), req.userId as string);
  return deleted ? res.status(204).send() : clientNotFound(res);
};
