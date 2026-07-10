import { Injectable, Logger } from "@nestjs/common";
import { createTransport, type Transporter } from "nodemailer";
import { MailProvider, type MailMessage } from "../mail-provider";

/**
 * Pengirim email lewat SMTP standar.
 * - Dev  : MailDev / Mailpit di localhost:1025 (tanpa user/pass).
 * - Prod : Resend / Mailgun / SES — semuanya menyediakan SMTP.
 */
@Injectable()
export class SmtpMailProvider extends MailProvider {
  private readonly logger = new Logger(SmtpMailProvider.name);
  private transporter: Transporter | null = null;

  readonly enabled = !!process.env.SMTP_HOST;

  private get from(): string {
    return process.env.MAIL_FROM || "Pelajarin.ai <no-reply@pelajarin.ai>";
  }

  private get client(): Transporter {
    if (!this.transporter) {
      const user = process.env.SMTP_USER;
      const pass = process.env.SMTP_PASS;
      this.transporter = createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT ?? 1025),
        secure: process.env.SMTP_SECURE === "true",
        // MailDev/Mailpit tidak butuh autentikasi
        ...(user && pass ? { auth: { user, pass } } : {}),
      });
    }
    return this.transporter;
  }

  async send(message: MailMessage): Promise<void> {
    await this.client.sendMail({
      from: this.from,
      to: message.to,
      subject: message.subject,
      text: message.text,
      html: message.html,
    });
    this.logger.log(`Email terkirim ke ${message.to}: ${message.subject}`);
  }
}
