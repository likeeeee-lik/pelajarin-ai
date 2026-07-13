// Tipe API bersama untuk mobile. Cerminan apps/web/src/lib/api/types.ts.
// TODO(shared): pindahkan ke packages/shared agar tak ganda dengan web.

export type MaterialType = "file" | "youtube" | "audio" | "video" | "note";
export type ExamType = "uts" | "uas" | "kuis" | "latihan";
export type Tingkat = "mudah" | "sedang" | "sulit";
export type QuizType = "pilihan_ganda" | "benar_salah" | "isian";

export interface Profile {
  id: string;
  nama: string;
  email: string;
  emailVerified: boolean;
  avatarUrl: string | null;
  plan: "free" | "pro" | "institusi";
  bahasaTampilan: string;
  bahasaGenerasi: string;
  xp: number;
  level: number;
  streakCurrent: number;
  streakBest: number;
  onboardingCompleted: boolean;
}

export type LeaderboardSort = "xp" | "streak";
export interface LeaderboardEntry {
  rank: number;
  userId: string;
  nama: string;
  avatarUrl: string | null;
  level: number;
  xp: number;
  streak: number;
  aku: boolean;
}
export interface LeaderboardResult {
  sort: LeaderboardSort;
  entries: LeaderboardEntry[];
  akuRank: number | null;
  total: number;
}

export interface UserStats {
  materials: number;
  flashcards: number;
  quizzes: number;
  predictions: number;
  subjects: number;
  files: number;
}

export interface Subject {
  id: string;
  nama: string;
  createdAt: string;
  _count?: { materials: number };
}

export interface Chapter {
  id: string;
  materialId: string;
  urutan: number;
  judul: string;
  status: "pending" | "ready";
  kontenMd: string | null;
  isPro: boolean;
}

export interface MaterialFile {
  id: string;
  name: string;
  size: number;
  mime: string;
  createdAt: string;
}

export interface MaterialSummary {
  id: string;
  judul: string;
  tipe: MaterialType;
  status: string;
  subjectId: string | null;
  subject: { id: string; nama: string } | null;
  createdAt: string;
  _count: { chapters: number };
}

export interface Material {
  id: string;
  judul: string;
  tipe: MaterialType;
  status: string;
  rawText: string | null;
  subjectId: string | null;
  subject: { id: string; nama: string } | null;
  modeBelajar: string;
  gayaPenulisan: string;
  bahasa: string;
  createdAt: string;
  chapters: Chapter[];
  files: MaterialFile[];
}

export interface MindmapNode {
  label: string;
  children?: MindmapNode[];
}
export interface MindMap {
  id: string;
  materialId: string;
  dataJson: MindmapNode;
}

export interface Flashcard {
  id: string;
  materialId: string;
  front: string;
  back: string;
}

export interface QuizQuestion {
  pertanyaan: string;
  tipe: QuizType;
  opsi?: string[];
  jawaban: string;
  pembahasan?: string;
}
export interface Quiz {
  id: string;
  materialId: string;
  soalJson: { count: number; types: QuizType[]; questions: QuizQuestion[] };
  skor: number | null;
  createdAt: string;
}

export interface ChatSession {
  id: string;
  materialId: string | null;
  createdAt: string;
}
export interface ChatMessage {
  id: string;
  sessionId: string;
  role: "user" | "assistant" | "system";
  konten: string;
  createdAt: string;
}

export interface PredictedQuestion {
  pertanyaan: string;
  tingkat: Tingkat;
  topik: string;
  opsi?: string[];
  jawaban?: string;
  pembahasan?: string;
}
export interface ExamPrediction {
  id: string;
  judul: string;
  tipe: ExamType;
  mapel: string | null;
  fileCount: number;
  questions: PredictedQuestion[];
  createdAt: string;
}
