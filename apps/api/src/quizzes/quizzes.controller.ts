import { Body, Controller, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { CurrentUser } from "../auth/current-user.decorator";
import type { AuthUser } from "../auth/jwt.types";
import type { QuizType } from "../ai/ai.types";
import { QuizzesService } from "./quizzes.service";

@Controller()
@UseGuards(JwtAuthGuard)
export class QuizzesController {
  constructor(private readonly quizzes: QuizzesService) {}

  @Get("materials/:id/quizzes")
  list(@CurrentUser() user: AuthUser, @Param("id") id: string) {
    return this.quizzes.list(user, id);
  }

  @Post("materials/:id/quizzes/generate")
  generate(
    @CurrentUser() user: AuthUser,
    @Param("id") id: string,
    @Body() body: { count?: number; types?: QuizType[]; chapterIds?: string[] },
  ) {
    return this.quizzes.generate(user, id, body.count ?? 5, body.types ?? ["pilihan_ganda"], body.chapterIds);
  }

  @Get("quizzes/:quizId")
  get(@CurrentUser() user: AuthUser, @Param("quizId") quizId: string) {
    return this.quizzes.get(user, quizId);
  }

  /** Simpan skor setelah kuis dikerjakan (tanpa memanggil AI). */
  @Patch("quizzes/:quizId/score")
  saveScore(@CurrentUser() user: AuthUser, @Param("quizId") quizId: string, @Body() body: { skor: number }) {
    return this.quizzes.saveScore(user, quizId, body.skor);
  }
}
