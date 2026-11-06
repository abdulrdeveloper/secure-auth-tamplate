import type { IOAuthClient } from "../models/oauth-client.model.js";

declare global {
  namespace Express {
    interface Request {
      oauthClient?: IOAuthClient;
    }
  }
}

export {};
