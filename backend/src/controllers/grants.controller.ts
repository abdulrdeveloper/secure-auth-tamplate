import type { Request, Response } from "express";
import { OAuthClient } from "../models/oauth-client.model.js";
import { listGrants, revokeGrant } from "../services/grant.service.js";

export async function getGrants(req: Request, res: Response) {
  const grants = await listGrants(req.userId as string);
  const clients = await OAuthClient.find({ clientId: { $in: grants.map((g) => g.clientId) } })
    .select("clientId name description logoUrl")
    .lean();
  const byId = new Map(clients.map((client) => [client.clientId, client]));

  res.setHeader("Cache-Control", "no-store");
  return res.json({
    apps: grants.flatMap((grant) => {
      const client = byId.get(grant.clientId);
      if (!client) return [];
      return [
        {
          client_id: grant.clientId,
          name: client.name,
          description: client.description ?? null,
          logo_url: client.logoUrl ?? null,
          scopes: grant.scopes,
          connected_at: grant.createdAt,
          last_used_at: grant.lastUsedAt,
        },
      ];
    }),
  });
}

export async function removeGrant(req: Request, res: Response) {
  const removed = await revokeGrant(req.userId as string, String(req.params.clientId ?? ""));
  return removed
    ? res.status(204).end()
    : res.status(404).json({ message: "App not found. It may already be disconnected." });
}
