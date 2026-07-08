import { Injectable } from "@nestjs/common";
import type { AuthUser } from "../auth/jwt.types";

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

/**
 * Sementara mengembalikan profil dari klaim token (demo).
 * TODO(W1/W3): baca/tulis ke Postgres (Supabase) via Prisma setelah DB di-wire.
 */
@Injectable()
export class UsersService {
  getProfile(user: AuthUser): ProfileDto {
    return {
      id: user.sub,
      nama: user.name ?? "Pengguna",
      email: user.email ?? "",
      avatarUrl: user.picture ?? null,
      plan: "free",
      bahasaTampilan: "id",
      bahasaGenerasi: "id",
      xp: 0,
      level: 1,
      streakCurrent: 0,
      streakBest: 0,
      onboardingCompleted: false,
    };
  }
}
