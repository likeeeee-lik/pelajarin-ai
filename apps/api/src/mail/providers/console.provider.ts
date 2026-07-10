import { Injectable, Logger } from "@nestjs/common";
import { MailProvider, type MailMessage } from "../mail-provider";

/**
 * Cadangan saat SMTP_HOST belum diisi: email dicetak ke log, bukan dikirim.
 * Fitur tetap berjalan (kode OTP terlihat di terminal) tanpa mail server.
 */
@Injectable()
export class ConsoleMailProvider extends MailProvider {
  private readonly logger = new Logger(ConsoleMailProvider.name);
  readonly enabled = false;

  async send(message: MailMessage): Promise<void> {
    this.logger.warn(
      `SMTP tidak diset — email TIDAK dikirim.\n` +
        `  Kepada : ${message.to}\n` +
        `  Subjek : ${message.subject}\n` +
        `  Isi    : ${message.text}`,
    );
  }
}
