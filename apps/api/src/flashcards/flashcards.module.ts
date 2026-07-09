import { Module } from "@nestjs/common";
import { MaterialsModule } from "../materials/materials.module";
import { FlashcardsController } from "./flashcards.controller";
import { FlashcardsService } from "./flashcards.service";

@Module({
  imports: [MaterialsModule],
  controllers: [FlashcardsController],
  providers: [FlashcardsService],
})
export class FlashcardsModule {}
