import { BadRequestException, Injectable, UnauthorizedException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { checkPasswordStrength, hashPassword, verifyPassword } from "./password";
import { signLocalToken } from "./local-jwt";

export interface RegisterDto {
  nama?: string;
  email?: string;
  password?: string;
}
export interface LoginDto {
  email?: string;
  password?: string;
}

export interface AuthResult {
  token: string;
  user: { id: string; nama: string; email: string };
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Hash boneka: dipakai saat email tak ditemukan agar scrypt tetap berjalan.
 * Tanpa ini, respons untuk email tak terdaftar jauh lebih cepat — dan penyerang
 * bisa memakai selisih waktu itu untuk memetakan email mana yang punya akun.
 */
const DUMMY_HASH = `scrypt$${"00".repeat(16)}$${"00".repeat(64)}`;

/** Pembatas percobaan login sederhana (per-proses). */
const MAX_ATTEMPTS = 8;
const WINDOW_MS = 10 * 60_000;
const attempts = new Map<string, { count: number; first: number }>();

function tooManyAttempts(key: string): boolean {
  const now = Date.now();
  const rec = attempts.get(key);
  if (!rec || now - rec.first > WINDOW_MS) return false;
  return rec.count >= MAX_ATTEMPTS;
}
function noteAttempt(key: string) {
  const now = Date.now();
  const rec = attempts.get(key);
  if (!rec || now - rec.first > WINDOW_MS) attempts.set(key, { count: 1, first: now });
  else rec.count += 1;
}
function clearAttempts(key: string) {
  attempts.delete(key);
}

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  private normalizeEmail(email: string): string {
    return email.trim().toLowerCase();
  }

  private async issue(user: { id: string; nama: string; email: string }): Promise<AuthResult> {
    const token = await signLocalToken({ sub: user.id, email: user.email, name: user.nama });
    return { token, user };
  }

  async register(dto: RegisterDto): Promise<AuthResult> {
    const nama = (dto.nama ?? "").trim();
    const email = this.normalizeEmail(dto.email ?? "");
    const password = dto.password ?? "";

    if (nama.length < 2) throw new BadRequestException("Nama minimal 2 karakter");
    if (!EMAIL_RE.test(email)) throw new BadRequestException("Format email tidak valid");
    const weak = checkPasswordStrength(password);
    if (weak) throw new BadRequestException(weak);

    const existing = await this.prisma.profile.findUnique({ where: { email } });
    if (existing) throw new BadRequestException("Email sudah terdaftar");

    const profile = await this.prisma.profile.create({
      data: { email, nama, passwordHash: await hashPassword(password) },
      select: { id: true, nama: true, email: true },
    });
    return this.issue(profile);
  }

  async login(dto: LoginDto): Promise<AuthResult> {
    const email = this.normalizeEmail(dto.email ?? "");
    const password = dto.password ?? "";
    if (!email || !password) throw new UnauthorizedException("Email atau password salah");

    if (tooManyAttempts(email)) {
      throw new UnauthorizedException("Terlalu banyak percobaan. Coba lagi beberapa menit.");
    }

    const profile = await this.prisma.profile.findUnique({ where: { email } });
    // Selalu jalankan scrypt (pakai hash boneka bila email tak ada) agar durasi
    // respons tidak membocorkan keberadaan akun. Pesan error pun disamakan.
    const ok = await verifyPassword(password, profile?.passwordHash ?? DUMMY_HASH);
    if (!profile || !ok) {
      noteAttempt(email);
      throw new UnauthorizedException("Email atau password salah");
    }

    clearAttempts(email);
    return this.issue({ id: profile.id, nama: profile.nama, email: profile.email });
  }
}
