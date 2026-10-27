import express, { Router } from "express";
import { registerUser } from "../controllers/register.controller.js";
import { verifyOtp } from "../controllers/verify-email.controller.js";
import { resendOtp } from "../controllers/resend-otp.controller.js";
import { loginUser } from "../controllers/login.controller.js";
import { forgotPassword } from "../controllers/forgot-password.controller.js";
import { verifyResetOtp } from "../controllers/verify-reset-otp.controller.js";
import { passwordReset } from "../controllers/reset-password.controller.js";
import { getMe } from "../controllers/me.controller.js";
import { logoutUser } from "../controllers/logout.controller.js";
import { refreshToken } from "../controllers/refresh.controller.js";
import {
  registerSchema,
  loginSchema,
  emailSchema,
  resetPasswordSchema,
  verifyOtpSchema,
} from "../config/validation.js";
import { validate } from "../middlewares/validate.middleware.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { rateLimit } from "../middlewares/rate-limit.middleware.js";
import {
  RATE_LIMIT_MAX,
  RATE_LIMIT_WINDOW_SECONDS,
} from "../config/auth.config.js";

const authRoutes: Router = express.Router();

const loginLimit = rateLimit("login", RATE_LIMIT_MAX.login, RATE_LIMIT_WINDOW_SECONDS);
const emailLimit = rateLimit("email", RATE_LIMIT_MAX.email, RATE_LIMIT_WINDOW_SECONDS);
const otpLimit = rateLimit("otp", RATE_LIMIT_MAX.otp, RATE_LIMIT_WINDOW_SECONDS);

authRoutes.post("/register", emailLimit, validate(registerSchema), registerUser);
authRoutes.post("/verify-email", otpLimit, validate(verifyOtpSchema), verifyOtp);
authRoutes.post("/resend-otp", emailLimit, validate(emailSchema), resendOtp);
authRoutes.post("/login", loginLimit, validate(loginSchema), loginUser);
authRoutes.post("/forgot-password", emailLimit, validate(emailSchema), forgotPassword);
authRoutes.post("/verify-reset-otp", otpLimit, validate(verifyOtpSchema), verifyResetOtp);
authRoutes.post("/reset-password", otpLimit, validate(resetPasswordSchema), passwordReset);
authRoutes.post("/refresh", refreshToken);
authRoutes.get("/me", authenticate, getMe);
authRoutes.post("/logout", logoutUser);

export default authRoutes;
