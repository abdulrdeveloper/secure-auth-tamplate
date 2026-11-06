import { Router, type Router as ExpressRouter } from "express";
import {
  registerClient,
  getClients,
  getClient,
  removeClient,
} from "../controllers/oauth-client.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const router: ExpressRouter = Router();

router.post("/clients", authenticate, registerClient);
router.get("/clients", authenticate, getClients);
router.get("/clients/:clientId", authenticate, getClient);
router.delete("/clients/:clientId", authenticate, removeClient);

export default router;
