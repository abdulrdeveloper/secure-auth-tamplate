import crypto from "node:crypto";
import bcrypt from "bcrypt";
import { OAuthClient } from "../models/oauth-client.model.js";
import { BCRYPT_ROUNDS } from "../config/auth.config.js";

type NewClient = {
  name: string;
  redirectUris: string[];
  allowedScopes?: string[] | undefined;
  isTrusted?: boolean | undefined;
  logoUrl?: string | undefined;
  description?: string | undefined;
  owner?: string | undefined;
};

export async function createClient(data: NewClient) {
  const clientSecret = `secret_${crypto.randomBytes(32).toString("hex")}`;
  const client = await OAuthClient.create({
    clientId: `client_${crypto.randomBytes(16).toString("hex")}`,
    clientSecretHash: await bcrypt.hash(clientSecret, BCRYPT_ROUNDS),
    name: data.name,
    redirectUris: data.redirectUris,
    isTrusted: data.isTrusted ?? false,
    ...(data.allowedScopes && { allowedScopes: data.allowedScopes }),
    ...(data.logoUrl && { logoUrl: data.logoUrl }),
    ...(data.description && { description: data.description }),
    ...(data.owner && { owner: data.owner }),
  });
  return { client, clientSecret };
}

export const getClientById = (clientId: string) => OAuthClient.findOne({ clientId });

export async function authenticateClient(clientId: string, clientSecret: string) {
  const client = await getClientById(clientId);
  if (!client || !(await bcrypt.compare(clientSecret, client.clientSecretHash))) {
    return null;
  }
  return client;
}

export const listClients = (owner: string) =>
  OAuthClient.find({ owner }).select("-clientSecretHash");

export const getOwnedClient = (clientId: string, owner: string) =>
  OAuthClient.findOne({ clientId, owner }).select("-clientSecretHash");

export async function deleteClient(clientId: string, owner: string) {
  const result = await OAuthClient.deleteOne({ clientId, owner });
  return result.deletedCount > 0;
}
