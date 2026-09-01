import { Router } from "express";

import { getUserAnalytics } from "../controllers/analytics.controller.js";

import { protect } from "../middleware/auth.middleware.js";

const router = Router();

router.use(protect);

router.get("/", getUserAnalytics);

export default router;
