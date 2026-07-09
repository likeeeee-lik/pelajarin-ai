import { Global, Logger, Module } from "@nestjs/common";
import { StorageProvider } from "./storage-provider";
import { SupabaseStorageProvider } from "./providers/supabase-storage.provider";
import { NoopStorageProvider } from "./providers/noop-storage.provider";

@Global()
@Module({
  providers: [
    SupabaseStorageProvider,
    NoopStorageProvider,
    {
      provide: StorageProvider,
      useFactory: (sb: SupabaseStorageProvider, noop: NoopStorageProvider): StorageProvider => {
        const on = !!process.env.SUPABASE_URL && !!process.env.SUPABASE_SERVICE_KEY;
        new Logger("StorageModule").log(`Storage: ${on ? "supabase" : "disabled (isi SUPABASE_SERVICE_KEY)"}`);
        return on ? sb : noop;
      },
      inject: [SupabaseStorageProvider, NoopStorageProvider],
    },
  ],
  exports: [StorageProvider],
})
export class StorageModule {}
