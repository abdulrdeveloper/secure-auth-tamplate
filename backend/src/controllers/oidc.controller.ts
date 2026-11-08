import type { Request, Response } from "express";
import { DISCOVERY_DOCUMENT } from "../config/oidc.config.js";
import { getJwks } from "../services/key.service.js";

export const getOpenIdConfiguration = (_req: Request, res: Response) => {
  res.set("Cache-Control", "public, max-age=3600").json(DISCOVERY_DOCUMENT);
};

export const getJWKS = (_req: Request, res: Response) => {
  res.set("Cache-Control", "public, max-age=3600").json(getJwks());
};
