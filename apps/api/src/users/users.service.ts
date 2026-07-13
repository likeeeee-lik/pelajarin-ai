import { Injectable } from "@nestjs/common";
import type { Role } from "@prisma/client";
import type { AuthUser } from "../auth/jwt.types";
import { PrismaService } from "../prisma/prisma.service";
import { LogtoAdmin } from "../logto/logto-admin";

/** Domain email tiruan saat identitas asli belum diketahui. */
const PLACEHOLDER_DOMAIN = "@pelajarin.local";
const PLACEHOLDER_NAME = "Pengguna";

/**
 * Admin ditentukan dari env, BUKAN dari aplikasi — tak ada endpoint yang bisa
 * menaikkan peran, jadi pengguna mustahil mengangkat dirinya sendiri.
 * Menambah admin = tambah email di ADMIN_EMAILS lalu restart API.
 */
function emailAdmin(): string[] {
  return (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

export interface ProfileDto {
  id: string;
  nama: string;
  email: string;
  emailVerified: boolean;
  avatarUrl: string | null;
  role: Role;
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
  onboardingCompleted?: boolean;
}

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly logto: LogtoAdmin,
  ) {}

  /** Ambil profil user; buat otomatis saat pertama kali login (upsert by Logto sub). */
  async getProfile(user: AuthUser): Promise<ProfileDto> {
    let p = await this.prisma.profile.upsert({
      where: { id: user.sub },
      // Sinkron dari IdP hanya email/avatar. `nama` sengaja TIDAK ditimpa agar
      // perubahan nama tampilan oleh user (PATCH /me) tidak hilang.
      update: {
        ...(user.email ? { email: user.email } : {}),
        ...(user.picture ? { avatarUrl: user.picture } : {}),
      },
      create: {
        id: user.sub,
        email: user.email ?? `${user.sub}${PLACEHOLDER_DOMAIN}`,
        nama: user.name ?? PLACEHOLDER_NAME,
        avatarUrl: user.picture ?? null,
      },
      include: { streak: true },
    });

    const enriched = await this.enrichIdentity(p);
    if (enriched) p = enriched;

    // Selaraskan peran dengan ADMIN_EMAILS. Dua arah: email yang dihapus dari
    // daftar akan turun jadi user lagi — jadi mencabut admin cukup lewat env.
    const harusAdmin = emailAdmin().includes(p.email.toLowerCase());
    const seharusnya: Role = harusAdmin ? "admin" : "user";
    if (p.role !== seharusnya) {
      p = await this.prisma.profile.update({
        where: { id: p.id },
        data: { role: seharusnya },
        include: { streak: true },
      });
    }

    return {
      id: p.id,
      nama: p.nama,
      email: p.email,
      emailVerified: p.emailVerified,
      avatarUrl: p.avatarUrl,
      role: p.role,
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

  /**
   * Lengkapi identitas dari Logto bila profil masih memakai nilai tiruan.
   * Dipicu HANYA saat email masih placeholder → sekali per user, bukan tiap request.
   * `nama` yang sudah diubah user tidak pernah ditimpa.
   */
  private async enrichIdentity<
    T extends { id: string; email: string; nama: string; avatarUrl: string | null },
  >(p: T): Promise<T | null> {
    if (!this.logto.enabled) return null;
    if (!p.email.endsWith(PLACEHOLDER_DOMAIN)) return null; // sudah nyata
    if (UsersService.enrichFailed.has(p.id)) return null; // jangan badai request

    const identity = await this.logto.getUser(p.id);
    if (!identity?.email) {
      // tak ada email di Logto (mis. daftar via sosial tanpa email) → jangan ulangi
      UsersService.enrichFailed.add(p.id);
      return null;
    }

    const namaBaru =
      p.nama === PLACEHOLDER_NAME
        ? identity.name?.trim() || identity.email.split("@")[0]
        : p.nama;

    const updated = await this.prisma.profile.update({
      where: { id: p.id },
      data: {
        email: identity.email,
        nama: namaBaru,
        ...(identity.picture && !p.avatarUrl ? { avatarUrl: identity.picture } : {}),
      },
      include: { streak: true },
    });
    return updated as unknown as T;
  }

  /** userId yang identitasnya tak bisa diambil — hindari memanggil Logto berulang. */
  private static readonly enrichFailed = new Set<string>();

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
        ...(typeof dto.onboardingCompleted === "boolean"
          ? { onboardingDone: dto.onboardingCompleted }
          : {}),
      },
    });
    return this.getProfile(user);
  }
}
