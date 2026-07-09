import { Module } from "@nestjs/common";
import { IngestionModule } from "../ingestion/ingestion.module";
import { MaterialsController } from "./materials.controller";
import { MaterialsService } from "./materials.service";

@Module({
  imports: [IngestionModule],
  controllers: [MaterialsController],
  providers: [MaterialsService],
  exports: [MaterialsService],
})
export class MaterialsModule {}
