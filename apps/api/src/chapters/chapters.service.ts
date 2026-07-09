import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { AiProvider } from "../ai/ai-provider";
import type { GenConfig } from "../ai/ai.types";
import type { AuthUser } from "../auth/jwt.types";

@Injectable()
export class ChaptersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly ai: AiProvider,
  ) {}

  private async loadOwned(user: AuthUser, chapterId: string) {
    const chapter = await this.prisma.chapter.findUnique({
      where: { id: chapterId },
      include: { material: true },
    });
    if (!chapter) throw new NotFoundException("Bab tidak ditemukan");
    if (chapter.material.userId !== user.sub) throw new ForbiddenException();
    return chapter;
  }

  private async assertMaterialOwned(user: AuthUser, materialId: string) {
    const material = await this.prisma.material.findFirst({ where: { id: materialId, userId: user.sub } });
    if (!material) throw new NotFoundException("Materi tidak ditemukan");
    return material;
  }

  async add(user: AuthUser, materialId: string, judul: string) {
    await this.assertMaterialOwned(user, materialId);
    const count = await this.prisma.chapter.count({ where: { materialId } });
    return this.prisma.chapter.create({
      data: {
        materialId,
        urutan: count + 1,
        judul: judul.trim() || `Bab ${count + 1}`,
        status: "ready", // bab manual langsung bisa diedit
        kontenMd: "",
        isPro: false,
      },
    });
  }

  /** Generate isi bab via AI sesuai konfigurasi materi. */
  async generate(user: AuthUser, chapterId: string) {
    const chapter = await this.loadOwned(user, chapterId);
    const m = chapter.material;
    const config: GenConfig = {
      modeBelajar: m.modeBelajar as GenConfig["modeBelajar"],
      gayaPenulisan: m.gayaPenulisan as GenConfig["gayaPenulisan"],
      bahasa: m.bahasa,
    };
    const res = await this.ai.generateChapter({
      judul: m.judul,
      chapterTitle: chapter.judul,
      context: m.rawText || m.judul,
      config,
    });
    return this.prisma.chapter.update({
      where: { id: chapterId },
      data: { kontenMd: res.kontenMd, status: "ready" },
    });
  }

  /** Autosave editor. */
  async update(user: AuthUser, chapterId: string, kontenMd: string) {
    await this.loadOwned(user, chapterId);
    return this.prisma.chapter.update({
      where: { id: chapterId },
      data: { kontenMd, status: "ready" },
    });
  }

  async remove(user: AuthUser, chapterId: string) {
    await this.loadOwned(user, chapterId);
    await this.prisma.chapter.delete({ where: { id: chapterId } });
    return { ok: true };
  }
}
