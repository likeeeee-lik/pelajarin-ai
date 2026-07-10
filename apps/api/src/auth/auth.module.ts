import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { VerificationService } from "./verification.service";
import { RefreshService } from "./refresh.service";

@Module({
  controllers: [AuthController],
  providers: [AuthService, VerificationService, RefreshService],
})
export class AuthModule {}
