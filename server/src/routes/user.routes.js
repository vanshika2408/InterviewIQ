import { Router } from "express";

import {
  getMe,
  updateProfile,
  changePassword,
  getSettings,
  updateSettings,
  sendTestEmail,
} from "../controllers/user.controller.js";

import { protect } from "../middleware/auth.middleware.js";

import {
  updateProfileSchema,
  changePasswordSchema,
  updateSettingsSchema,
} from "../validators/user.validator.js";

const router = Router();

router.use(protect);

router.get("/me", getMe);
router.get("/profile", getMe);

router.get("/settings", getSettings);

router.put("/settings", (req, res, next) => {
  const result = updateSettingsSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      success: false,
      message: "Invalid settings data.",
      errors: result.error.flatten(),
    });
  }

  req.body = result.data;
  next();
}, updateSettings);

router.post("/settings/test-email", sendTestEmail);

router.put("/profile", (req, res, next) => {
  const result = updateProfileSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      success: false,
      message: "Invalid profile data.",
      errors: result.error.flatten(),
    });
  }

  req.body = result.data;
  next();
}, updateProfile);

const handlePasswordChange = (req, res, next) => {
  const result = changePasswordSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      success: false,
      message: "Invalid password data.",
      errors: result.error.flatten(),
    });
  }

  req.body = result.data;
  next();
};

router.put("/password", handlePasswordChange, changePassword);
router.put("/change-password", handlePasswordChange, changePassword);

export default router;