import { z } from "zod";
import { PLANS } from "../constants";

/** Profil user seperti dikembalikan API `GET /me`. */
export const profileSchema = z.object({
  id: z.string(),
  nama: z.string(),
  email: z.string().email(),
  avatarUrl: z.string().url().nullable().optional(),
  plan: z.enum(PLANS).default("free"),
  bahasaTampilan: z.string().default("id"),
  bahasaGenerasi: z.string().default("id"),
  xp: z.number().int().nonnegative().default(0),
  level: z.number().int().positive().default(1),
  streakCurrent: z.number().int().nonnegative().default(0),
  streakBest: z.number().int().nonnegative().default(0),
  onboardingCompleted: z.boolean().default(false),
});
export type Profile = z.infer<typeof profileSchema>;

export const updateProfileSchema = z.object({
  nama: z.string().min(1).max(80).optional(),
  bahasaTampilan: z.string().optional(),
  bahasaGenerasi: z.string().optional(),
});
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
