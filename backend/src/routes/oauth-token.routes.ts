import express, { Router, type Router as ExpressRouter } from "express";
import { exchangeToken, getUserInfo } from "../controllers/oauth-token.controller.js";
import { BODY_LIMIT } from "../config/auth.config.js";

const router: ExpressRouter = Router();

router.post(
  "/token",
  express.urlencoded({ extended: true, limit: BODY_LIMIT }),
  exchangeToken
);
router.get("/userinfo", getUserInfo);
router.post("/userinfo", getUserInfo);

export default router;
