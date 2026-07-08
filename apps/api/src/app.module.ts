import { Module } from "@nestjs/common";
import { HealthController } from "./health/health.controller";
import { UsersModule } from "./users/users.module";

@Module({
  imports: [UsersModule],
  controllers: [HealthController],
})
export class AppModule {}
