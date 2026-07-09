/** Tipe bersama untuk lapisan AI (provider-agnostic). */

export type ModeBelajar = "kilat" | "standar" | "lengkap";
export type GayaPenulisan = "formal" | "santai" | "kreatif" | "akademis";
export type QuizType = "pilihan_ganda" | "benar_salah" | "isian";
export type Tingkat = "mudah" | "sedang" | "sulit";

export interface GenConfig {
  modeBelajar: ModeBelajar;
  gayaPenulisan: GayaPenulisan;
  bahasa: string; // id | en | ar | zh
}

export interface OutlineInput {
  judul: string;
  rawText: string;
  config: GenConfig;
}
export interface OutlineResult {
  chapters: { judul: string }[];
}

export interface ChapterInput {
  judul: string;
  chapterTitle: string;
  context: string;
  config: GenConfig;
}
export interface ChapterResult {
  kontenMd: string;
}

export interface MindmapNode {
  label: string;
  children?: MindmapNode[];
}
export interface MindmapInput {
  judul: string;
  chapters: string[];
  context: string;
}
export interface MindmapResult {
  root: MindmapNode;
}

export interface FlashcardsInput {
  judul: string;
  context: string;
  count: number;
}
export interface FlashcardsResult {
  cards: { front: string; back: string }[];
}

export interface QuizInput {
  judul: string;
  context: string;
  count: number;
  types: QuizType[];
}
export interface QuizQuestion {
  pertanyaan: string;
  tipe: QuizType;
  opsi?: string[];
  jawaban: string;
  pembahasan?: string;
}
export interface QuizResult {
  questions: QuizQuestion[];
}

export interface ChatTurn {
  role: "user" | "assistant";
  konten: string;
}
export interface ChatInput {
  question: string;
  context: string;
  history: ChatTurn[];
}
export interface ChatResult {
  reply: string;
}

export interface PredictedQuestion {
  pertanyaan: string;
  tingkat: Tingkat;
  topik: string;
  opsi?: string[];
  jawaban?: string;
}
export interface PredictExamInput {
  judul: string;
  tipe: string; // uts | uas | kuis | latihan
  sourceText: string;
}
export interface PredictExamResult {
  questions: PredictedQuestion[];
}
