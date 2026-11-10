import crypto from "node:crypto";
import { REFRESH_TOKEN_TTL_SECONDS } from "../config/auth.config.js";
import redis from "./redis.service.js";

// One record per signed-in device. The refresh token carries the session id
// and a token id that rotates on every refresh, so a copied old refresh token
// stops working. Deleting the record signs that device out at once, because
// the auth middleware checks the session on every request.
//
// Keys:
//   session:<id>             JSON Session, expires with the refresh token
//   user_sessions:<userId>   set of that user's session ids

export interface Session {
  id: string;
  userId: string;
  tokenId: string;
  userAgent: string;
  ip: string;
  createdAt: number;
  lastUsedAt: number;
}

export interface ClientMeta {
  userAgent: string;
  ip: string;
}

const MAX_USER_AGENT_LENGTH = 512;

const sessionKey = (id: string) => `session:${id}`;
const userSessionsKey = (userId: string) => `user_sessions:${userId}`;

function clean(meta: ClientMeta): ClientMeta {
  return {
    userAgent: meta.userAgent.slice(0, MAX_USER_AGENT_LENGTH),
    ip: meta.ip.slice(0, 64),
  };
}

async function save(session: Session): Promise<void> {
  await redis
    .multi()
    .set(sessionKey(session.id), session, { ex: REFRESH_TOKEN_TTL_SECONDS })
    .sadd(userSessionsKey(session.userId), session.id)
    .expire(userSessionsKey(session.userId), REFRESH_TOKEN_TTL_SECONDS)
    .exec();
}

export async function createSession(userId: string, meta: ClientMeta): Promise<Session> {
  const now = Date.now();
  const session: Session = {
    id: crypto.randomUUID(),
    userId,
    tokenId: crypto.randomUUID(),
    ...clean(meta),
    createdAt: now,
    lastUsedAt: now,
  };
  await save(session);
  return session;
}

export async function getSession(id: string): Promise<Session | null> {
  return redis.get<Session>(sessionKey(id));
}

// Issues a new token id for a session and records where it was used from.
export async function rotateSession(session: Session, meta: ClientMeta): Promise<Session> {
  const next: Session = {
    ...session,
    ...clean(meta),
    tokenId: crypto.randomUUID(),
    lastUsedAt: Date.now(),
  };
  await save(next);
  return next;
}

export async function deleteSession(userId: string, id: string): Promise<void> {
  await redis.multi().del(sessionKey(id)).srem(userSessionsKey(userId), id).exec();
}

export async function deleteAllSessions(userId: string): Promise<void> {
  const ids = await redis.smembers(userSessionsKey(userId));
  const tx = redis.multi().del(userSessionsKey(userId));
  for (const id of ids) tx.del(sessionKey(id));
  await tx.exec();
}

// Most recently used first. Ids whose record has expired are pruned from the set.
export async function listSessions(userId: string): Promise<Session[]> {
  const ids = await redis.smembers(userSessionsKey(userId));
  if (ids.length === 0) return [];

  const records = await redis.mget<(Session | null)[]>(...ids.map(sessionKey));
  const live = records.filter((s): s is Session => s !== null && s.userId === userId);
  const stale = ids.filter((id) => !live.some((s) => s.id === id));
  if (stale.length > 0) await redis.srem(userSessionsKey(userId), ...stale);

  return live.sort((a, b) => b.lastUsedAt - a.lastUsedAt);
}
