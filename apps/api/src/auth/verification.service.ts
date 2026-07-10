import { Injectable, Logger } from "@nestjs/common";
import { createHash, randomInt } from "node:crypto";
import type { VerificationType } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";

/** Masa berlaku kode OTP. */
export const CODE_TTL_MINUTES = 10;
/** Maksimal percobaan salah sebelum kode hangus. */
const MAX_ATTEMPTS = 5;
/** Jeda minimal antar permintaan kode untuk email+tipe yang sama. */
const RESEND_COOLDOWN_MS = 60_000;

export type VerifyResult =
  | { ok: true }
  | { ok: false; reason: "invalid" | "expired" | "too_many_attempts" };

@Injectable()
export class VerificationService {
  private readonly logger = new Logger(VerificationService.name);

  constructor(private readonly prisma: PrismaService) {}

  /** SHA-256 cukup di sini: kode acak 6 digit berumur 10 menit, bukan password. */
  private hash(code: string): string {
    return createHash("sha256").update(code).digest("hex");
  }

  /** 6 digit acak yang aman secara kriptografis (bukan Math.random). */
  private generateCode(): string {
    return String(randomInt(0, 1_000_000)).padStart(6, "0");
  }

  /** true bila kode terakhir baru saja dikirim (cegah spam tombol "kirim ulang"). */
  async inCooldown(email: string, type: VerificationType): Promise<boolean> {
    const last = await this.prisma.verificationCode.findFirst({
      where: { email, type },
      orderBy: { createdAt: "desc" },
      select: { createdAt: true },
    });
    if (!last) return false;
    return Date.now() - last.createdAt.getTime() < RESEND_COOLDOWN_MS;
  }

  /**
   * Terbitkan kode baru. Kode lama untuk (email, tipe) dibatalkan lebih dulu
   * agar hanya satu kode yang pernah berlaku pada satu waktu.
   */
  async issue(email: string, type: VerificationType): Promise<string> {
    await this.prisma.verificationCode.deleteMany({ where: { email, type, usedAt: null } });
    const code = this.generateCode();
    await this.prisma.verificationCode.create({
      data: {
        email,
        type,
        codeHash: this.hash(code),
        expiresAt: new Date(Date.now() + CODE_TTL_MINUTES * 60_000),
      },
    });
    return code;
  }

  /** Periksa kode. Sukses = kode ditandai terpakai (sekali pakai). */
  async consume(email: string, type: VerificationType, code: string): Promise<VerifyResult> {
    const rec = await this.prisma.verificationCode.findFirst({
      where: { email, type, usedAt: null },
      orderBy: { createdAt: "desc" },
    });
    if (!rec) return { ok: false, reason: "invalid" };

    if (rec.expiresAt.getTime() < Date.now()) {
      await this.prisma.verificationCode.delete({ where: { id: rec.id } });
      return { ok: false, reason: "expired" };
    }
    if (rec.attempts >= MAX_ATTEMPTS) {
      await this.prisma.verificationCode.delete({ where: { id: rec.id } });
      return { ok: false, reason: "too_many_attempts" };
    }

    if (rec.codeHash !== this.hash(code.trim())) {
      await this.prisma.verificationCode.update({
        where: { id: rec.id },
        data: { attempts: { increment: 1 } },
      });
      return { ok: false, reason: "invalid" };
    }

    await this.prisma.verificationCode.update({
      where: { id: rec.id },
      data: { usedAt: new Date() },
    });
    return { ok: true };
  }
}
