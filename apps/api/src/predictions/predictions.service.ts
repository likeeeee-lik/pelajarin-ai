import { Injectable, NotFoundException } from "@nestjs/common";
import { Prisma, type ExamType } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";
import { AiProvider } from "../ai/ai-provider";
import type { AuthUser } from "../auth/jwt.types";

export interface CreatePredictionDto {
  judul: string;
  tipe: ExamType; // uts | uas | kuis | latihan
  subjectId?: string;
  sourceText?: string;
  sourceFiles?: string[];
}

@Injectable()
export class PredictionsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly ai: AiProvider,
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

  async list(user: AuthUser) {
    return this.prisma.examPrediction.findMany({
      where: { userId: user.sub },
      orderBy: { createdAt: "desc" },
    });
  }

  async get(user: AuthUser, id: string) {
    const pred = await this.prisma.examPrediction.findFirst({ where: { id, userId: user.sub } });
    if (!pred) throw new NotFoundException("Prediksi tidak ditemukan");
    return pred;
  }

  async create(user: AuthUser, dto: CreatePredictionDto) {
    await this.ensureUser(user);
    const res = await this.ai.predictExam({
      judul: dto.judul,
      tipe: dto.tipe,
      sourceText: dto.sourceText || dto.judul,
    });
    return this.prisma.examPrediction.create({
      data: {
        userId: user.sub,
        subjectId: dto.subjectId || null,
        judul: dto.judul.trim() || "Prediksi Soal",
        tipe: dto.tipe,
        sourceFiles: (dto.sourceFiles ?? []) as unknown as Prisma.InputJsonValue,
        prediksiJson: { questions: res.questions } as unknown as Prisma.InputJsonValue,
      },
    });
  }
}
