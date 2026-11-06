import express, { Router, type Router as ExpressRouter } from "express";
import { exchangeToken, getUserInfo } from "../controllers/oauth-token.controller.js";
import { BODY_LIMIT } from "../config/auth.config.js";

const router: ExpressRouter = Router();

// RFC 6749 §4.1.3 requires application/x-www-form-urlencoded token requests.
// Form parsing is scoped to this route only so cookie-authenticated session
// endpoints never accept cross-site HTML form posts (login CSRF).
const tokenFormParser = express.urlencoded({ extended: false, limit: BODY_LIMIT });

router.post("/token", tokenFormParser, exchangeToken);
router.get("/userinfo", getUserInfo);
router.post("/userinfo", getUserInfo);

export default router;
