import { Module } from "@nestjs/common";
import { HealthController } from "./health/health.controller";
import { PrismaModule } from "./prisma/prisma.module";
import { AiModule } from "./ai/ai.module";
import { UsersModule } from "./users/users.module";
import { MaterialsModule } from "./materials/materials.module";
import { ChaptersModule } from "./chapters/chapters.module";
import { MindmapModule } from "./mindmap/mindmap.module";
import { FlashcardsModule } from "./flashcards/flashcards.module";
import { QuizzesModule } from "./quizzes/quizzes.module";
import { ChatModule } from "./chat/chat.module";
import { PredictionsModule } from "./predictions/predictions.module";

@Module({
  imports: [
    PrismaModule,
    AiModule,
    UsersModule,
    MaterialsModule,
    ChaptersModule,
    MindmapModule,
    FlashcardsModule,
    QuizzesModule,
    ChatModule,
    PredictionsModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
