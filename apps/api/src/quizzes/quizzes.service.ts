import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";
import { AiProvider } from "../ai/ai-provider";
import type { QuizType } from "../ai/ai.types";
import { MaterialsService } from "../materials/materials.service";
import type { AuthUser } from "../auth/jwt.types";

@Injectable()
export class QuizzesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly ai: AiProvider,
    private readonly materials: MaterialsService,
  ) {}

  async list(user: AuthUser, materialId: string) {
    await this.materials.get(user, materialId);
    return this.prisma.quiz.findMany({ where: { materialId }, orderBy: { createdAt: "desc" } });
  }

  async get(user: AuthUser, quizId: string) {
    const quiz = await this.prisma.quiz.findUnique({
      where: { id: quizId },
      include: { material: { select: { userId: true } } },
    });
    if (!quiz) throw new NotFoundException("Kuis tidak ditemukan");
    if (quiz.material.userId !== user.sub) throw new ForbiddenException();
    return quiz;
  }

  /** Simpan skor terakhir. Dipangkas ke rentang 0..jumlah soal. */
  async saveScore(user: AuthUser, quizId: string, skor: number) {
    const quiz = await this.get(user, quizId);
    const soal = (quiz.soalJson as { questions?: unknown[] } | null)?.questions ?? [];
    const aman = Math.max(0, Math.min(Math.trunc(skor), soal.length));
    return this.prisma.quiz.update({ where: { id: quizId }, data: { skor: aman } });
  }

  async generate(
    user: AuthUser,
    materialId: string,
    count: number,
    types: QuizType[],
    chapterIds?: string[],
  ) {
    const { judul, context } = await this.materials.getContext(user, materialId, chapterIds);
    const res = await this.ai.generateQuiz({ judul, context, count, types });
    const soalJson = { count, types, questions: res.questions } as unknown as Prisma.InputJsonValue;
    return this.prisma.quiz.create({
      data: { materialId, userId: user.sub, soalJson },
    });
  }
}
