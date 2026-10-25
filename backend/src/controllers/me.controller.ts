import type { Request, Response } from "express";

import userModel from "../models/user.model.js";
import { toPublicUser } from "../utils/user.util.js";

async function getMe(req: Request, res: Response) {
  try {
    const user = await userModel.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      user: toPublicUser(user),
    });
  } catch (error) {
    console.error("Error in getMe:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export { getMe };
