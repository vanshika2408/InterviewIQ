import Certificate from "../models/Certificate.js";
import Interview from "../models/Interview.js";
import { generateCertificateId } from "../utils/generateCertificate.js";

export const createCertificate = async (interviewId, userId) => {
  const interview = await Interview.findOne({
    _id: interviewId,
    user: userId,
    status: "completed",
  });

  if (!interview) {
    throw new Error("Completed interview not found.");
  }

  const existing = await Certificate.findOne({
    interview: interviewId,
    user: userId,
  });

  if (existing) {
    return existing;
  }

  return Certificate.create({
    user: userId,
    interview: interviewId,
    certificateId: generateCertificateId(),
    role: interview.role,
    score: interview.score,
  });
};

export const getUserCertificates = async (userId) => {
  return Certificate.find({
    user: userId,
  })
    .populate("interview", "type role difficulty score completedAt")
    .sort({ issuedAt: -1 });
};

export const getCertificate = async (certificateId, userId) => {
  return Certificate.findOne({
    certificateId,
    user: userId,
  }).populate("interview", "type role difficulty score completedAt");
};
