import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { AiProvider } from "../ai/ai-provider";
import { MaterialsService } from "../materials/materials.service";
import type { AuthUser } from "../auth/jwt.types";

@Injectable()
export class FlashcardsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly ai: AiProvider,
    private readonly materials: MaterialsService,
  ) {}

  async list(user: AuthUser, materialId: string) {
    await this.materials.get(user, materialId);
    return this.prisma.flashcard.findMany({
      where: { materialId },
      orderBy: { id: "asc" },
    });
  }

  /** Generate ulang set flashcard dari bab terpilih (default: semua). */
  async generate(user: AuthUser, materialId: string, count: number, chapterIds?: string[]) {
    const { judul, context } = await this.materials.getContext(user, materialId, chapterIds);
    const res = await this.ai.generateFlashcards({ judul, context, count });

    await this.prisma.flashcard.deleteMany({ where: { materialId } });
    await this.prisma.flashcard.createMany({
      data: res.cards.map((c) => ({
        materialId,
        userId: user.sub,
        front: c.front,
        back: c.back,
      })),
    });
    return this.list(user, materialId);
  }
}
