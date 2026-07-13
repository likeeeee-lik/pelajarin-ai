import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import type { AuthUser } from "../auth/jwt.types";

export type LeaderboardSort = "xp" | "streak";

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  nama: string;
  avatarUrl: string | null;
  level: number;
  xp: number;
  streak: number;
  /** true bila baris ini adalah user yang sedang login. */
  aku: boolean;
}

export interface LeaderboardResult {
  sort: LeaderboardSort;
  entries: LeaderboardEntry[];
  /** Peringkat user saat ini, walau di luar daftar teratas. */
  akuRank: number | null;
  total: number;
}

const LIMIT = 50;

@Injectable()
export class LeaderboardService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Peringkat NYATA dari data yang ada (Profile.xp/level + Streak.current).
   * Belum ada sistem yang menaikkan XP, jadi wajar bila semua bernilai 0 —
   * itu jujur, dan akan langsung hidup begitu gamifikasi dinyalakan.
   */
  async top(user: AuthUser, sort: LeaderboardSort = "xp"): Promise<LeaderboardResult> {
    const profiles = await this.prisma.profile.findMany({
      select: {
        id: true,
        nama: true,
        avatarUrl: true,
        level: true,
        xp: true,
        streak: { select: { current: true } },
      },
    });

    const nilai = (p: (typeof profiles)[number]) =>
      sort === "streak" ? (p.streak?.current ?? 0) : p.xp;

    const urut = [...profiles].sort((a, b) => {
      const d = nilai(b) - nilai(a);
      if (d !== 0) return d;
      // seri → nama, supaya urutannya stabil (bukan acak antar-request)
      return a.nama.localeCompare(b.nama);
    });

    const entries: LeaderboardEntry[] = urut.slice(0, LIMIT).map((p, i) => ({
      rank: i + 1,
      userId: p.id,
      nama: p.nama,
      avatarUrl: p.avatarUrl,
      level: p.level,
      xp: p.xp,
      streak: p.streak?.current ?? 0,
      aku: p.id === user.sub,
    }));

    const idx = urut.findIndex((p) => p.id === user.sub);

    return {
      sort,
      entries,
      akuRank: idx >= 0 ? idx + 1 : null,
      total: urut.length,
    };
  }
}
