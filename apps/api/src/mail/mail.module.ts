import { Global, Logger, Module } from "@nestjs/common";
import { MailProvider } from "./mail-provider";
import { SmtpMailProvider } from "./providers/smtp.provider";
import { ConsoleMailProvider } from "./providers/console.provider";

/** Modul email global. SMTP bila SMTP_HOST diisi; jika tidak, cetak ke log. */
@Global()
@Module({
  providers: [
    SmtpMailProvider,
    ConsoleMailProvider,
    {
      provide: MailProvider,
      useFactory: (smtp: SmtpMailProvider, konsol: ConsoleMailProvider): MailProvider => {
        const on = smtp.enabled;
        new Logger("MailModule").log(
          `Email: ${on ? `SMTP ${process.env.SMTP_HOST}:${process.env.SMTP_PORT ?? 1025}` : "konsol (isi SMTP_HOST)"}`,
        );
        return on ? smtp : konsol;
      },
      inject: [SmtpMailProvider, ConsoleMailProvider],
    },
  ],
  exports: [MailProvider],
})
export class MailModule {}
