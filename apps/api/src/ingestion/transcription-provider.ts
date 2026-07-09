/** Kontrak penyedia transkripsi audio/video (Whisper). Swappable via env. */
export abstract class TranscriptionProvider {
  abstract transcribe(buffer: Buffer, filename: string, mimetype: string): Promise<string>;
}
