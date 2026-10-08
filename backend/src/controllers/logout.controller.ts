import type { Request, Response } from "express";

async function logoutUser(_req: Request, res: Response) {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: (process.env.NODE_ENV === "production" ? "none" : "lax") as
        | "none"
        | "lax",
      path: "/",
      maxAge: 0,
    });

    return res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.error("Error in logoutUser:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export { logoutUser };
