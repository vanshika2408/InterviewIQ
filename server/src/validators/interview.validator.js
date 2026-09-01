import { z } from "zod";

export const createInterviewSchema = z.object({
  type: z.enum(["technical", "hr", "coding", "voice"]),
  role: z.string().min(2),
  difficulty: z.enum(["easy", "medium", "hard"]).default("medium"),
  duration: z.number().int().min(1).max(180),
  language: z.string().min(2).default("English"),
  topics: z.array(z.string()).default([]),
});

export const submitAnswerSchema = z.object({
  questionId: z.string().min(1),
  answer: z.string().optional().default(""),
  code: z.string().optional().default(""),
  language: z.string().optional().default(""),
  audioUrl: z.string().optional().default(""),
});
