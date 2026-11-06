import { Router, type Router as ExpressRouter } from "express";
import { authorize, approveConsent } from "../controllers/oauth-authorize.controller.js";
import { authenticate, resolveSession } from "../middlewares/auth.middleware.js";

const router: ExpressRouter = Router();

router.get("/authorize", resolveSession, authorize);
router.post("/authorize/consent", authenticate, approveConsent);

export default router;
