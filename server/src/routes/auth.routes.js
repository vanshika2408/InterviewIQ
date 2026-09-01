import { Router } from "express";

import {
  login,
  register,
  refreshAccessToken,
  logout,
  verifyEmail,
  forgotPassword,
  resetPassword
} from "../controllers/auth.controller.js";

import {
  loginSchema,
  registerSchema,
} from "../validators/auth.validator.js";

import { protect } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/register", (req, res, next) => {
  const result = registerSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      success: false,
      message: "Invalid registration data.",
      errors: result.error.flatten(),
    });
  }

  req.body = result.data;
  next();
}, register);

router.post("/login", (req, res, next) => {
  const result = loginSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      success: false,
      message: "Invalid login data.",
      errors: result.error.flatten(),
    });
  }

  req.body = result.data;
  next();
}, login);

// Refresh access token
router.post("/refresh", refreshAccessToken);

// Logout
router.post("/logout", protect, logout);

router.post("/verify-email", verifyEmail);

router.post("/forgot-password", (req, res, next) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({
      success: false,
      message: "Email is required.",
    });
  }

  next();
}, forgotPassword);

router.post("/reset-password", (req, res, next) => {
  const { token, password } = req.body;

  if (!token || !password || password.length < 6) {
    return res.status(400).json({
      success: false,
      message: "A valid token and password of at least 6 characters are required.",
    });
  }

  next();
}, resetPassword);
export default router;