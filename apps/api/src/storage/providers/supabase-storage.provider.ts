import { Injectable } from "@nestjs/common";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { StorageProvider } from "../storage-provider";

/** Penyimpanan file di Supabase Storage (bucket privat + signed URL). */
@Injectable()
export class SupabaseStorageProvider extends StorageProvider {
  readonly enabled = true;
  private readonly bucket = process.env.SUPABASE_BUCKET ?? "materials";
  private _client?: SupabaseClient;
  private ensured = false;

  private get client(): SupabaseClient {
    if (!this._client) {
      this._client = createClient(
        process.env.SUPABASE_URL as string,
        process.env.SUPABASE_SERVICE_KEY as string,
        { auth: { persistSession: false } },
      );
    }
    return this._client;
  }

  private async ensureBucket() {
    if (this.ensured) return;
    const { data } = await this.client.storage.getBucket(this.bucket);
    if (!data) {
      await this.client.storage.createBucket(this.bucket, { public: false }).catch(() => undefined);
    }
    this.ensured = true;
  }

  async upload(path: string, buffer: Buffer, mime: string): Promise<void> {
    await this.ensureBucket();
    const { error } = await this.client.storage
      .from(this.bucket)
      .upload(path, buffer, { contentType: mime, upsert: true });
    if (error) throw new Error(error.message);
  }

  async signedUrl(path: string, expiresSec = 3600): Promise<string | null> {
    const { data } = await this.client.storage.from(this.bucket).createSignedUrl(path, expiresSec);
    return data?.signedUrl ?? null;
  }
}
