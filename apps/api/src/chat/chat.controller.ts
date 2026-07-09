import { Body, Controller, Get, Param, Post, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { CurrentUser } from "../auth/current-user.decorator";
import type { AuthUser } from "../auth/jwt.types";
import { ChatService } from "./chat.service";

@Controller()
@UseGuards(JwtAuthGuard)
export class ChatController {
  constructor(private readonly chat: ChatService) {}

  @Get("materials/:id/chat/sessions")
  listSessions(@CurrentUser() user: AuthUser, @Param("id") id: string) {
    return this.chat.listSessions(user, id);
  }

  @Post("materials/:id/chat/sessions")
  createSession(@CurrentUser() user: AuthUser, @Param("id") id: string) {
    return this.chat.createSession(user, id);
  }

  @Get("chat/sessions/:sessionId/messages")
  getMessages(@CurrentUser() user: AuthUser, @Param("sessionId") sessionId: string) {
    return this.chat.getMessages(user, sessionId);
  }

  @Post("chat/sessions/:sessionId/messages")
  send(
    @CurrentUser() user: AuthUser,
    @Param("sessionId") sessionId: string,
    @Body() body: { question: string; chapterIds?: string[] },
  ) {
    return this.chat.sendMessage(user, sessionId, body.question, body.chapterIds);
  }
}
