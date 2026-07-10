export type MaterialType = "file" | "youtube" | "audio" | "video" | "note";
export type ChapterStatus = "pending" | "ready";

export interface Subject {
  id: string;
  nama: string;
  warna?: string | null;
  createdAt: string;
  _count?: { materials: number };
}

export interface Chapter {
  id: string;
  materialId: string;
  urutan: number;
  judul: string;
  status: ChapterStatus;
  kontenMd: string | null;
  isPro: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface MaterialSummary {
  id: string;
  judul: string;
  tipe: MaterialType;
  status: string;
  sourceUrl: string | null;
  subjectId: string | null;
  subject: { id: string; nama: string } | null;
  createdAt: string;
  _count: { chapters: number };
}

export interface MaterialFile {
  id: string;
  name: string;
  size: number;
  mime: string;
  createdAt: string;
}

export interface Material {
  id: string;
  judul: string;
  tipe: MaterialType;
  status: string;
  sourceUrl: string | null;
  rawText: string | null;
  subjectId: string | null;
  subject: { id: string; nama: string } | null;
  modeBelajar: string;
  gayaPenulisan: string;
  bahasa: string;
  sharePublic: boolean;
  shareSlug: string | null;
  createdAt: string;
  updatedAt: string;
  chapters: Chapter[];
  files: MaterialFile[];
}

// ── Fitur AI turunan ────────────────────────────────────────
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

export type QuizType = "pilihan_ganda" | "benar_salah" | "isian";
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

export interface PublicMaterial {
  judul: string;
  subject: { nama: string } | null;
  createdAt: string;
  chapters: { urutan: number; judul: string; kontenMd: string | null }[];
}

/** Profil user dari API (`GET /me`), sumber identitas asli di UI. */
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

export interface UserStats {
  materials: number;
  flashcards: number;
  quizzes: number;
  predictions: number;
  subjects: number;
  files: number;
}

// ── Prediksi Soal Ujian ─────────────────────────────────────
export type ExamType = "uts" | "uas" | "kuis" | "latihan";
export type Tingkat = "mudah" | "sedang" | "sulit";

export interface PredictedQuestion {
  pertanyaan: string;
  tingkat: Tingkat;
  topik: string;
  opsi?: string[];
  jawaban?: string;
  pembahasan?: string;
}

export interface PredictionFile {
  name: string;
  path: string | null;
  size: number;
  mime: string;
}

export interface ExamPrediction {
  id: string;
  judul: string;
  tipe: ExamType;
  subjectId: string | null;
  mapel: string | null;
  fileCount: number;
  sourceFiles: PredictionFile[];
  questions: PredictedQuestion[];
  createdAt: string;
}

export interface CreateMaterialInput {
  judul: string;
  tipe: MaterialType;
  subjectId?: string;
  sourceUrl?: string;
  rawText?: string;
  modeBelajar?: string;
  gayaPenulisan?: string;
  bahasa?: string;
}
