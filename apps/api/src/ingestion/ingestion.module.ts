import { Logger, Module } from "@nestjs/common";
import { TranscriptionProvider } from "./transcription-provider";
import { MockTranscriptionProvider } from "./providers/mock-transcription.provider";
import { GroqTranscriptionProvider } from "./providers/groq-transcription.provider";
import { IngestionService } from "./ingestion.service";

@Module({
  providers: [
    MockTranscriptionProvider,
    GroqTranscriptionProvider,
    {
      provide: TranscriptionProvider,
      useFactory: (mock: MockTranscriptionProvider, groq: GroqTranscriptionProvider): TranscriptionProvider => {
        const useGroq = !!process.env.GROQ_API_KEY;
        new Logger("IngestionModule").log(`Transcription: ${useGroq ? "groq" : "mock"}`);
        return useGroq ? groq : mock;
      },
      inject: [MockTranscriptionProvider, GroqTranscriptionProvider],
    },
    IngestionService,
  ],
  exports: [IngestionService],
})
export class IngestionModule {}
