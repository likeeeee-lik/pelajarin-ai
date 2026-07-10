"use client";

/**
 * Lapisan auth web (lihat .env NEXT_PUBLIC_AUTH_MODE):
 * - "local" : auth sendiri (email + password). Form mengirim ke route
 *             /api/auth/*, token disimpan di cookie httpOnly oleh server Next.
 * - "logto" : redirect ke Logto (OIDC). Dipertahankan agar bisa dipakai lagi.
 * - "stub"  : simulasi tanpa server, untuk membangun UI.
 */

import { clearSession } from "./session";
import { clearTokenCache } from "./api/http";

export type OAuthProvider = "google" | "discord";

const MODE = process.env.NEXT_PUBLIC_AUTH_MODE ?? "stub";

export function isLogtoMode() {
  return MODE === "logto";
}
export function isLocalMode() {
  return MODE === "local";
}

/** Hasil operasi auth; `message` diisi saat gagal agar form bisa menampilkannya. */
export type AuthOutcome = { ok: true } | { ok: false; message: string };

async function postAuth(path: string, body: unknown): Promise<AuthOutcome> {
  try {
    const res = await fetch(path, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const data = (await res.json().catch(() => null)) as { message?: string } | null;
      return { ok: false, message: data?.message ?? "Terjadi kesalahan. Coba lagi." };
    }
    clearTokenCache(); // token baru → jangan pakai cache lama
    return { ok: true };
  } catch {
    return { ok: false, message: "Tidak dapat terhubung ke server." };
  }
}

export function signInWith(provider: OAuthProvider, flow?: "register") {
  if (isLogtoMode()) {
    const screen = flow === "register" ? "&first_screen=register" : "";
    window.location.href = `/api/logto/sign-in?provider=${provider}${screen}`;
    return;
  }
  // stub: langsung ke halaman consent seperti flow OIDC
  const q = flow ? `&flow=${flow}` : "";
  window.location.href = `/consent?provider=${provider}${q}`;
}

export async function signInWithEmail(email: string, password: string): Promise<AuthOutcome> {
  if (isLogtoMode()) {
    window.location.href = `/api/logto/sign-in`;
    return { ok: true };
  }
  if (!isLocalMode()) {
    window.location.href = `/consent?provider=email`;
    return { ok: true };
  }
  return postAuth("/api/auth/login", { email, password });
}

export async function signUpWithEmail(input: {
  name: string;
  email: string;
  password: string;
}): Promise<AuthOutcome> {
  if (isLogtoMode()) {
    window.location.href = `/api/logto/sign-in?first_screen=register`;
    return { ok: true };
  }
  if (!isLocalMode()) {
    window.location.href = `/consent?provider=email&flow=register`;
    return { ok: true };
  }
  return postAuth("/api/auth/register", {
    nama: input.name,
    email: input.email,
    password: input.password,
  });
}

export function completeConsent() {
  // Consent hanya ada di mode stub (Logto meng-host consent-nya sendiri).
  window.location.href = `/app`;
}

export async function signOut() {
  if (isLogtoMode()) {
    window.location.href = `/api/logto/sign-out`;
    return;
  }
  if (isLocalMode()) {
    await fetch("/api/auth/logout", { method: "POST" }).catch(() => {});
    clearTokenCache();
  }
  clearSession(); // penanda stub
  window.location.href = `/`;
}
