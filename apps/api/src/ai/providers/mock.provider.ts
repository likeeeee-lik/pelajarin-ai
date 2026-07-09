import { Injectable } from "@nestjs/common";
import { AiProvider } from "../ai-provider";
import type {
  ChapterInput,
  ChapterResult,
  ChatInput,
  ChatResult,
  FlashcardsInput,
  FlashcardsResult,
  MindmapInput,
  MindmapResult,
  OutlineInput,
  OutlineResult,
  PredictExamInput,
  PredictExamResult,
  QuizInput,
  QuizResult,
  QuizType,
} from "../ai.types";

/**
 * Provider tiruan: mengembalikan konten contoh terstruktur agar seluruh fitur
 * berjalan end-to-end tanpa API key. Ganti ke ClaudeProvider (AI_PROVIDER=claude)
 * saat siap — tanpa mengubah kode fitur.
 */
@Injectable()
export class MockAiProvider extends AiProvider {
  async generateOutline(input: OutlineInput): Promise<OutlineResult> {
    const t = input.judul.trim() || "Materi";
    return {
      chapters: [
        { judul: `Pengenalan ${t}` },
        { judul: `Konsep Dasar ${t}` },
        { judul: `Komponen Utama` },
        { judul: `Penerapan & Contoh` },
        { judul: `Studi Kasus` },
        { judul: `Kesimpulan Materi` },
      ],
    };
  }

  async generateChapter(input: ChapterInput): Promise<ChapterResult> {
    const depth = input.config.modeBelajar === "lengkap" ? 3 : input.config.modeBelajar === "kilat" ? 1 : 2;
    const poin = Array.from({ length: depth + 1 }, (_, i) => `- Poin penting ${i + 1} tentang **${input.chapterTitle}**.`).join("\n");
    return {
      kontenMd: [
        `# ${input.chapterTitle}`,
        ``,
        `Ringkasan bab ini dari materi *${input.judul}* (mode: ${input.config.modeBelajar}, gaya: ${input.config.gayaPenulisan}).`,
        ``,
        `## Poin Utama`,
        poin,
        ``,
        `## Penjelasan`,
        `Bagian ini menjelaskan konsep inti secara ${input.config.gayaPenulisan}. (Konten contoh — akan digantikan hasil AI asli saat AI_PROVIDER=claude.)`,
        ``,
        `> Catatan: Tinjau kembali poin di atas sebelum lanjut ke bab berikutnya.`,
      ].join("\n"),
    };
  }

  async generateMindmap(input: MindmapInput): Promise<MindmapResult> {
    return {
      root: {
        label: input.judul || "Materi",
        children: (input.chapters.length ? input.chapters : ["Bagian 1", "Bagian 2", "Bagian 3"]).map((c) => ({
          label: c,
          children: [{ label: `${c} — inti` }, { label: `${c} — contoh` }],
        })),
      },
    };
  }

  async generateFlashcards(input: FlashcardsInput): Promise<FlashcardsResult> {
    return {
      cards: Array.from({ length: input.count }, (_, i) => ({
        front: `Pertanyaan ${i + 1} dari "${input.judul}"?`,
        back: `Jawaban ringkas ${i + 1}. (contoh)`,
      })),
    };
  }

  async generateQuiz(input: QuizInput): Promise<QuizResult> {
    const types: QuizType[] = input.types.length ? input.types : ["pilihan_ganda"];
    return {
      questions: Array.from({ length: input.count }, (_, i) => {
        const tipe = types[i % types.length] as QuizType;
        if (tipe === "benar_salah") {
          return { pertanyaan: `Pernyataan ${i + 1} tentang ${input.judul} benar.`, tipe, opsi: ["Benar", "Salah"], jawaban: "Benar", pembahasan: "Contoh pembahasan." };
        }
        if (tipe === "isian") {
          return { pertanyaan: `Lengkapi: konsep utama ${input.judul} adalah ___.`, tipe, jawaban: "konsep contoh", pembahasan: "Contoh pembahasan." };
        }
        return {
          pertanyaan: `Soal ${i + 1}: manakah yang benar tentang ${input.judul}?`,
          tipe,
          opsi: ["Opsi A", "Opsi B (benar)", "Opsi C", "Opsi D"],
          jawaban: "Opsi B (benar)",
          pembahasan: "Contoh pembahasan.",
        };
      }),
    };
  }

  async chat(input: ChatInput): Promise<ChatResult> {
    return {
      reply: `Berdasarkan catatan ini, berikut jawaban singkat untuk "${input.question}":\n\n- Poin 1\n- Poin 2\n\n(Jawaban contoh — aktifkan AI asli dengan AI_PROVIDER=claude.)`,
    };
  }

  async predictExam(input: PredictExamInput): Promise<PredictExamResult> {
    return {
      questions: [
        { pertanyaan: `Prediksi soal ${input.tipe} #1 untuk ${input.judul}`, tingkat: "mudah", topik: "Topik A", opsi: ["A", "B", "C", "D"], jawaban: "A" },
        { pertanyaan: `Prediksi soal ${input.tipe} #2`, tingkat: "sedang", topik: "Topik B", opsi: ["A", "B", "C", "D"], jawaban: "C" },
        { pertanyaan: `Prediksi soal ${input.tipe} #3`, tingkat: "sulit", topik: "Topik C" },
      ],
    };
  }
}
