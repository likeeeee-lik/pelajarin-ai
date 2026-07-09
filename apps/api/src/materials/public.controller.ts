import { Controller, Get, Param } from "@nestjs/common";
import { MaterialsService } from "./materials.service";

/** Akses publik (tanpa auth) untuk catatan yang dibagikan via slug. */
@Controller("public/materials")
export class PublicController {
  constructor(private readonly materials: MaterialsService) {}

  @Get(":slug")
  get(@Param("slug") slug: string) {
    return this.materials.getPublic(slug);
  }
}
