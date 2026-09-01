import { z } from "zod";

export const resumeUploadSchema = z.object({
  fileName: z.string().min(1),
});

export const resumeIdSchema = z.object({
  id: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid resume ID."),
});
