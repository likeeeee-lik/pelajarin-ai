import { Module } from "@nestjs/common";
import { MaterialsModule } from "../materials/materials.module";
import { MindmapController } from "./mindmap.controller";
import { MindmapService } from "./mindmap.service";

@Module({
  imports: [MaterialsModule],
  controllers: [MindmapController],
  providers: [MindmapService],
})
export class MindmapModule {}
