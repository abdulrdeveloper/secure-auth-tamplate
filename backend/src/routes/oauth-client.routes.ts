import { Router, type Router as ExpressRouter } from "express";
import {
  registerClient,
  getClientInfo,
  getClients,
  getClient,
  removeClient,
} from "../controllers/oauth-client.controller.js";
import { approveConsent } from "../controllers/oauth-authorize.controller.js";
import { getGrants, removeGrant } from "../controllers/grants.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { rateLimit } from "../middlewares/rate-limit.middleware.js";

const router: ExpressRouter = Router();

router.get("/client-info", rateLimit("client_info", 60, 60), getClientInfo);
router.post("/clients", authenticate, rateLimit("client_register", 10, 60), registerClient);
router.get("/clients", authenticate, getClients);
router.get("/clients/:clientId", authenticate, getClient);
router.delete("/clients/:clientId", authenticate, removeClient);
router.post("/consent", rateLimit("oauth_consent", 30, 60), authenticate, approveConsent);
router.get("/grants", authenticate, getGrants);
router.delete("/grants/:clientId", authenticate, rateLimit("grant_remove", 30, 60), removeGrant);

export default router;
