import { Router } from "express";

import {
  uploadResume,
  getResume,
  deleteResume,
} from "../controllers/resume.controller.js";

import { protect } from "../middleware/auth.middleware.js";
import { uploadResume as upload } from "../middleware/upload.middleware.js";

const router = Router();

router.use(protect);

router.get("/", getResume);

router.post("/", upload.single("resume"), uploadResume);

router.delete("/", deleteResume);

export default router;
