import { Router } from "express";

import {
  create,
  getAll,
  getOne,
  start,
  answer,
  complete,
  processVoiceAnswer
} from "../controllers/interview.controller.js";

import { protect } from "../middleware/auth.middleware.js";
import { createInterviewSchema } from "../validators/interview.validator.js";
import { uploadAudio } from "../middleware/upload.middleware.js";

const router = Router();

router.use(protect);

router.get("/", getAll);

router.post("/", (req, res, next) => {
  const result = createInterviewSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      success: false,
      message: "Invalid interview data.",
      errors: result.error.flatten(),
    });
  }

  req.body = result.data;
  next();
}, create);

router.get("/:id", getOne);

router.post("/:id/start", start);

router.post("/:id/answer", answer);

router.post("/:id/complete", complete);

router.post(
  "/:id/voice",
  uploadAudio.single("audio"),
  processVoiceAnswer
);

export default router;
