import { Module } from "@nestjs/common";
import { HealthController } from "./health/health.controller";
import { PrismaModule } from "./prisma/prisma.module";
import { AiModule } from "./ai/ai.module";
import { UsersModule } from "./users/users.module";
import { MaterialsModule } from "./materials/materials.module";
import { ChaptersModule } from "./chapters/chapters.module";

@Module({
  imports: [PrismaModule, AiModule, UsersModule, MaterialsModule, ChaptersModule],
  controllers: [HealthController],
})
export class AppModule {}
