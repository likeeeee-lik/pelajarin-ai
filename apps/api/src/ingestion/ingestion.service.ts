import { Injectable, Logger } from "@nestjs/common";
import { TranscriptionProvider } from "./transcription-provider";

export interface UploadedFile {
  buffer: Buffer;
  originalname: string;
  mimetype: string;
}

/**
 * Ekstraksi teks dari sumber materi:
 * - Dokumen (PDF/DOCX/TXT/MD/CSV): parsing lokal, tanpa API key.
 * - YouTube: transkrip caption (tanpa key).
 * - Audio/Video: transkripsi via TranscriptionProvider (Groq/mock).
 */
@Injectable()
export class IngestionService {
  private readonly logger = new Logger(IngestionService.name);

  constructor(private readonly transcription: TranscriptionProvider) {}

  async extractFromUpload(file: UploadedFile, tipe: string): Promise<string> {
    if (tipe === "audio" || tipe === "video") {
      try {
        return await this.transcription.transcribe(file.buffer, file.originalname, file.mimetype);
      } catch (e) {
        this.logger.warn(`Transkripsi gagal: ${(e as Error).message}`);
        return "";
      }
    }
    return this.parseDocument(file.buffer, file.originalname);
  }

  private async parseDocument(buffer: Buffer, filename: string): Promise<string> {
    const ext = (filename.split(".").pop() ?? "").toLowerCase();
    try {
      if (ext === "pdf") {
        const mod = (await import("pdf-parse")) as unknown as {
          default: (b: Buffer) => Promise<{ text: string }>;
        };
        const res = await mod.default(buffer);
        return (res.text ?? "").trim();
      }
      if (ext === "docx") {
        const mammoth = (await import("mammoth")) as unknown as {
          default?: { extractRawText: (o: { buffer: Buffer }) => Promise<{ value: string }> };
          extractRawText?: (o: { buffer: Buffer }) => Promise<{ value: string }>;
        };
        const extract = mammoth.default?.extractRawText ?? mammoth.extractRawText!;
        const res = await extract({ buffer });
        return (res.value ?? "").trim();
      }
      if (["txt", "md", "markdown", "csv", "json"].includes(ext)) {
        return buffer.toString("utf8").trim();
      }
    } catch (e) {
      this.logger.warn(`Gagal parse ${ext}: ${(e as Error).message}`);
      return "";
    }
    this.logger.warn(`Format .${ext} belum didukung parser`);
    return "";
  }

  async extractFromYoutube(url: string): Promise<string> {
    try {
      const { YoutubeTranscript } = (await import("youtube-transcript")) as unknown as {
        YoutubeTranscript: { fetchTranscript: (u: string) => Promise<{ text: string }[]> };
      };
      const items = await YoutubeTranscript.fetchTranscript(url);
      return items.map((i) => i.text).join(" ").trim();
    } catch (e) {
      this.logger.warn(`Transkrip YouTube gagal: ${(e as Error).message}`);
      return "";
    }
  }
}
