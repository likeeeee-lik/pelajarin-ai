import { Global, Logger, Module } from "@nestjs/common";
import { AiProvider } from "./ai-provider";
import { MockAiProvider } from "./providers/mock.provider";
import { ClaudeAiProvider } from "./providers/claude.provider";

/**
 * Modul AI global. Provider dipilih via env AI_PROVIDER (default "mock").
 * "claude" hanya aktif bila ANTHROPIC_API_KEY tersedia; jika tidak, fallback ke mock.
 */
@Global()
@Module({
  providers: [
    MockAiProvider,
    ClaudeAiProvider,
    {
      provide: AiProvider,
      useFactory: (mock: MockAiProvider, claude: ClaudeAiProvider): AiProvider => {
        const useClaude = process.env.AI_PROVIDER === "claude" && !!process.env.ANTHROPIC_API_KEY;
        new Logger("AiModule").log(`AI provider: ${useClaude ? "claude" : "mock"}`);
        return useClaude ? claude : mock;
      },
      inject: [MockAiProvider, ClaudeAiProvider],
    },
  ],
  exports: [AiProvider],
})
export class AiModule {}
