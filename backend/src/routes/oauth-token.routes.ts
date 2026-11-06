import { Router, type Router as ExpressRouter } from "express";
import { exchangeToken, getUserInfo } from "../controllers/oauth-token.controller.js";

const router: ExpressRouter = Router();

router.post("/token", exchangeToken);
router.get("/userinfo", getUserInfo);
router.post("/userinfo", getUserInfo);

export default router;
