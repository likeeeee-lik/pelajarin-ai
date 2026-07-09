import { Body, Controller, Delete, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { CurrentUser } from "../auth/current-user.decorator";
import type { AuthUser } from "../auth/jwt.types";
import { ChaptersService } from "./chapters.service";

@Controller("chapters")
@UseGuards(JwtAuthGuard)
export class ChaptersController {
  constructor(private readonly chapters: ChaptersService) {}

  @Post()
  add(@CurrentUser() user: AuthUser, @Body() body: { materialId: string; judul: string }) {
    return this.chapters.add(user, body.materialId, body.judul);
  }

  @Post(":id/generate")
  generate(@CurrentUser() user: AuthUser, @Param("id") id: string) {
    return this.chapters.generate(user, id);
  }

  @Patch(":id")
  update(@CurrentUser() user: AuthUser, @Param("id") id: string, @Body() body: { kontenMd: string }) {
    return this.chapters.update(user, id, body.kontenMd ?? "");
  }

  @Delete(":id")
  remove(@CurrentUser() user: AuthUser, @Param("id") id: string) {
    return this.chapters.remove(user, id);
  }
}
