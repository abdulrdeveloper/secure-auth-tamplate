import type { Request, Response } from "express";
import { COOKIE_CLEAR_OPTIONS } from "../config/cookie.config.js";

async function logoutUser(_req: Request, res: Response) {
  try {
    res.clearCookie("token", COOKIE_CLEAR_OPTIONS);

    return res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.error("Error in logoutUser:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export { logoutUser };
