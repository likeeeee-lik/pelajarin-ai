import { Body, Controller, Get, Param, Post, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { CurrentUser } from "../auth/current-user.decorator";
import type { AuthUser } from "../auth/jwt.types";
import { FlashcardsService } from "./flashcards.service";

@Controller("materials/:id/flashcards")
@UseGuards(JwtAuthGuard)
export class FlashcardsController {
  constructor(private readonly flashcards: FlashcardsService) {}

  @Get()
  list(@CurrentUser() user: AuthUser, @Param("id") id: string) {
    return this.flashcards.list(user, id);
  }

  @Post("generate")
  generate(
    @CurrentUser() user: AuthUser,
    @Param("id") id: string,
    @Body() body: { count?: number; chapterIds?: string[] },
  ) {
    return this.flashcards.generate(user, id, body.count ?? 15, body.chapterIds);
  }
}
