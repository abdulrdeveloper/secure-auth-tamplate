import crypto from "node:crypto";
import bcrypt from "bcrypt";
import { OAuthClient, type IOAuthClient } from "../models/oauth-client.model.js";
import { BCRYPT_ROUNDS } from "../config/auth.config.js";

export const generateClientId = (): string => {
  return `client_${crypto.randomBytes(16).toString("hex")}`;
};

export const generateClientSecret = (): string => {
  return `secret_${crypto.randomBytes(32).toString("hex")}`;
};

export const hashClientSecret = async (secret: string): Promise<string> => {
  return await bcrypt.hash(secret, BCRYPT_ROUNDS);
};

export const verifyClientSecret = async (
  secret: string,
  hash: string
): Promise<boolean> => {
  return await bcrypt.compare(secret, hash);
};

export const createClient = async (data: {
  name: string;
  redirectUris: string[];
  allowedScopes?: string[];
  isTrusted?: boolean;
  logoUrl?: string;
  description?: string;
  owner?: string | undefined;
}): Promise<{ client: IOAuthClient; clientSecret: string }> => {
  const clientId = generateClientId();
  const clientSecret = generateClientSecret();
  const clientSecretHash = await hashClientSecret(clientSecret);

  const client = await OAuthClient.create({
    clientId,
    clientSecretHash,
    name: data.name,
    redirectUris: data.redirectUris,
    allowedScopes: data.allowedScopes || ["openid", "profile", "email"],
    isTrusted: data.isTrusted || false,
    ...(data.logoUrl && { logoUrl: data.logoUrl }),
    ...(data.description && { description: data.description }),
    ...(data.owner && { owner: data.owner }),
  });

  return { client, clientSecret };
};

export const getClientById = async (
  clientId: string
): Promise<IOAuthClient | null> => {
  return await OAuthClient.findOne({ clientId });
};

export const validateRedirectUri = async (
  clientId: string,
  redirectUri: string
): Promise<boolean> => {
  const client = await getClientById(clientId);
  if (!client) return false;

  return client.redirectUris.includes(redirectUri);
};

export const authenticateClient = async (
  clientId: string,
  clientSecret: string
): Promise<IOAuthClient | null> => {
  const client = await getClientById(clientId);
  if (!client) return null;

  const isValid = await verifyClientSecret(clientSecret, client.clientSecretHash);
  if (!isValid) return null;

  return client;
};

export const listClients = async (ownerId?: string): Promise<IOAuthClient[]> => {
  const query = ownerId ? { owner: ownerId } : {};
  return await OAuthClient.find(query).select("-clientSecretHash");
};

export const deleteClient = async (
  clientId: string,
  ownerId?: string
): Promise<boolean> => {
  const query: Record<string, unknown> = { clientId };
  if (ownerId) {
    query.owner = ownerId;
  }
  const result = await OAuthClient.deleteOne(query);
  return result.deletedCount > 0;
};
