import { z } from "zod";
import { AI_PERSONAS, COGNITIVE_AXES, OUTPUT_LANGUAGES } from "../constants";

/** Satu jawaban onboarding (key-value fleksibel). */
export const onboardingAnswerSchema = z.object({
  questionKey: z.string(),
  value: z.unknown(),
});
export type OnboardingAnswer = z.infer<typeof onboardingAnswerSchema>;

/** Payload submit seluruh onboarding (20 langkah / 5 fase). */
export const onboardingSubmitSchema = z.object({
  answers: z.array(onboardingAnswerSchema),
  persona: z.enum(AI_PERSONAS).optional(),
  outputLanguage: z.enum(OUTPUT_LANGUAGES).optional(),
});
export type OnboardingSubmitInput = z.infer<typeof onboardingSubmitSchema>;

/** Skor 8 sumbu radar (0-100) hasil analisis onboarding. */
export const cognitiveScoresSchema = z.object(
  Object.fromEntries(
    COGNITIVE_AXES.map((axis) => [axis, z.number().min(0).max(100)]),
  ) as Record<(typeof COGNITIVE_AXES)[number], z.ZodNumber>,
);
export type CognitiveScores = z.infer<typeof cognitiveScoresSchema>;
