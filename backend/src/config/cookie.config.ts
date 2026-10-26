import "dotenv/config";

const COOKIE_BASE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: (process.env.NODE_ENV === "production" ? "none" : "lax") as
    | "none"
    | "lax",
  path: "/",
};

export const ACCESS_COOKIE_OPTIONS = {
  ...COOKIE_BASE_OPTIONS,
  maxAge: 15 * 60 * 1000,
};

export const REFRESH_COOKIE_OPTIONS = {
  ...COOKIE_BASE_OPTIONS,
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

export const COOKIE_CLEAR_OPTIONS = COOKIE_BASE_OPTIONS;
