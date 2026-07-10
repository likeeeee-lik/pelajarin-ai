import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  Logger,
  UnauthorizedException,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { MailProvider } from "../mail/mail-provider";
import { resetPasswordTemplate, verifyEmailTemplate } from "../mail/templates";
import { checkPasswordStrength, hashPassword, verifyPassword } from "./password";
import { signLocalToken } from "./local-jwt";
import { CODE_TTL_MINUTES, VerificationService } from "./verification.service";
import { RefreshService } from "./refresh.service";

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
  /** JWT berumur pendek untuk memanggil API. */
  token: string;
  /** Token buram berumur panjang untuk memperbarui `token`. */
  refreshToken: string;
  user: { id: string; nama: string; email: string; emailVerified: boolean };
}

export interface VerifyDto {
  email?: string;
  code?: string;
}
export interface ResetDto {
  email?: string;
  code?: string;
  password?: string;
}

/** Balasan seragam untuk endpoint yang tak boleh membocorkan keberadaan akun. */
const GENERIC_SENT = {
  ok: true,
  message: "Jika email terdaftar, kami sudah mengirimkan kode ke sana.",
};

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
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly mail: MailProvider,
    private readonly verification: VerificationService,
    private readonly refresh: RefreshService,
  ) {}

  private normalizeEmail(email: string): string {
    return email.trim().toLowerCase();
  }

  private async issue(user: {
    id: string;
    nama: string;
    email: string;
    emailVerified: boolean;
  }): Promise<AuthResult> {
    const token = await signLocalToken({ sub: user.id, email: user.email, name: user.nama });
    const refreshToken = await this.refresh.issue(user.id);
    return { token, refreshToken, user };
  }

  /** Tukar refresh token dengan sepasang token baru (rotasi). */
  async refreshSession(refreshToken: string): Promise<AuthResult> {
    if (!refreshToken) throw new UnauthorizedException("Sesi tidak valid");
    const { userId, token: baru } = await this.refresh.rotate(refreshToken);

    const profile = await this.prisma.profile.findUnique({ where: { id: userId } });
    if (!profile) throw new UnauthorizedException("Sesi tidak valid");

    const token = await signLocalToken({ sub: profile.id, email: profile.email, name: profile.nama });
    return {
      token,
      refreshToken: baru,
      user: {
        id: profile.id,
        nama: profile.nama,
        email: profile.email,
        emailVerified: profile.emailVerified,
      },
    };
  }

  /** Keluar dari satu perangkat. */
  async logout(refreshToken?: string): Promise<{ ok: true }> {
    if (refreshToken) await this.refresh.revoke(refreshToken);
    return { ok: true };
  }

  /** Kirim kode; kegagalan email tidak boleh menggagalkan pendaftaran. */
  private async kirimKodeVerifikasi(email: string, nama: string) {
    try {
      const code = await this.verification.issue(email, "verify_email");
      await this.mail.send(verifyEmailTemplate(email, nama, code, CODE_TTL_MINUTES));
    } catch (e) {
      this.logger.error(`Gagal mengirim kode verifikasi ke ${email}: ${(e as Error).message}`);
    }
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
      select: { id: true, nama: true, email: true, emailVerified: true },
    });
    await this.kirimKodeVerifikasi(email, nama);
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

    if (process.env.REQUIRE_EMAIL_VERIFICATION === "true" && !profile.emailVerified) {
      throw new ForbiddenException("Email belum diverifikasi");
    }

    clearAttempts(email);
    return this.issue({
      id: profile.id,
      nama: profile.nama,
      email: profile.email,
      emailVerified: profile.emailVerified,
    });
  }

  // ── Verifikasi email ──────────────────────────────────────

  /** Kirim ulang kode. Balasan seragam agar tak membocorkan keberadaan akun. */
  async requestVerification(email0: string) {
    const email = this.normalizeEmail(email0 ?? "");
    if (!EMAIL_RE.test(email)) throw new BadRequestException("Format email tidak valid");

    const profile = await this.prisma.profile.findUnique({ where: { email } });
    if (profile && !profile.emailVerified && !(await this.verification.inCooldown(email, "verify_email"))) {
      await this.kirimKodeVerifikasi(email, profile.nama);
    }
    return GENERIC_SENT;
  }

  async confirmVerification(dto: VerifyDto) {
    const email = this.normalizeEmail(dto.email ?? "");
    const code = (dto.code ?? "").trim();
    if (!email || !code) throw new BadRequestException("Email dan kode wajib diisi");

    const res = await this.verification.consume(email, "verify_email", code);
    if (!res.ok) throw new BadRequestException(this.pesanGagal(res.reason));

    await this.prisma.profile.update({ where: { email }, data: { emailVerified: true } });
    return { ok: true };
  }

  // ── Lupa / atur ulang password ────────────────────────────

  /**
   * SELALU balas sama, terdaftar atau tidak. Kalau kita membedakan balasan,
   * halaman ini berubah jadi alat untuk memeriksa email siapa saja yang punya akun.
   */
  async forgotPassword(email0: string) {
    const email = this.normalizeEmail(email0 ?? "");
    if (!EMAIL_RE.test(email)) return GENERIC_SENT;

    const profile = await this.prisma.profile.findUnique({ where: { email } });
    if (profile && !(await this.verification.inCooldown(email, "reset_password"))) {
      try {
        const code = await this.verification.issue(email, "reset_password");
        await this.mail.send(resetPasswordTemplate(email, profile.nama, code, CODE_TTL_MINUTES));
      } catch (e) {
        this.logger.error(`Gagal mengirim kode reset ke ${email}: ${(e as Error).message}`);
      }
    }
    return GENERIC_SENT;
  }

  async resetPassword(dto: ResetDto): Promise<AuthResult> {
    const email = this.normalizeEmail(dto.email ?? "");
    const code = (dto.code ?? "").trim();
    const password = dto.password ?? "";

    if (!email || !code) throw new BadRequestException("Email dan kode wajib diisi");
    const weak = checkPasswordStrength(password);
    if (weak) throw new BadRequestException(weak);

    const res = await this.verification.consume(email, "reset_password", code);
    if (!res.ok) throw new BadRequestException(this.pesanGagal(res.reason));

    const profile = await this.prisma.profile.update({
      where: { email },
      // Berhasil memakai kode dari inbox = terbukti menguasai email itu.
      data: { passwordHash: await hashPassword(password), emailVerified: true },
      select: { id: true, nama: true, email: true, emailVerified: true },
    });
    // Ganti password harus mengusir sesi lain. Tanpa ini, penyusup yang sudah
    // terlanjur masuk tetap bertahan meski korban sudah mengganti passwordnya.
    await this.refresh.revokeAllForUser(profile.id);
    clearAttempts(email);
    return this.issue(profile);
  }

  private pesanGagal(reason: "invalid" | "expired" | "too_many_attempts"): string {
    if (reason === "expired") return "Kode sudah kedaluwarsa. Minta kode baru.";
    if (reason === "too_many_attempts") return "Terlalu banyak percobaan. Minta kode baru.";
    return "Kode salah";
  }
}
