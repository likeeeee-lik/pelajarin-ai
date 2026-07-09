import { Injectable } from "@nestjs/common";
import { StorageProvider } from "../storage-provider";

/** Fallback saat Storage belum dikonfigurasi (tanpa SUPABASE_SERVICE_KEY). */
@Injectable()
export class NoopStorageProvider extends StorageProvider {
  readonly enabled = false;
  async upload(): Promise<void> {
    /* no-op */
  }
  async signedUrl(): Promise<string | null> {
    return null;
  }
}
