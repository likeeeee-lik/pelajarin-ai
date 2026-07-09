import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import type { AuthUser } from "../auth/jwt.types";

@Injectable()
export class SubjectsService {
  constructor(private readonly prisma: PrismaService) {}

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
    return this.prisma.subject.findMany({
      where: { userId: user.sub },
      orderBy: { createdAt: "asc" },
      include: { _count: { select: { materials: true } } },
    });
  }

  async create(user: AuthUser, nama: string) {
    await this.ensureUser(user);
    return this.prisma.subject.create({
      data: { userId: user.sub, nama: nama.trim() || "Tanpa Nama" },
    });
  }

  async remove(user: AuthUser, id: string) {
    const subject = await this.prisma.subject.findFirst({ where: { id, userId: user.sub } });
    if (!subject) throw new NotFoundException("Mata pelajaran tidak ditemukan");
    await this.prisma.subject.delete({ where: { id } });
    return { ok: true };
  }
}
