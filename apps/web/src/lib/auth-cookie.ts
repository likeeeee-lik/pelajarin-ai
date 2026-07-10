/** Cookie sesi (httpOnly, diset oleh route /api/auth/*). */
export const SESSION_COOKIE = "pelajarin_token";
export const REFRESH_COOKIE = "pelajarin_refresh";

/**
 * Umur cookie 60 hari — sepadan dengan refresh token.
 * Isi `SESSION_COOKIE` sendiri kedaluwarsa jauh lebih cepat (15 menit); cookie-nya
 * sengaja berumur panjang agar bisa ditukar lewat refresh tanpa memaksa login.
 */
export const SESSION_MAX_AGE = 60 * 24 * 60 * 60;

export const cookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: SESSION_MAX_AGE,
};
