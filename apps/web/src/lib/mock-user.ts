/**
 * Data user tiruan untuk membangun UI app sebelum API/Logto aktif.
 * TODO(API): ganti dengan `api.getMe()` saat auth + DB di-wire.
 */
export interface MockUser {
  nama: string;
  email: string;
  level: number;
  xp: number;
  xpToNext: number;
  streakCurrent: number;
  streakBest: number;
  ranking: number | null;
  kartuHariIni: number;
  plan: "free" | "pro" | "institusi";
  flashcardDireview: number;
  kuisLulus: number;
  kuisSempurna: number;
}

export const MOCK_USER: MockUser = {
  nama: "Likae",
  email: "sefinalika@gmail.com",
  level: 1,
  xp: 0,
  xpToNext: 174,
  streakCurrent: 0,
  streakBest: 0,
  ranking: null,
  kartuHariIni: 0,
  plan: "free",
  flashcardDireview: 0,
  kuisLulus: 0,
  kuisSempurna: 0,
};
