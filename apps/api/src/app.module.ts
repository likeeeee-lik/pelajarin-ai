import { Module } from "@nestjs/common";
import { HealthController } from "./health/health.controller";
import { PrismaModule } from "./prisma/prisma.module";
import { AiModule } from "./ai/ai.module";
import { AuthModule } from "./auth/auth.module";
import { LogtoModule } from "./logto/logto.module";
import { MailModule } from "./mail/mail.module";
import { StorageModule } from "./storage/storage.module";
import { UsersModule } from "./users/users.module";
import { SubjectsModule } from "./subjects/subjects.module";
import { MaterialsModule } from "./materials/materials.module";
import { ChaptersModule } from "./chapters/chapters.module";
import { MindmapModule } from "./mindmap/mindmap.module";
import { FlashcardsModule } from "./flashcards/flashcards.module";
import { QuizzesModule } from "./quizzes/quizzes.module";
import { ChatModule } from "./chat/chat.module";
import { PredictionsModule } from "./predictions/predictions.module";
import { AdminModule } from "./admin/admin.module";
import { LeaderboardModule } from "./leaderboard/leaderboard.module";
import { StatsModule } from "./stats/stats.module";

@Module({
  imports: [
    PrismaModule,
    MailModule,
    AuthModule,
    AiModule,
    LogtoModule,
    StorageModule,
    UsersModule,
    SubjectsModule,
    MaterialsModule,
    ChaptersModule,
    MindmapModule,
    FlashcardsModule,
    QuizzesModule,
    ChatModule,
    PredictionsModule,
    LeaderboardModule,
    AdminModule,
    StatsModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
