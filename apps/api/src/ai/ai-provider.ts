import type {
  ChapterInput,
  ChapterResult,
  ChatInput,
  ChatResult,
  FlashcardsInput,
  FlashcardsResult,
  ImageInput,
  MindmapInput,
  MindmapResult,
  OutlineInput,
  OutlineResult,
  PredictExamInput,
  PredictExamResult,
  QuizInput,
  QuizResult,
} from "./ai.types";

/**
 * Kontrak penyedia AI. Semua fitur (materials, chapters, mindmap, flashcards,
 * quiz, chat, predictions) bergantung pada abstraksi ini — BUKAN pada Claude
 * langsung. Ganti provider (mock/claude/dll) tanpa menyentuh kode fitur.
 * Dipakai sebagai token DI Nest (abstract class).
 */
export abstract class AiProvider {
  abstract generateOutline(input: OutlineInput): Promise<OutlineResult>;
  abstract generateChapter(input: ChapterInput): Promise<ChapterResult>;
  abstract generateMindmap(input: MindmapInput): Promise<MindmapResult>;
  abstract generateFlashcards(input: FlashcardsInput): Promise<FlashcardsResult>;
  abstract generateQuiz(input: QuizInput): Promise<QuizResult>;
  abstract chat(input: ChatInput): Promise<ChatResult>;
  abstract predictExam(input: PredictExamInput): Promise<PredictExamResult>;
  /**
   * Baca seluruh teks dari gambar (foto/scan soal). Kembalikan string kosong
   * bila provider tak mendukung penglihatan.
   */
  abstract readImage(input: ImageInput): Promise<string>;
}
