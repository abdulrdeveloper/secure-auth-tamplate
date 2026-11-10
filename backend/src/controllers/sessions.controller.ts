import type { Request, Response } from "express";
import { deleteSession, getSession, listSessions } from "../services/session.service.js";
import { clearAuthCookies } from "../utils/token.util.js";
import { describeDevice } from "../utils/user-agent.util.js";

// Node reports IPv4 clients as "::ffff:1.2.3.4".
const displayIp = (ip: string) => ip.replace(/^::ffff:/, "");

// GET /api/auth/sessions: every device signed in to this account.
export async function getSessions(req: Request, res: Response) {
  const sessions = await listSessions(req.userId as string);

  res.setHeader("Cache-Control", "no-store");
  return res.status(200).json({
    sessions: sessions
      .map((session) => ({
        id: session.id,
        device: describeDevice(session.userAgent),
        ip: displayIp(session.ip),
        createdAt: new Date(session.createdAt).toISOString(),
        lastUsedAt: new Date(session.lastUsedAt).toISOString(),
        current: session.id === req.sessionId,
      }))
      .sort((a, b) => Number(b.current) - Number(a.current)),
  });
}

// DELETE /api/auth/sessions/:id: signs that device out immediately.
export async function removeSession(req: Request, res: Response) {
  const id = String(req.params.id ?? "");
  const userId = req.userId as string;
  const session = id ? await getSession(id) : null;

  // Another user's session id gets the same answer as a missing one.
  if (!session || session.userId !== userId) {
    return res.status(404).json({ message: "Device not found. It may already be signed out." });
  }

  await deleteSession(userId, id);
  if (id === req.sessionId) clearAuthCookies(res);

  return res.status(204).end();
}
