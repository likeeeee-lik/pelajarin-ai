import { Injectable, Logger, UnauthorizedException } from "@nestjs/common";
import { createHash, randomBytes } from "node:crypto";
import { PrismaService } from "../prisma/prisma.service";

/** Umur sesi panjang. Diperbarui setiap kali token dirotasi. */
const REFRESH_TTL_DAYS = 60;

@Injectable()
export class RefreshService {
  private readonly logger = new Logger(RefreshService.name);

  constructor(private readonly prisma: PrismaService) {}

  /** Token acak 32 byte; hanya hash-nya yang disimpan. */
  private hash(token: string): string {
    return createHash("sha256").update(token).digest("hex");
  }

  private expiry(): Date {
    return new Date(Date.now() + REFRESH_TTL_DAYS * 24 * 60 * 60_000);
  }

  /** Terbitkan refresh token baru untuk sebuah sesi. */
  async issue(userId: string): Promise<string> {
    const token = randomBytes(32).toString("base64url");
    await this.prisma.refreshToken.create({
      data: { userId, tokenHash: this.hash(token), expiresAt: this.expiry() },
    });
    return token;
  }

  /**
   * Tukar token lama dengan yang baru (rotasi).
   *
   * Bila token yang SUDAH dicabut dipakai lagi, itu tanda kuat token dicuri:
   * penyerang dan pemilik sah memakai token yang sama, salah satunya memakai
   * token usang. Reaksinya tegas — cabut seluruh sesi user tersebut.
   */
  async rotate(token: string): Promise<{ userId: string; token: string }> {
    const rec = await this.prisma.refreshToken.findUnique({
      where: { tokenHash: this.hash(token) },
    });
    if (!rec) throw new UnauthorizedException("Sesi tidak valid");

    if (rec.revokedAt) {
      this.logger.warn(`Refresh token dipakai ulang (user ${rec.userId}) — semua sesi dicabut`);
      await this.revokeAllForUser(rec.userId);
      throw new UnauthorizedException("Sesi tidak valid");
    }
    if (rec.expiresAt.getTime() < Date.now()) {
      throw new UnauthorizedException("Sesi kedaluwarsa");
    }

    const baru = randomBytes(32).toString("base64url");
    await this.prisma.$transaction(async (tx) => {
      const dibuat = await tx.refreshToken.create({
        data: { userId: rec.userId, tokenHash: this.hash(baru), expiresAt: this.expiry() },
      });
      await tx.refreshToken.update({
        where: { id: rec.id },
        data: { revokedAt: new Date(), replacedById: dibuat.id },
      });
    });

    return { userId: rec.userId, token: baru };
  }

  /** Keluar dari satu perangkat. Tidak melempar bila token tak dikenal. */
  async revoke(token: string): Promise<void> {
    await this.prisma.refreshToken.updateMany({
      where: { tokenHash: this.hash(token), revokedAt: null },
      data: { revokedAt: new Date() },
    });
  }

  /** Keluar dari semua perangkat (juga dipakai saat mendeteksi pencurian). */
  async revokeAllForUser(userId: string): Promise<void> {
    await this.prisma.refreshToken.updateMany({
      where: { userId, revokedAt: null },
      data: { revokedAt: new Date() },
    });
  }
}
