import { Module } from "@nestjs/common";
import { MaterialsModule } from "../materials/materials.module";
import { ChatController } from "./chat.controller";
import { ChatService } from "./chat.service";

@Module({
  imports: [MaterialsModule],
  controllers: [ChatController],
  providers: [ChatService],
})
export class ChatModule {}
