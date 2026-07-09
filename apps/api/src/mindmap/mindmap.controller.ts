import { Controller, Get, Param, Post, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { CurrentUser } from "../auth/current-user.decorator";
import type { AuthUser } from "../auth/jwt.types";
import { MindmapService } from "./mindmap.service";

@Controller("materials/:id/mindmap")
@UseGuards(JwtAuthGuard)
export class MindmapController {
  constructor(private readonly mindmap: MindmapService) {}

  @Get()
  get(@CurrentUser() user: AuthUser, @Param("id") id: string) {
    return this.mindmap.get(user, id);
  }

  @Post("generate")
  generate(@CurrentUser() user: AuthUser, @Param("id") id: string) {
    return this.mindmap.generate(user, id);
  }
}
