import type { Answers } from "./types";

// TODO(shared): salinan dari apps/web/src/lib/onboarding/scoring.ts.

export const RADAR_AXES = [
  { key: "ambisi", label: "Ambisi" },
  { key: "energi", label: "Energi" },
  { key: "teori_praktek", label: "Teori/Praktek" },
  { key: "memori", label: "Memori" },
  { key: "fokus", label: "Fokus" },
  { key: "stres", label: "Stres" },
  { key: "kecepatan", label: "Kecepatan" },
  { key: "motivasi", label: "Motivasi" },
] as const;

export type RadarScores = Record<(typeof RADAR_AXES)[number]["key"], number>;

const clamp = (n: number) => Math.max(0, Math.min(100, Math.round(n)));
const num = (a: Answers, k: string, fallback = 50): number =>
  typeof a[k] === "number" ? (a[k] as number) : fallback;

const FOKUS_MAP: Record<string, number> = { lt15: 25, "30": 50, "60": 75, gt120: 95 };
const MOTIVASI_MAP: Record<string, number> = {
  ortu_bangga: 70,
  takut_gagal: 60,
  pembuktian: 85,
  karir: 90,
};

/** Hitung 8 skor radar (0-100) dari jawaban onboarding. */
export function computeRadar(a: Answers): RadarScores {
  const golden = Array.isArray(a.golden_hours) ? (a.golden_hours as number[]) : [];
  const energi = golden.length ? golden.reduce((s, v) => s + v, 0) / golden.length : 50;

  return {
    ambisi: clamp(num(a, "ambisi", 5) * 10),
    energi: clamp(energi),
    teori_praktek: clamp(num(a, "gaya_belajar")),
    memori: clamp(num(a, "kelemahan_memori")),
    fokus: clamp(FOKUS_MAP[String(a.fokus_tanpa_hp)] ?? 50),
    stres: clamp(num(a, "level_stres", 0)),
    kecepatan: clamp(100 - num(a, "tipe_kerja")),
    motivasi: clamp(MOTIVASI_MAP[String(a.motivasi)] ?? 60),
  };
}
