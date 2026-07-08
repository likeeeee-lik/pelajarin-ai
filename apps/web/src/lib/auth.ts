"use client";

/**
 * Lapisan auth web. Dua mode (lihat .env NEXT_PUBLIC_AUTH_MODE):
 * - "stub"  : simulasi flow tanpa server (untuk bangun UI sebelum Logto siap).
 *             Meniru urutan Logto: sign-in → consent → app.
 * - "logto" : redirect ke route Logto asli (di-wire saat kredensial tersedia).
 *
 * Saat pindah ke Logto, cukup ganti implementasi ke SDK @logto/next tanpa
 * mengubah komponen UI.
 */

export type OAuthProvider = "google" | "discord";

const MODE = process.env.NEXT_PUBLIC_AUTH_MODE ?? "stub";

export function isLogtoMode() {
  return MODE === "logto";
}

export function signInWith(provider: OAuthProvider) {
  if (isLogtoMode()) {
    window.location.href = `/api/logto/sign-in?provider=${provider}`;
    return;
  }
  // stub: langsung ke halaman consent seperti flow OIDC
  window.location.href = `/consent?provider=${provider}`;
}

export function signInWithEmail(_email: string, _password: string) {
  if (isLogtoMode()) {
    window.location.href = `/api/logto/sign-in`;
    return;
  }
  window.location.href = `/consent?provider=email`;
}

export function signUpWithEmail(_input: {
  name: string;
  email: string;
  password: string;
}) {
  if (isLogtoMode()) {
    window.location.href = `/api/logto/sign-in?first_screen=register`;
    return;
  }
  window.location.href = `/consent?provider=email&flow=register`;
}

export function completeConsent() {
  if (isLogtoMode()) {
    window.location.href = `/api/logto/callback`;
    return;
  }
  // stub: anggap sukses → arahkan ke placeholder app
  window.location.href = `/app`;
}

export function signOut() {
  window.location.href = isLogtoMode() ? `/api/logto/sign-out` : `/`;
}
