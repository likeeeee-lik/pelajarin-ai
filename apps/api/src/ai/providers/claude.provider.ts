import { Injectable, Logger } from "@nestjs/common";
import Anthropic from "@anthropic-ai/sdk";
import { AiProvider } from "../ai-provider";
import type {
  ChapterInput,
  ChapterResult,
  ChatInput,
  ChatResult,
  FlashcardsInput,
  FlashcardsResult,
  GenConfig,
  MindmapInput,
  MindmapResult,
  OutlineInput,
  OutlineResult,
  PredictExamInput,
  PredictExamResult,
  QuizInput,
  QuizResult,
} from "../ai.types";

const BAHASA: Record<string, string> = {
  id: "Bahasa Indonesia",
  en: "English",
  ar: "Arabic",
  zh: "Mandarin Chinese",
};
const GAYA: Record<string, string> = {
  formal: "serius & formal",
  santai: "ramah & santai",
  kreatif: "menyenangkan & kreatif",
  akademis: "akademis & ilmiah",
};

/**
 * Provider AI asli berbasis Anthropic Claude. Dipilih saat AI_PROVIDER=claude
 * dan ANTHROPIC_API_KEY tersedia. Prompt disusun dari konfigurasi generasi
 * (mode belajar, gaya penulisan, bahasa).
 */
@Injectable()
export class ClaudeAiProvider extends AiProvider {
  private readonly logger = new Logger(ClaudeAiProvider.name);
  private readonly client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY ?? "" });
  private readonly model = process.env.ANTHROPIC_MODEL ?? "claude-sonnet-5";
  // Prediksi ujian pakai model lebih kuat (default Opus); bisa dioverride/di-hemat
  // lewat ANTHROPIC_MODEL_PREDICT.
  private readonly predictModel = process.env.ANTHROPIC_MODEL_PREDICT ?? "claude-opus-4-8";

  private styleLine(c: GenConfig): string {
    return `Tulis dalam ${BAHASA[c.bahasa] ?? "Bahasa Indonesia"}, gaya ${GAYA[c.gayaPenulisan] ?? "ramah & santai"}, kedalaman "${c.modeBelajar}".`;
  }

  private async text(system: string, user: string, model = this.model): Promise<string> {
    const msg = await this.client.messages.create({
      model,
      max_tokens: 4096,
      system,
      messages: [{ role: "user", content: user }],
    });
    return msg.content.map((b) => (b.type === "text" ? b.text : "")).join("").trim();
  }

  /** Ekstrak objek JSON dari balasan model (buang fence / prosa pembungkus). */
  private extractJson(raw: string): string {
    let s = raw.trim();
    const fence = s.match(/```(?:json)?\s*([\s\S]*?)```/i);
    if (fence) s = fence[1].trim();
    const start = s.indexOf("{");
    const end = s.lastIndexOf("}");
    if (start >= 0 && end > start) s = s.slice(start, end + 1);
    return s;
  }

  private async json<T>(system: string, user: string, model = this.model): Promise<T> {
    const raw = await this.text(
      `${system}\nBalas HANYA JSON valid tanpa penjelasan, tanpa markdown fence.`,
      user,
      model,
    );
    try {
      return JSON.parse(this.extractJson(raw)) as T;
    } catch (e) {
      this.logger.error(`Gagal parse JSON dari AI: ${(e as Error).message}. Cuplikan: ${raw.slice(0, 200)}`);
      throw e;
    }
  }

  generateOutline(input: OutlineInput): Promise<OutlineResult> {
    return this.json(
      `Kamu penyusun kurikulum. ${this.styleLine(input.config)}`,
      `Dari materi berjudul "${input.judul}", susun daftar bab (chapter) yang runtut. ` +
        `Konten sumber:\n"""${input.rawText.slice(0, 8000)}"""\n` +
        `Format: {"chapters":[{"judul":"..."}]}`,
    );
  }

  generateChapter(input: ChapterInput): Promise<ChapterResult> {
    return this.json(
      `Kamu tutor ahli. ${this.styleLine(input.config)}`,
      `Tulis isi bab "${input.chapterTitle}" untuk materi "${input.judul}" dalam Markdown yang rapi (heading, poin, contoh). ` +
        `Konteks:\n"""${input.context.slice(0, 8000)}"""\n` +
        `Format: {"kontenMd":"..."}`,
    );
  }

  generateMindmap(input: MindmapInput): Promise<MindmapResult> {
    return this.json(
      `Kamu ahli pemetaan konsep.`,
      `Buat mind map berjenjang untuk "${input.judul}" dengan bab: ${input.chapters.join(", ")}. ` +
        `Format: {"root":{"label":"...","children":[{"label":"...","children":[{"label":"..."}]}]}}`,
    );
  }

  generateFlashcards(input: FlashcardsInput): Promise<FlashcardsResult> {
    return this.json(
      `Kamu pembuat flashcard.`,
      `Buat ${input.count} flashcard (front pertanyaan, back jawaban ringkas) dari materi "${input.judul}". ` +
        `Konteks:\n"""${input.context.slice(0, 8000)}"""\n` +
        `Format: {"cards":[{"front":"...","back":"..."}]}`,
    );
  }

  generateQuiz(input: QuizInput): Promise<QuizResult> {
    return this.json(
      `Kamu pembuat soal.`,
      `Buat ${input.count} soal tipe [${input.types.join(", ")}] dari materi "${input.judul}". ` +
        `Konteks:\n"""${input.context.slice(0, 8000)}"""\n` +
        `Format: {"questions":[{"pertanyaan":"...","tipe":"pilihan_ganda","opsi":["..."],"jawaban":"...","pembahasan":"..."}]}`,
    );
  }

  async chat(input: ChatInput): Promise<ChatResult> {
    const history = input.history.map((t) => `${t.role === "user" ? "User" : "AI"}: ${t.konten}`).join("\n");
    const reply = await this.text(
      `Kamu asisten belajar. Jawab berdasar konteks catatan. Jika di luar konteks, katakan dengan jujur.`,
      `Konteks catatan:\n"""${input.context.slice(0, 12000)}"""\n\nRiwayat:\n${history}\n\nPertanyaan: ${input.question}`,
    );
    return { reply };
  }

  predictExam(input: PredictExamInput): Promise<PredictExamResult> {
    return this.json(
      `Kamu penganalisis pola soal ujian yang berpengalaman.`,
      `Analisis pola soal ${input.tipe} berikut (topik yang sering muncul, tingkat kesulitan, bentuk soal) ` +
        `lalu buat 5 PREDIKSI soal pilihan ganda yang paling mungkin keluar berikutnya untuk "${input.judul}". ` +
        `Setiap soal wajib punya 4 opsi, satu jawaban benar (harus sama persis dengan salah satu opsi), dan pembahasan singkat. ` +
        `Soal sumber:\n"""${input.sourceText.slice(0, 8000)}"""\n` +
        `Format: {"questions":[{"pertanyaan":"...","tingkat":"mudah|sedang|sulit","topik":"...","opsi":["a","b","c","d"],"jawaban":"...","pembahasan":"..."}]}`,
      this.predictModel,
    );
  }
}
