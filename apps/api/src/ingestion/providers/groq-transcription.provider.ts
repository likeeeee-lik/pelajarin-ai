import { Injectable } from "@nestjs/common";
import { TranscriptionProvider } from "../transcription-provider";

/** Transkripsi via Groq (OpenAI-compatible Whisper endpoint). */
@Injectable()
export class GroqTranscriptionProvider extends TranscriptionProvider {
  async transcribe(buffer: Buffer, filename: string, mimetype: string): Promise<string> {
    const form = new FormData();
    form.append("file", new Blob([new Uint8Array(buffer)], { type: mimetype || "application/octet-stream" }), filename);
    form.append("model", process.env.GROQ_MODEL ?? "whisper-large-v3");
    form.append("response_format", "text");

    const res = await fetch("https://api.groq.com/openai/v1/audio/transcriptions", {
      method: "POST",
      headers: { authorization: `Bearer ${process.env.GROQ_API_KEY ?? ""}` },
      body: form,
    });
    if (!res.ok) throw new Error(`Groq transcribe ${res.status}: ${await res.text()}`);
    return (await res.text()).trim();
  }
}
