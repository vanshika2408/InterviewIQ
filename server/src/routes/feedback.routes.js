import { Router } from "express";

import {
  createFeedback,
  getInterviewFeedback,
} from "../controllers/feedback.controller.js";

import { protect } from "../middleware/auth.middleware.js";

const router = Router();

router.use(protect);

router.post("/:id", createFeedback);

router.get("/:id", getInterviewFeedback);

export default router;
