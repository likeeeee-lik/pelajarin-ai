import { Injectable, Logger } from "@nestjs/common";
import { AiProvider } from "../ai/ai-provider";
import { TranscriptionProvider } from "./transcription-provider";

export interface UploadedFile {
  buffer: Buffer;
  originalname: string;
  mimetype: string;
}

/** Gambar yang bisa dibaca AI (penglihatan Claude). */
const IMAGE_MIME = ["image/png", "image/jpeg", "image/gif", "image/webp"];
/** Batas aman unggahan gambar ke API AI. */
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

/**
 * Ekstraksi teks dari sumber materi:
 * - Dokumen (PDF/DOCX/TXT/MD/CSV): parsing lokal, tanpa API key.
 * - Gambar (PNG/JPG/GIF/WEBP): dibaca AI (penglihatan). Kosong bila AI mock.
 * - YouTube: transkrip caption (tanpa key).
 * - Audio/Video: transkripsi via TranscriptionProvider (Groq/mock).
 */
@Injectable()
export class IngestionService {
  private readonly logger = new Logger(IngestionService.name);

  constructor(
    private readonly transcription: TranscriptionProvider,
    private readonly ai: AiProvider,
  ) {}

  async extractFromUpload(file: UploadedFile, tipe: string): Promise<string> {
    if (tipe === "audio" || tipe === "video") {
      try {
        return await this.transcription.transcribe(file.buffer, file.originalname, file.mimetype);
      } catch (e) {
        this.logger.warn(`Transkripsi gagal: ${(e as Error).message}`);
        return "";
      }
    }

    if (IMAGE_MIME.includes(file.mimetype.toLowerCase())) {
      return this.readImage(file);
    }

    return this.parseDocument(file.buffer, file.originalname);
  }

  /** Foto/scan soal → teks, lewat penglihatan AI. */
  private async readImage(file: UploadedFile): Promise<string> {
    if (file.buffer.byteLength > MAX_IMAGE_BYTES) {
      this.logger.warn(`Gambar ${file.originalname} terlalu besar (${file.buffer.byteLength} B)`);
      return "";
    }
    try {
      const teks = await this.ai.readImage({
        base64: file.buffer.toString("base64"),
        mime: file.mimetype.toLowerCase(),
        namaBerkas: file.originalname,
      });
      if (!teks) this.logger.warn(`Tidak ada teks terbaca dari gambar ${file.originalname}`);
      return teks;
    } catch (e) {
      this.logger.warn(`Gagal membaca gambar ${file.originalname}: ${(e as Error).message}`);
      return "";
    }
  }

  private async parseDocument(buffer: Buffer, filename: string): Promise<string> {
    const ext = (filename.split(".").pop() ?? "").toLowerCase();
    try {
      if (ext === "pdf") {
        // pdf-parse v2: kelas PDFParse + getText(). (v1 dulu mengekspor fungsi default.)
        const { PDFParse } = (await import("pdf-parse")) as unknown as {
          PDFParse: new (opts: { data: Uint8Array }) => {
            getText(): Promise<{ text: string }>;
            destroy(): Promise<void>;
          };
        };
        const parser = new PDFParse({ data: new Uint8Array(buffer) });
        try {
          const res = await parser.getText();
          return (res.text ?? "").trim();
        } finally {
          await parser.destroy().catch(() => undefined);
        }
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
