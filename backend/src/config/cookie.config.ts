import {
  ACCESS_TOKEN_TTL_SECONDS,
  REFRESH_TOKEN_TTL_SECONDS,
} from "./auth.config.js";

const isProduction = process.env.NODE_ENV === "production";

const COOKIE_BASE_OPTIONS = {
  httpOnly: true,
  secure: isProduction,
  sameSite: process.env.COOKIE_SAMESITE as "lax" | "none",
  path: "/",
};

export const ACCESS_COOKIE_OPTIONS = {
  ...COOKIE_BASE_OPTIONS,
  maxAge: ACCESS_TOKEN_TTL_SECONDS * 1000,
};

export const REFRESH_COOKIE_OPTIONS = {
  ...COOKIE_BASE_OPTIONS,
  maxAge: REFRESH_TOKEN_TTL_SECONDS * 1000,
};

export const COOKIE_CLEAR_OPTIONS = COOKIE_BASE_OPTIONS;
