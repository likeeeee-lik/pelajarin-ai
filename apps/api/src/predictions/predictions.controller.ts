import { Body, Controller, Get, Param, Post, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { CurrentUser } from "../auth/current-user.decorator";
import type { AuthUser } from "../auth/jwt.types";
import { PredictionsService, type CreatePredictionDto } from "./predictions.service";

@Controller("predictions")
@UseGuards(JwtAuthGuard)
export class PredictionsController {
  constructor(private readonly predictions: PredictionsService) {}

  @Get()
  list(@CurrentUser() user: AuthUser) {
    return this.predictions.list(user);
  }

  @Get(":id")
  get(@CurrentUser() user: AuthUser, @Param("id") id: string) {
    return this.predictions.get(user, id);
  }

  @Post()
  create(@CurrentUser() user: AuthUser, @Body() dto: CreatePredictionDto) {
    return this.predictions.create(user, dto);
  }
}
