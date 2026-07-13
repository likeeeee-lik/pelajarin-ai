import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import type { AuthedRequest } from "./jwt.types";

/**
 * Izinkan hanya akun ber-peran admin.
 *
 * Peran dibaca dari DATABASE tiap request, bukan dari klaim di dalam JWT.
 * Alasannya: token berumur 15 menit, jadi peran yang dicabut lewat ADMIN_EMAILS
 * baru berlaku setelah token kedaluwarsa kalau kita percaya isi token. Dengan
 * membaca DB, pencabutan berlaku seketika.
 *
 * Dipakai SETELAH JwtAuthGuard (`@UseGuards(JwtAuthGuard, AdminGuard)`).
 */
@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private readonly prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<AuthedRequest>();
    const sub = req.user?.sub;
    if (!sub) throw new ForbiddenException();

    const profile = await this.prisma.profile.findUnique({
      where: { id: sub },
      select: { role: true },
    });
    if (profile?.role !== "admin") throw new ForbiddenException("Akses admin diperlukan");
    return true;
  }
}
