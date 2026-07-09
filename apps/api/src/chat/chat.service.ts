import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { AiProvider } from "../ai/ai-provider";
import type { ChatTurn } from "../ai/ai.types";
import { MaterialsService } from "../materials/materials.service";
import type { AuthUser } from "../auth/jwt.types";

@Injectable()
export class ChatService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly ai: AiProvider,
    private readonly materials: MaterialsService,
  ) {}

  async listSessions(user: AuthUser, materialId: string) {
    await this.materials.get(user, materialId);
    return this.prisma.chatSession.findMany({
      where: { materialId, userId: user.sub },
      orderBy: { createdAt: "desc" },
    });
  }

  async createSession(user: AuthUser, materialId: string) {
    await this.materials.get(user, materialId);
    return this.prisma.chatSession.create({ data: { userId: user.sub, materialId } });
  }

  private async loadSession(user: AuthUser, sessionId: string) {
    const session = await this.prisma.chatSession.findUnique({ where: { id: sessionId } });
    if (!session) throw new NotFoundException("Sesi tidak ditemukan");
    if (session.userId !== user.sub) throw new ForbiddenException();
    return session;
  }

  async getMessages(user: AuthUser, sessionId: string) {
    await this.loadSession(user, sessionId);
    return this.prisma.chatMessage.findMany({
      where: { sessionId },
      orderBy: { createdAt: "asc" },
    });
  }

  /** Kirim pertanyaan; AI menjawab dengan konteks bab terpilih. */
  async sendMessage(user: AuthUser, sessionId: string, question: string, chapterIds?: string[]) {
    const session = await this.loadSession(user, sessionId);
    if (!session.materialId) throw new NotFoundException("Materi sesi tidak ada");

    const { context } = await this.materials.getContext(user, session.materialId, chapterIds);

    const userMsg = await this.prisma.chatMessage.create({
      data: { sessionId, role: "user", konten: question },
    });

    const prev = await this.prisma.chatMessage.findMany({
      where: { sessionId },
      orderBy: { createdAt: "asc" },
      take: 20,
    });
    const history: ChatTurn[] = prev
      .filter((m) => m.role === "user" || m.role === "assistant")
      .slice(-10)
      .map((m) => ({ role: m.role as ChatTurn["role"], konten: m.konten }));

    const { reply } = await this.ai.chat({ question, context, history });

    const assistantMsg = await this.prisma.chatMessage.create({
      data: { sessionId, role: "assistant", konten: reply },
    });

    return { user: userMsg, assistant: assistantMsg };
  }
}
