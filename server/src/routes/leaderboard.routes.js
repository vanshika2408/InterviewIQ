import { Router } from "express";

import {
  leaderboard,
  achievements,
  dailyChallenge,
  completeChallenge,
} from "../controllers/leaderboard.controller.js";

import { protect } from "../middleware/auth.middleware.js";

const router = Router();

router.use(protect);

router.get("/", leaderboard);

router.get("/achievements", achievements);

router.get("/daily", dailyChallenge);

router.post("/daily/:id/complete", completeChallenge);

export default router;
