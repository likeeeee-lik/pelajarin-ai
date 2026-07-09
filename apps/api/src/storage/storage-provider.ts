/** Kontrak penyimpanan file. Swappable: Supabase Storage / Noop (nonaktif). */
export abstract class StorageProvider {
  abstract readonly enabled: boolean;
  abstract upload(path: string, buffer: Buffer, mime: string): Promise<void>;
  abstract signedUrl(path: string, expiresSec?: number): Promise<string | null>;
}
