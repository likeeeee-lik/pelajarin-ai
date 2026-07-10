import { Global, Logger, Module } from "@nestjs/common";
import { LogtoAdmin } from "./logto-admin";
import { LogtoManagementProvider } from "./providers/management.provider";
import { NoopLogtoAdmin } from "./providers/noop.provider";

/**
 * Modul identitas Logto (global). Aktif hanya bila kredensial M2M tersedia;
 * jika tidak, memakai noop sehingga aplikasi tetap berjalan (mode stub/dev).
 */
@Global()
@Module({
  providers: [
    LogtoManagementProvider,
    NoopLogtoAdmin,
    {
      provide: LogtoAdmin,
      useFactory: (mgmt: LogtoManagementProvider, noop: NoopLogtoAdmin): LogtoAdmin => {
        const on = mgmt.enabled;
        new Logger("LogtoModule").log(
          `Identitas user: ${on ? "Management API" : "nonaktif (isi LOGTO_M2M_APP_ID/SECRET)"}`,
        );
        return on ? mgmt : noop;
      },
      inject: [LogtoManagementProvider, NoopLogtoAdmin],
    },
  ],
  exports: [LogtoAdmin],
})
export class LogtoModule {}
