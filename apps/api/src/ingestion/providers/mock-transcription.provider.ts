import { Injectable } from "@nestjs/common";
import { TranscriptionProvider } from "../transcription-provider";

@Injectable()
export class MockTranscriptionProvider extends TranscriptionProvider {
  async transcribe(_buffer: Buffer, filename: string): Promise<string> {
    return `[Transkrip contoh untuk "${filename}". Set GROQ_API_KEY untuk transkripsi audio/video nyata (Whisper).]`;
  }
}
