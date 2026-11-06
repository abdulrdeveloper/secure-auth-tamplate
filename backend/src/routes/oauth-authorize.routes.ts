import { Router, type Router as ExpressRouter } from "express";
import { authorize, approveConsent } from "../controllers/oauth-authorize.controller.js";
import { authenticate, resolveSession } from "../middlewares/auth.middleware.js";
import { rateLimit } from "../middlewares/rate-limit.middleware.js";

const router: ExpressRouter = Router();

router.get("/authorize", rateLimit("oauth_authorize", 60, 60), resolveSession, authorize);
router.post("/authorize/consent", rateLimit("oauth_consent", 30, 60), authenticate, approveConsent);

export default router;
