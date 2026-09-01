import { Router } from "express";

import {
  getUsers,
  getReports,
  getAnalytics,
  getAIUsage,
  getPlans,
  moderateUser,
} from "../controllers/admin.controller.js";

import { protect } from "../middleware/auth.middleware.js";
import { requireAdmin } from "../middleware/admin.middleware.js";

const router = Router();

router.use(protect, requireAdmin);

router.get("/users", getUsers);

router.get("/reports", getReports);

router.get("/analytics", getAnalytics);

router.get("/ai-usage", getAIUsage);

router.get("/plans", getPlans);

router.patch("/users/:userId/moderate", moderateUser);

export default router;