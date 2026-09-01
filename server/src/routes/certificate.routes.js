import { Router } from "express";

import {
  issueCertificate,
  getCertificates,
  getOneCertificate,
} from "../controllers/certificate.controller.js";

import { protect } from "../middleware/auth.middleware.js";

const router = Router();

router.use(protect);

router.get("/", getCertificates);

router.post(
  "/interview/:interviewId",
  issueCertificate
);

router.get(
  "/:certificateId",
  getOneCertificate
);

export default router;
