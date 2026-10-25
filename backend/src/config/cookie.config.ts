import "dotenv/config";

const COOKIE_BASE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: (process.env.NODE_ENV === "production" ? "none" : "lax") as
    | "none"
    | "lax",
  path: "/",
};

export const COOKIE_OPTIONS = {
  ...COOKIE_BASE_OPTIONS,
  maxAge: 60 * 60 * 1000,
};

export const COOKIE_CLEAR_OPTIONS = COOKIE_BASE_OPTIONS;
