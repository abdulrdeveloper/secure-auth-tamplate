import express, { Router, type Router as ExpressRouter } from "express";
import { exchangeToken, getUserInfo } from "../controllers/oauth-token.controller.js";
import { rateLimit } from "../middlewares/rate-limit.middleware.js";
import { BODY_LIMIT } from "../config/auth.config.js";

const router: ExpressRouter = Router();

router.post(
  "/token",
  rateLimit("oauth_token", 30, 60),
  express.urlencoded({ extended: false, limit: BODY_LIMIT }),
  exchangeToken
);
router.get("/userinfo", rateLimit("oauth_userinfo", 60, 60), getUserInfo);
router.post("/userinfo", rateLimit("oauth_userinfo", 60, 60), getUserInfo);

export default router;
