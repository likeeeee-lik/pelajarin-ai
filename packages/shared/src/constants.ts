/** Konstanta domain yang dipakai bersama web, api, dan mobile. */

export const PLANS = ["free", "pro", "institusi"] as const;
export type Plan = (typeof PLANS)[number];

export const MATERIAL_TYPES = ["file", "youtube", "audio", "video", "note"] as const;
export type MaterialType = (typeof MATERIAL_TYPES)[number];

export const EXAM_TYPES = ["uts", "uas", "kuis", "latihan"] as const;
export type ExamType = (typeof EXAM_TYPES)[number];

/** Persona AI (dari onboarding langkah 16). */
export const AI_PERSONAS = ["militer", "guru_bk", "teman_sebaya", "profesor"] as const;
export type AiPersona = (typeof AI_PERSONAS)[number];

/** Bahasa output AI (onboarding langkah 19). */
export const OUTPUT_LANGUAGES = ["id_baku", "id_santai", "en", "campur"] as const;
export type OutputLanguage = (typeof OUTPUT_LANGUAGES)[number];

/** 8 sumbu radar profil kognitif. */
export const COGNITIVE_AXES = [
  "ambisi",
  "energi",
  "teori_praktek",
  "memori",
  "fokus",
  "stres",
  "kecepatan",
  "motivasi",
] as const;
export type CognitiveAxis = (typeof COGNITIVE_AXES)[number];

/** Kuota mingguan plan Free (dari screenshot profil). */
export const FREE_QUOTA = {
  catatanPerWeek: 1,
  chatPerWeek: 0,
  prediksiLifetime: 1,
} as const;

export const XP_PER_LEVEL_BASE = 174; // "0 / 174 XP ke level berikutnya"
