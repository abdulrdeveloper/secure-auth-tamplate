import { Router, type Router as ExpressRouter } from "express";
import {
  getOpenIdConfiguration,
  getJWKS,
} from "../controllers/oidc.controller.js";
import oauthAuthorizeRoutes from "./oauth-authorize.routes.js";
import oauthTokenRoutes from "./oauth-token.routes.js";

const router: ExpressRouter = Router();

router.get("/.well-known/openid-configuration", getOpenIdConfiguration);
router.get("/.well-known/jwks.json", getJWKS);

router.use("/oauth", oauthAuthorizeRoutes);
router.use("/oauth", oauthTokenRoutes);

export default router;
