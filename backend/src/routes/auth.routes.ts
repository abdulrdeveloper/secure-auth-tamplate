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
import {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  verifyOtpSchema,
  resendOtpSchema,
} from "../config/validation.js";
import { validate } from "../middlewares/validate.middleware.js";
import { authenticate } from "../middlewares/auth.middleware.js";


const authRoutes: Router = express.Router();

authRoutes.post("/register", validate(registerSchema), registerUser);
authRoutes.post("/verify-email", validate(verifyOtpSchema), verifyOtp);
authRoutes.post("/resend-otp", validate(resendOtpSchema), resendOtp);
authRoutes.post("/login", validate(loginSchema), loginUser);
authRoutes.post("/forgot-password", validate(forgotPasswordSchema), forgotPassword);
authRoutes.post("/verify-reset-otp", validate(verifyOtpSchema), verifyResetOtp);
authRoutes.post("/reset-password", validate(resetPasswordSchema), passwordReset);
authRoutes.get("/me", authenticate, getMe);
authRoutes.post("/logout", logoutUser);

export default authRoutes;
