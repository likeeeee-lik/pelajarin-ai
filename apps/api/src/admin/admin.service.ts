import { Injectable } from "@nestjs/common";
import type { Prisma } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";

export interface AdminUserRow {
  id: string;
  nama: string;
  email: string;
  emailVerified: boolean;
  role: "user" | "admin";
  plan: "free" | "pro" | "institusi";
  createdAt: Date;
  materials: number;
  predictions: number;
}

export interface AdminUsersResult {
  rows: AdminUserRow[];
  total: number;
  page: number;
  perPage: number;
}

const PER_PAGE = 25;

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  /** Daftar pengguna (baca-saja) + pencarian nama/email. */
  async users(q: string, page: number): Promise<AdminUsersResult> {
    const cari = q.trim();
    const where: Prisma.ProfileWhereInput = cari
      ? {
          OR: [
            { nama: { contains: cari, mode: "insensitive" } },
            { email: { contains: cari, mode: "insensitive" } },
          ],
        }
      : {};

    const halaman = Math.max(1, page);

    const [total, profiles] = await Promise.all([
      this.prisma.profile.count({ where }),
      this.prisma.profile.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (halaman - 1) * PER_PAGE,
        take: PER_PAGE,
        select: {
          id: true,
          nama: true,
          email: true,
          emailVerified: true,
          role: true,
          plan: true,
          createdAt: true,
          _count: { select: { materials: true, examPredictions: true } },
        },
      }),
    ]);

    return {
      rows: profiles.map((p) => ({
        id: p.id,
        nama: p.nama,
        email: p.email,
        emailVerified: p.emailVerified,
        role: p.role,
        plan: p.plan,
        createdAt: p.createdAt,
        materials: p._count.materials,
        predictions: p._count.examPredictions,
      })),
      total,
      page: halaman,
      perPage: PER_PAGE,
    };
  }
}
