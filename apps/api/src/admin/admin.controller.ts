import { Controller, Get, Query, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { AdminGuard } from "../auth/admin.guard";
import { AdminService } from "./admin.service";

/**
 * Endpoint admin — BACA-SAJA. Belum ada aksi yang mengubah/menghapus apa pun,
 * jadi tak ada yang bisa dirusak lewat sini.
 *
 * Urutan guard penting: JwtAuthGuard dulu (menempelkan req.user), baru AdminGuard.
 */
@Controller("admin")
@UseGuards(JwtAuthGuard, AdminGuard)
export class AdminController {
  constructor(private readonly admin: AdminService) {}

  @Get("users")
  users(@Query("q") q?: string, @Query("page") page?: string) {
    return this.admin.users(q ?? "", Number(page) || 1);
  }
}
