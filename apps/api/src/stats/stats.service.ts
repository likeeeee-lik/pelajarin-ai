import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import type { AuthUser } from "../auth/jwt.types";

export interface UserStats {
  materials: number;
  flashcards: number;
  quizzes: number;
  predictions: number;
  subjects: number;
  files: number;
}

@Injectable()
export class StatsService {
  constructor(private readonly prisma: PrismaService) {}

  /** Hitungan agregat milik user (nyata dari DB). */
  async forUser(user: AuthUser): Promise<UserStats> {
    const uid = user.sub;
    const [materials, flashcards, quizzes, predictions, subjects, files] = await Promise.all([
      this.prisma.material.count({ where: { userId: uid } }),
      this.prisma.flashcard.count({ where: { userId: uid } }),
      this.prisma.quiz.count({ where: { userId: uid } }),
      this.prisma.examPrediction.count({ where: { userId: uid } }),
      this.prisma.subject.count({ where: { userId: uid } }),
      this.prisma.materialFile.count({ where: { material: { userId: uid } } }),
    ]);
    return { materials, flashcards, quizzes, predictions, subjects, files };
  }
}
