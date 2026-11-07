import { Router, type Router as ExpressRouter } from "express";
import { authorize } from "../controllers/oauth-authorize.controller.js";
import { resolveSession } from "../middlewares/auth.middleware.js";
import { rateLimit } from "../middlewares/rate-limit.middleware.js";

const router: ExpressRouter = Router();

router.get("/authorize", rateLimit("oauth_authorize", 60, 60), resolveSession, authorize);

export default router;
