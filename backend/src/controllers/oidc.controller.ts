import type { Request, Response } from "express";
import { getDiscoveryDocument } from "../config/oidc.config.js";
import { getJWKS as getJWKSData } from "../services/key.service.js";

export const getOpenIdConfiguration = (req: Request, res: Response) => {
  try {
    const discoveryDoc = getDiscoveryDocument();

    res.setHeader("Cache-Control", "public, max-age=3600");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET");
    return res.status(200).json(discoveryDoc);
  } catch (error) {
    console.error("Error generating OpenID Configuration");
    res.status(500).json({
      error: "server_error",
      error_description: "Failed to generate OpenID Configuration",
    });
  }
};

export const getJWKS = (req: Request, res: Response) => {
  try {
    const jwks = getJWKSData();

    res.setHeader("Cache-Control", "public, max-age=3600");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET");
    return res.status(200).json(jwks);
  } catch (error) {
    console.error("Error generating JWKS");
    res.status(500).json({
      error: "server_error",
      error_description: "Failed to generate JWKS",
    });
  }
};
