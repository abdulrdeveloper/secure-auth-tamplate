import type { Request, Response } from "express";
import {
  createClient,
  listClients,
  getClientById,
  deleteClient,
} from "../services/oauth-client.service.js";

export const registerClient = async (req: Request, res: Response) => {
  try {
    const { name, redirectUris, allowedScopes, isTrusted, logoUrl, description } =
      req.body;

    if (!name || !redirectUris || redirectUris.length === 0) {
      return res.status(400).json({
        error: "invalid_request",
        error_description: "name and redirectUris are required",
      });
    }

    const { client, clientSecret } = await createClient({
      name,
      redirectUris,
      allowedScopes,
      isTrusted,
      logoUrl,
      description,
    });

    res.status(201).json({
      client_id: client.clientId,
      client_secret: clientSecret,
      name: client.name,
      redirect_uris: client.redirectUris,
      allowed_scopes: client.allowedScopes,
      is_trusted: client.isTrusted,
      created_at: client.createdAt,
    });
  } catch (error) {
    console.error("Error registering client");
    res.status(500).json({
      error: "server_error",
      error_description: "Failed to register client",
    });
  }
};

export const getClients = async (req: Request, res: Response) => {
  try {
    const clients = await listClients();

    res.json({
      clients: clients.map((client) => ({
        client_id: client.clientId,
        name: client.name,
        redirect_uris: client.redirectUris,
        allowed_scopes: client.allowedScopes,
        is_trusted: client.isTrusted,
        logo_url: client.logoUrl,
        description: client.description,
        created_at: client.createdAt,
      })),
    });
  } catch (error) {
    console.error("Error fetching clients");
    res.status(500).json({
      error: "server_error",
      error_description: "Failed to fetch clients",
    });
  }
};

export const getClient = async (req: Request, res: Response) => {
  try {
    const { clientId } = req.params;
    const client = await getClientById(clientId);

    if (!client) {
      return res.status(404).json({
        error: "not_found",
        error_description: "Client not found",
      });
    }

    res.json({
      client_id: client.clientId,
      name: client.name,
      redirect_uris: client.redirectUris,
      allowed_scopes: client.allowedScopes,
      is_trusted: client.isTrusted,
      logo_url: client.logoUrl,
      description: client.description,
      created_at: client.createdAt,
    });
  } catch (error) {
    console.error("Error fetching client");
    res.status(500).json({
      error: "server_error",
      error_description: "Failed to fetch client",
    });
  }
};

export const removeClient = async (req: Request, res: Response) => {
  try {
    const { clientId } = req.params;
    const deleted = await deleteClient(clientId);

    if (!deleted) {
      return res.status(404).json({
        error: "not_found",
        error_description: "Client not found",
      });
    }

    res.status(204).send();
  } catch (error) {
    console.error("Error deleting client");
    res.status(500).json({
      error: "server_error",
      error_description: "Failed to delete client",
    });
  }
};
