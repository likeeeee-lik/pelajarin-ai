import { Module } from "@nestjs/common";
import { IngestionModule } from "../ingestion/ingestion.module";
import { MaterialsController } from "./materials.controller";
import { PublicController } from "./public.controller";
import { MaterialsService } from "./materials.service";

@Module({
  imports: [IngestionModule],
  controllers: [MaterialsController, PublicController],
  providers: [MaterialsService],
  exports: [MaterialsService],
})
export class MaterialsModule {}
