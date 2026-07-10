export interface MailMessage {
  to: string;
  subject: string;
  html: string;
  text: string;
}

/**
 * Kontrak pengiriman email. Implementasi SMTP bekerja untuk MailDev/Mailpit
 * (dev) maupun Resend/Mailgun/SES (produksi) — cukup ganti env, bukan kode.
 * Dipakai sebagai token DI Nest (abstract class), sama seperti AiProvider.
 */
export abstract class MailProvider {
  abstract readonly enabled: boolean;
  abstract send(message: MailMessage): Promise<void>;
}
