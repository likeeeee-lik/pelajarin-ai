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

export interface UpdateProfileDto {
  nama?: string;
  bahasaTampilan?: string;
  bahasaGenerasi?: string;
}

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  /** Ambil profil user; buat otomatis saat pertama kali login (upsert by Logto sub). */
  async getProfile(user: AuthUser): Promise<ProfileDto> {
    const p = await this.prisma.profile.upsert({
      where: { id: user.sub },
      // Sinkron dari IdP hanya email/avatar. `nama` sengaja TIDAK ditimpa agar
      // perubahan nama tampilan oleh user (PATCH /me) tidak hilang.
      update: {
        ...(user.email ? { email: user.email } : {}),
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

  /** Perbarui preferensi profil (nama tampilan & bahasa). */
  async updateProfile(user: AuthUser, dto: UpdateProfileDto): Promise<ProfileDto> {
    await this.getProfile(user); // pastikan profil ada
    const nama = dto.nama?.trim();
    await this.prisma.profile.update({
      where: { id: user.sub },
      data: {
        ...(nama ? { nama } : {}),
        ...(dto.bahasaTampilan ? { bahasaTampilan: dto.bahasaTampilan } : {}),
        ...(dto.bahasaGenerasi ? { bahasaGenerasi: dto.bahasaGenerasi } : {}),
      },
    });
    return this.getProfile(user);
  }
}
