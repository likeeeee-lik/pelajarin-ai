import { Body, Controller, Delete, Get, Param, Post, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { CurrentUser } from "../auth/current-user.decorator";
import type { AuthUser } from "../auth/jwt.types";
import { SubjectsService } from "./subjects.service";

@Controller("subjects")
@UseGuards(JwtAuthGuard)
export class SubjectsController {
  constructor(private readonly subjects: SubjectsService) {}

  @Get()
  list(@CurrentUser() user: AuthUser) {
    return this.subjects.list(user);
  }

  @Post()
  create(@CurrentUser() user: AuthUser, @Body() body: { nama: string }) {
    return this.subjects.create(user, body.nama);
  }

  @Delete(":id")
  remove(@CurrentUser() user: AuthUser, @Param("id") id: string) {
    return this.subjects.remove(user, id);
  }
}
