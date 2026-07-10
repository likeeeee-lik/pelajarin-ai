import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { VerificationService } from "./verification.service";

@Module({
  controllers: [AuthController],
  providers: [AuthService, VerificationService],
})
export class AuthModule {}
