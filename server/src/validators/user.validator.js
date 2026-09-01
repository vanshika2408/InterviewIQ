import { z } from "zod";

export const updateProfileSchema = z.object({
  firstName: z.string().min(2).optional(),
  lastName: z.string().min(2).optional(),

  profile: z.object({
    location: z.string().optional(),
    bio: z.string().optional(),
    skills: z.array(z.string()).optional(),
    education: z.string().optional(),
    university: z.string().optional(),
    profileImage: z.string().optional(),
  }).optional(),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(6),
  newPassword: z.string().min(6),
});

export const updateSettingsSchema = z.object({
  emailNotifications: z.boolean().optional(),
  interviewReminders: z.boolean().optional(),
  weeklyProgress: z.boolean().optional(),
  soundEffects: z.boolean().optional(),
  darkMode: z.boolean().optional(),
});