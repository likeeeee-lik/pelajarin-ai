import { ambilAccessToken, ambilRefreshToken, hapusToken, simpanToken } from "./api/tokens";
import { BASE, apiPost } from "./api/http";

export interface AuthUser {
  id: string;
  nama: string;
  email: string;
  emailVerified: boolean;
}
interface AuthResult {
  token: string;
  refreshToken: string;
  user: AuthUser;
}

export async function masuk(email: string, password: string): Promise<AuthUser> {
  const r = await apiPost<AuthResult>("/auth/login", { email, password });
  await simpanToken(r.token, r.refreshToken);
  return r.user;
}

export async function daftar(nama: string, email: string, password: string): Promise<AuthUser> {
  const r = await apiPost<AuthResult>("/auth/register", { nama, email, password });
  await simpanToken(r.token, r.refreshToken);
  return r.user;
}

/** Cabut sesi di server, lalu bersihkan penyimpanan aman. */
export async function keluar(): Promise<void> {
  const refreshToken = await ambilRefreshToken();
  if (refreshToken) {
    await fetch(`${BASE}/auth/logout`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    }).catch(() => undefined);
  }
  await hapusToken();
}

/** Ada token tersimpan? Belum tentu masih sah — cukup untuk menentukan rute awal. */
export async function adaSesi(): Promise<boolean> {
  return (await ambilAccessToken()) !== null;
}
