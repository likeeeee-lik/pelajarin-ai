import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { FilesInterceptor } from "@nestjs/platform-express";
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

  /** Unggah soal-soal sumber (multi-file) → parse → analisis pola → prediksi. */
  @Post("upload")
  @UseInterceptors(FilesInterceptor("files", 10, { limits: { fileSize: 50 * 1024 * 1024 } }))
  upload(
    @CurrentUser() user: AuthUser,
    @UploadedFiles() files: Array<Express.Multer.File> | undefined,
    @Body() dto: CreatePredictionDto,
  ) {
    return this.predictions.createFromUpload(user, files ?? [], dto);
  }
}
