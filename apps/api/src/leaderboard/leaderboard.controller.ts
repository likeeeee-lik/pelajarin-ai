import { Controller, Get, Query, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { CurrentUser } from "../auth/current-user.decorator";
import type { AuthUser } from "../auth/jwt.types";
import { LeaderboardService, type LeaderboardSort } from "./leaderboard.service";

@Controller("leaderboard")
@UseGuards(JwtAuthGuard)
export class LeaderboardController {
  constructor(private readonly leaderboard: LeaderboardService) {}

  @Get()
  top(@CurrentUser() user: AuthUser, @Query("sort") sort?: string) {
    const s: LeaderboardSort = sort === "streak" ? "streak" : "xp";
    return this.leaderboard.top(user, s);
  }
}
