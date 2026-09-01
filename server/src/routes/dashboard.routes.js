import { Router } from "express";

import { dashboard } from "../controllers/dashboard.controller.js";

import { protect } from "../middleware/auth.middleware.js";

const router = Router();

router.use(protect);

router.get("/", dashboard);

export default router;