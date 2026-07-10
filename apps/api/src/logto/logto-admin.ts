/** Identitas user yang diambil dari penyedia (Logto). */
export interface LogtoUserIdentity {
  email?: string;
  name?: string;
  picture?: string;
}

/**
 * Kontrak pengambilan identitas user dari Logto.
 *
 * Access token yang sampai ke API HANYA memuat `sub` (dibuktikan dari klaim:
 * aud, client_id, exp, iat, iss, jti, scope, sub) — tanpa email/nama. Menyelipkan
 * klaim lewat "Custom JWT" adalah fitur berbayar (Pro), jadi API mengambilnya
 * sendiri dari Management API Logto (aplikasi M2M gratis di paket Free).
 *
 * Dipakai sebagai token DI Nest (abstract class), sama seperti AiProvider/StorageProvider.
 */
export abstract class LogtoAdmin {
  /** true bila kredensial M2M tersedia. */
  abstract readonly enabled: boolean;
  /** Kembalikan identitas user, atau null bila tak tersedia/gagal. */
  abstract getUser(userId: string): Promise<LogtoUserIdentity | null>;
}
