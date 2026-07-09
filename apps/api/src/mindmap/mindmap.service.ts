import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";
import { AiProvider } from "../ai/ai-provider";
import { MaterialsService } from "../materials/materials.service";
import type { AuthUser } from "../auth/jwt.types";

@Injectable()
export class MindmapService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly ai: AiProvider,
    private readonly materials: MaterialsService,
  ) {}

  async get(user: AuthUser, materialId: string) {
    await this.materials.get(user, materialId); // pastikan milik user
    return this.prisma.mindMap.findUnique({ where: { materialId } });
  }

  async generate(user: AuthUser, materialId: string) {
    const { judul, context, chapterTitles } = await this.materials.getContext(user, materialId);
    const res = await this.ai.generateMindmap({ judul, chapters: chapterTitles, context });
    const dataJson = res.root as unknown as Prisma.InputJsonValue;
    return this.prisma.mindMap.upsert({
      where: { materialId },
      update: { dataJson },
      create: { materialId, dataJson },
    });
  }
}
