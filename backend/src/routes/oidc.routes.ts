/**
 * OIDC Discovery Routes
 */

import { Router, type Router as ExpressRouter } from "express";
import {
  getOpenIdConfiguration,
  getJWKS,
} from "../controllers/oidc.controller.js";

const router: ExpressRouter = Router();

router.get("/.well-known/openid-configuration", getOpenIdConfiguration);
router.get("/.well-known/jwks.json", getJWKS);

export default router;
