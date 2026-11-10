import { isValidObjectId } from "mongoose";
import { OAuthGrant, type IOAuthGrant } from "../models/oauth-grant.model.js";

// Saves (or widens) the user's grant for an app and returns it.
export async function recordGrant(userId: string, clientId: string, scopes: string[]): Promise<IOAuthGrant> {
  const grant = await OAuthGrant.findOneAndUpdate(
    { user: userId, clientId },
    { $addToSet: { scopes: { $each: scopes } } },
    { upsert: true, new: true, setDefaultsOnInsert: true },
  ).lean();
  return grant as IOAuthGrant;
}

// The grant, if it already allows every requested scope.
export async function findCoveringGrant(
  userId: string,
  clientId: string,
  scopes: string[],
): Promise<IOAuthGrant | null> {
  const grant = await OAuthGrant.findOne({ user: userId, clientId }).lean();
  return grant && scopes.every((scope) => grant.scopes.includes(scope)) ? grant : null;
}

// True if this exact grant still exists for this user and app.
export async function isGrantActive(grantId: unknown, userId: unknown, clientId: unknown): Promise<boolean> {
  if (typeof grantId !== "string" || !isValidObjectId(grantId)) return false;
  const found = await OAuthGrant.exists({ _id: grantId, user: String(userId), clientId: String(clientId) });
  return found !== null;
}

export async function touchGrant(grantId: string): Promise<void> {
  await OAuthGrant.updateOne({ _id: grantId }, { lastUsedAt: new Date() });
}

export const listGrants = (userId: string) =>
  OAuthGrant.find({ user: userId }).sort({ lastUsedAt: -1, createdAt: -1 }).lean();

export async function revokeGrant(userId: string, clientId: string): Promise<boolean> {
  const result = await OAuthGrant.deleteOne({ user: userId, clientId });
  return result.deletedCount > 0;
}

export async function deleteGrantsForClient(clientId: string): Promise<void> {
  await OAuthGrant.deleteMany({ clientId });
}
