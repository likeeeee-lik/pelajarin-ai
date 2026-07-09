import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { AiProvider } from "../ai/ai-provider";
import type { GenConfig } from "../ai/ai.types";
import type { AuthUser } from "../auth/jwt.types";
import { IngestionService, type UploadedFile } from "../ingestion/ingestion.service";
import { StorageProvider } from "../storage/storage-provider";
import type { CreateMaterialDto } from "./materials.dto";

@Injectable()
export class MaterialsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly ai: AiProvider,
    private readonly ingestion: IngestionService,
    private readonly storage: StorageProvider,
  ) {}

  /** Pastikan profil user ada (FK) — dev/stub bisa memanggil sebelum /me. */
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

  private configOf(dto: CreateMaterialDto): GenConfig {
    return {
      modeBelajar: (dto.modeBelajar as GenConfig["modeBelajar"]) ?? "standar",
      gayaPenulisan: (dto.gayaPenulisan as GenConfig["gayaPenulisan"]) ?? "santai",
      bahasa: dto.bahasa ?? "id",
    };
  }

  /** Buat materi + (untuk sumber non-manual) susun bab via AI, lalu status ready. */
  /** Buat materi dari unggahan file (parse/transkrip → rawText) + simpan file. */
  async createFromUpload(
    user: AuthUser,
    file: (UploadedFile & { size: number }) | undefined,
    dto: CreateMaterialDto,
  ) {
    const rawText = file ? await this.ingestion.extractFromUpload(file, dto.tipe) : "";
    const material = await this.create(user, { ...dto, rawText: rawText || dto.rawText });

    if (file && this.storage.enabled) {
      const safe = file.originalname.replace(/[^\w.\-]+/g, "_");
      const path = `${user.sub}/${material.id}/${Date.now()}_${safe}`;
      try {
        await this.storage.upload(path, file.buffer, file.mimetype);
        await this.prisma.materialFile.create({
          data: { materialId: material.id, name: file.originalname, path, size: file.size, mime: file.mimetype },
        });
        return this.get(user, material.id);
      } catch (e) {
        // penyimpanan gagal tidak membatalkan materi (rawText sudah terekstrak)
        new Logger("MaterialsService").warn(`Upload storage gagal: ${(e as Error).message}`);
        return material;
      }
    }
    return material;
  }

  /** Signed URL untuk unduh/pratinjau file (download/preview). */
  async fileUrl(user: AuthUser, materialId: string, fileId: string) {
    await this.get(user, materialId); // pastikan milik user
    const file = await this.prisma.materialFile.findFirst({ where: { id: fileId, materialId } });
    if (!file) throw new NotFoundException("File tidak ditemukan");
    const url = await this.storage.signedUrl(file.path);
    return { url, name: file.name, mime: file.mime };
  }

  async create(user: AuthUser, dto: CreateMaterialDto) {
    await this.ensureUser(user);
    const config = this.configOf(dto);

    // Ingestion untuk YouTube (transkrip caption).
    let rawText = dto.rawText || null;
    if (dto.tipe === "youtube" && dto.sourceUrl && !rawText) {
      rawText = (await this.ingestion.extractFromYoutube(dto.sourceUrl)) || null;
    }

    const material = await this.prisma.material.create({
      data: {
        userId: user.sub,
        judul: dto.judul.trim() || "Catatan Baru",
        tipe: dto.tipe,
        subjectId: dto.subjectId || null,
        sourceUrl: dto.sourceUrl || null,
        rawText,
        modeBelajar: config.modeBelajar,
        gayaPenulisan: config.gayaPenulisan,
        bahasa: config.bahasa,
        status: "processing",
      },
    });

    // "Tulis Catatan" (manual) mulai tanpa bab; sumber lain disusun AI.
    if (dto.tipe !== "note") {
      const outline = await this.ai.generateOutline({
        judul: material.judul,
        rawText: rawText || material.judul,
        config,
      });
      await this.prisma.chapter.createMany({
        data: outline.chapters.map((c, i) => ({
          materialId: material.id,
          urutan: i + 1,
          judul: c.judul,
          isPro: i > 0, // bab pertama gratis, sisanya Pro
          status: "pending" as const,
        })),
      });
    }

    await this.prisma.material.update({ where: { id: material.id }, data: { status: "ready" } });
    return this.get(user, material.id);
  }

  async list(user: AuthUser) {
    return this.prisma.material.findMany({
      where: { userId: user.sub },
      orderBy: { createdAt: "desc" },
      include: {
        subject: { select: { id: true, nama: true } },
        _count: { select: { chapters: true } },
      },
    });
  }

  async get(user: AuthUser, id: string) {
    const material = await this.prisma.material.findFirst({
      where: { id, userId: user.sub },
      include: {
        subject: { select: { id: true, nama: true } },
        chapters: { orderBy: { urutan: "asc" } },
        files: {
          orderBy: { createdAt: "asc" },
          select: { id: true, name: true, size: true, mime: true, createdAt: true },
        },
      },
    });
    if (!material) throw new NotFoundException("Materi tidak ditemukan");
    return material;
  }

  async remove(user: AuthUser, id: string) {
    await this.get(user, id); // pastikan milik user
    await this.prisma.material.delete({ where: { id } });
    return { ok: true };
  }

  /**
   * Konteks teks untuk fitur AI (mindmap/flashcards/quiz/chat).
   * Gabungkan isi bab terpilih; fallback ke rawText/judul.
   */
  async getContext(user: AuthUser, materialId: string, chapterIds?: string[]) {
    const material = await this.get(user, materialId);
    const selected =
      chapterIds && chapterIds.length
        ? material.chapters.filter((c) => chapterIds.includes(c.id))
        : material.chapters;
    const withContent = selected.filter((c) => c.kontenMd && c.kontenMd.trim().length > 0);
    const context = withContent.length
      ? withContent.map((c) => `## ${c.judul}\n${c.kontenMd}`).join("\n\n")
      : material.rawText || material.judul;
    return {
      material,
      judul: material.judul,
      context,
      chapterTitles: material.chapters.map((c) => c.judul),
    };
  }
}
