import { BadRequestException, Injectable, Logger, NotFoundException } from "@nestjs/common";
import { Prisma, type ExamType } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";
import { AiProvider } from "../ai/ai-provider";
import type { PredictedQuestion, Tingkat } from "../ai/ai.types";
import { IngestionService } from "../ingestion/ingestion.service";
import { StorageProvider } from "../storage/storage-provider";
import type { AuthUser } from "../auth/jwt.types";

export interface CreatePredictionDto {
  judul: string;
  tipe: ExamType; // uts | uas | kuis | latihan
  subjectId?: string;
  sourceText?: string;
}

interface SourceFileMeta {
  name: string;
  path: string | null;
  size: number;
  mime: string;
}

/** Bentuk respons prediksi yang dikonsumsi web (rapi, siap render). */
export interface PredictionView {
  id: string;
  judul: string;
  tipe: ExamType;
  subjectId: string | null;
  mapel: string | null;
  fileCount: number;
  sourceFiles: SourceFileMeta[];
  questions: PredictedQuestion[];
  createdAt: Date;
}

@Injectable()
export class PredictionsService {
  private readonly logger = new Logger(PredictionsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly ai: AiProvider,
    private readonly ingestion: IngestionService,
    private readonly storage: StorageProvider,
  ) {}

  private async ensureUser(user: AuthUser) {
    await this.prisma.profile.upsert({
      where: { id: user.sub },
      update: {},
      create: {
        id: user.sub,
        email: user.email ?? `${user.sub}@pelajarin.local`,
        nama: user.name ?? "Pengguna",
      },
    });
  }

  async list(user: AuthUser): Promise<PredictionView[]> {
    const preds = await this.prisma.examPrediction.findMany({
      where: { userId: user.sub },
      orderBy: { createdAt: "desc" },
    });
    const ids = [...new Set(preds.map((p) => p.subjectId).filter((x): x is string => !!x))];
    const subs = ids.length
      ? await this.prisma.subject.findMany({ where: { id: { in: ids } }, select: { id: true, nama: true } })
      : [];
    const nameById = new Map(subs.map((s) => [s.id, s.nama]));
    return preds.map((p) => this.toView(p, p.subjectId ? nameById.get(p.subjectId) ?? null : null));
  }

  async get(user: AuthUser, id: string): Promise<PredictionView> {
    const pred = await this.prisma.examPrediction.findFirst({ where: { id, userId: user.sub } });
    if (!pred) throw new NotFoundException("Prediksi tidak ditemukan");
    let mapel: string | null = null;
    if (pred.subjectId) {
      const s = await this.prisma.subject.findFirst({ where: { id: pred.subjectId }, select: { nama: true } });
      mapel = s?.nama ?? null;
    }
    return this.toView(pred, mapel);
  }

  /** Prediksi berbasis teks langsung (tanpa unggahan file). */
  async create(user: AuthUser, dto: CreatePredictionDto): Promise<PredictionView> {
    await this.ensureUser(user);
    return this.persist(user, {
      judul: dto.judul,
      tipe: dto.tipe,
      subjectId: dto.subjectId,
      sourceText: dto.sourceText || dto.judul,
      sourceFiles: [],
    });
  }

  /** Prediksi dari unggahan soal: parse tiap file → simpan ke Storage → analisis AI. */
  async createFromUpload(
    user: AuthUser,
    files: Array<Express.Multer.File>,
    dto: CreatePredictionDto,
  ): Promise<PredictionView> {
    await this.ensureUser(user);

    const parts: string[] = [];
    const meta: SourceFileMeta[] = [];
    for (const f of files) {
      let text = "";
      try {
        text = await this.ingestion.extractFromUpload(
          { buffer: f.buffer, originalname: f.originalname, mimetype: f.mimetype },
          "file",
        );
      } catch (e) {
        this.logger.warn(`Parse ${f.originalname} gagal: ${(e as Error).message}`);
      }
      if (text) parts.push(`# ${f.originalname}\n${text}`);

      let path: string | null = null;
      if (this.storage.enabled) {
        const safe = f.originalname.replace(/[^\w.\-]+/g, "_");
        const p = `${user.sub}/predictions/${Date.now()}_${safe}`;
        try {
          await this.storage.upload(p, f.buffer, f.mimetype);
          path = p;
        } catch (e) {
          this.logger.warn(`Upload storage gagal: ${(e as Error).message}`);
        }
      }
      meta.push({ name: f.originalname, path, size: f.size, mime: f.mimetype });
    }

    // Jangan pernah diam-diam memakai judul sebagai sumber: AI akan memprediksi
    // soal tentang judulnya, bukan tentang soal yang diunggah — dan hasilnya
    // terlihat meyakinkan padahal salah. Lebih baik gagal terang-terangan.
    const sourceText = parts.join("\n\n");
    if (files.length > 0 && !sourceText.trim()) {
      const nama = files.map((f) => f.originalname).join(", ");
      throw new BadRequestException(
        `Tidak ada teks yang bisa dibaca dari ${nama}. ` +
          `Pastikan file berupa PDF/DOCX/TXT, atau foto soal yang jelas (PNG/JPG).`,
      );
    }

    return this.persist(user, {
      judul: dto.judul,
      tipe: dto.tipe,
      subjectId: dto.subjectId,
      sourceText: sourceText || dto.judul, // hanya bila memang tak ada file
      sourceFiles: meta,
    });
  }

  private async persist(
    user: AuthUser,
    p: { judul: string; tipe: ExamType; subjectId?: string; sourceText: string; sourceFiles: SourceFileMeta[] },
  ): Promise<PredictionView> {
    const res = await this.ai.predictExam({ judul: p.judul, tipe: p.tipe, sourceText: p.sourceText });
    const questions = this.normalizeQuestions(res.questions);
    const pred = await this.prisma.examPrediction.create({
      data: {
        userId: user.sub,
        subjectId: p.subjectId || null,
        judul: p.judul.trim() || "Prediksi Soal",
        tipe: p.tipe,
        sourceFiles: p.sourceFiles as unknown as Prisma.InputJsonValue,
        prediksiJson: { questions } as unknown as Prisma.InputJsonValue,
      },
    });
    let mapel: string | null = null;
    if (pred.subjectId) {
      const s = await this.prisma.subject.findFirst({ where: { id: pred.subjectId }, select: { nama: true } });
      mapel = s?.nama ?? null;
    }
    return this.toView(pred, mapel);
  }

  /** Bersihkan output AI apa pun agar aman dirender (guard provider nyata). */
  private normalizeQuestions(raw: unknown): PredictedQuestion[] {
    if (!Array.isArray(raw)) return [];
    const valid: Tingkat[] = ["mudah", "sedang", "sulit"];
    return raw
      .slice(0, 12)
      .map((q): PredictedQuestion => {
        const item = (q ?? {}) as Record<string, unknown>;
        const opsi = Array.isArray(item.opsi) ? item.opsi.map((o) => String(o)).filter((o) => o.trim()).slice(0, 6) : undefined;
        return {
          pertanyaan: String(item.pertanyaan ?? "").trim(),
          tingkat: valid.includes(item.tingkat as Tingkat) ? (item.tingkat as Tingkat) : "sedang",
          topik: String(item.topik ?? "Umum").trim() || "Umum",
          opsi: opsi && opsi.length ? opsi : undefined,
          jawaban: item.jawaban != null ? String(item.jawaban) : undefined,
          pembahasan: item.pembahasan != null ? String(item.pembahasan) : undefined,
        };
      })
      .filter((q) => q.pertanyaan.length > 0);
  }

  private toView(
    pred: { id: string; judul: string; tipe: ExamType; subjectId: string | null; sourceFiles: unknown; prediksiJson: unknown; createdAt: Date },
    mapel: string | null,
  ): PredictionView {
    const sourceFiles = (Array.isArray(pred.sourceFiles) ? pred.sourceFiles : []) as SourceFileMeta[];
    const pj = (pred.prediksiJson ?? {}) as { questions?: PredictedQuestion[] };
    return {
      id: pred.id,
      judul: pred.judul,
      tipe: pred.tipe,
      subjectId: pred.subjectId,
      mapel,
      fileCount: sourceFiles.length,
      sourceFiles,
      questions: pj.questions ?? [],
      createdAt: pred.createdAt,
    };
  }
}
