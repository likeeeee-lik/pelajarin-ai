import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { CurrentUser } from "../auth/current-user.decorator";
import type { AuthUser } from "../auth/jwt.types";
import { MaterialsService } from "./materials.service";
import type { CreateMaterialDto } from "./materials.dto";

@Controller("materials")
@UseGuards(JwtAuthGuard)
export class MaterialsController {
  constructor(private readonly materials: MaterialsService) {}

  @Post()
  create(@CurrentUser() user: AuthUser, @Body() dto: CreateMaterialDto) {
    return this.materials.create(user, dto);
  }

  /** Unggah file (dokumen/audio/video) → parse/transkrip → materi + bab. */
  @Post("upload")
  @UseInterceptors(FileInterceptor("file", { limits: { fileSize: 300 * 1024 * 1024 } }))
  upload(
    @CurrentUser() user: AuthUser,
    @UploadedFile() file: Express.Multer.File | undefined,
    @Body() dto: CreateMaterialDto,
  ) {
    return this.materials.createFromUpload(user, file, dto);
  }

  @Get()
  list(@CurrentUser() user: AuthUser) {
    return this.materials.list(user);
  }

  @Get(":id")
  get(@CurrentUser() user: AuthUser, @Param("id") id: string) {
    return this.materials.get(user, id);
  }

  @Delete(":id")
  remove(@CurrentUser() user: AuthUser, @Param("id") id: string) {
    return this.materials.remove(user, id);
  }
}
