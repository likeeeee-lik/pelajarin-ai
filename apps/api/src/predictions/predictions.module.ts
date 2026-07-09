import { Module } from "@nestjs/common";
import { IngestionModule } from "../ingestion/ingestion.module";
import { PredictionsController } from "./predictions.controller";
import { PredictionsService } from "./predictions.service";

@Module({
  imports: [IngestionModule],
  controllers: [PredictionsController],
  providers: [PredictionsService],
})
export class PredictionsModule {}
