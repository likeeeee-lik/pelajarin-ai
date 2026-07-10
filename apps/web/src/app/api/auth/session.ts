import { cookies } from "next/headers";
import { REFRESH_COOKIE, SESSION_COOKIE, cookieOptions } from "@/lib/auth-cookie";

export const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export interface AuthPayload {
  token?: string;
  refreshToken?: string;
  message?: string;
}

/** Simpan sepasang token ke cookie httpOnly. */
export async function setSessionCookies(data: AuthPayload) {
  const jar = await cookies();
  if (data.token) jar.set(SESSION_COOKIE, data.token, cookieOptions);
  if (data.refreshToken) jar.set(REFRESH_COOKIE, data.refreshToken, cookieOptions);
}

export async function clearSessionCookies() {
  const jar = await cookies();
  jar.delete(SESSION_COOKIE);
  jar.delete(REFRESH_COOKIE);
}

/** Panggil API auth, salin balasannya, simpan token bila ada. */
export async function callAuth(path: string, body: unknown): Promise<Response> {
  const res = await fetch(`${API}${path}`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
    cache: "no-store",
  });
  const data = (await res.json().catch(() => null)) as AuthPayload | null;

  if (!res.ok) {
    return Response.json(
      { message: data?.message ?? "Terjadi kesalahan. Coba lagi." },
      { status: res.status },
    );
  }
  if (data?.token) await setSessionCookies(data);
  return Response.json({ ok: true, message: data?.message });
}
