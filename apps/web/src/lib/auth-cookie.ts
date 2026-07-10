/** Nama cookie sesi (httpOnly, diset oleh route /api/auth/*). */
export const SESSION_COOKIE = "pelajarin_token";

/** 7 hari — sepadan dengan umur JWT yang diterbitkan API. */
export const SESSION_MAX_AGE = 7 * 24 * 60 * 60;

export const cookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: SESSION_MAX_AGE,
};
