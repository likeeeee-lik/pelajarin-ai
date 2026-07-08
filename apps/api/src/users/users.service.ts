import { Injectable } from "@nestjs/common";
import type { AuthUser } from "../auth/jwt.types";
import { PrismaService } from "../prisma/prisma.service";

export interface ProfileDto {
  id: string;
  nama: string;
  email: string;
  avatarUrl: string | null;
  plan: "free" | "pro" | "institusi";
  bahasaTampilan: string;
  bahasaGenerasi: string;
  xp: number;
  level: number;
  streakCurrent: number;
  streakBest: number;
  onboardingCompleted: boolean;
}

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  /** Ambil profil user; buat otomatis saat pertama kali login (upsert by Logto sub). */
  async getProfile(user: AuthUser): Promise<ProfileDto> {
    const p = await this.prisma.profile.upsert({
      where: { id: user.sub },
      update: {
        ...(user.email ? { email: user.email } : {}),
        ...(user.name ? { nama: user.name } : {}),
        ...(user.picture ? { avatarUrl: user.picture } : {}),
      },
      create: {
        id: user.sub,
        email: user.email ?? `${user.sub}@pelajarin.local`,
        nama: user.name ?? "Pengguna",
        avatarUrl: user.picture ?? null,
      },
      include: { streak: true },
    });

    return {
      id: p.id,
      nama: p.nama,
      email: p.email,
      avatarUrl: p.avatarUrl,
      plan: p.plan,
      bahasaTampilan: p.bahasaTampilan,
      bahasaGenerasi: p.bahasaGenerasi,
      xp: p.xp,
      level: p.level,
      streakCurrent: p.streak?.current ?? 0,
      streakBest: p.streak?.best ?? 0,
      onboardingCompleted: p.onboardingDone,
    };
  }
}
