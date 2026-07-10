import { cookies } from "next/headers";
import { REFRESH_COOKIE } from "@/lib/auth-cookie";
import { API, clearSessionCookies, setSessionCookies, type AuthPayload } from "../session";

export const dynamic = "force-dynamic";

/**
 * Tukar refresh token dengan access token baru. Dipanggil lib/api/http.ts
 * saat API membalas 401 — pengguna tidak pernah melihat proses ini.
 */
export async function POST() {
  const refreshToken = (await cookies()).get(REFRESH_COOKIE)?.value;
  if (!refreshToken) return Response.json({ token: null }, { status: 401 });

  const res = await fetch(`${API}/auth/refresh`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ refreshToken }),
    cache: "no-store",
  });
  const data = (await res.json().catch(() => null)) as AuthPayload | null;

  if (!res.ok || !data?.token) {
    // Sesi mati atau dicabut (mis. terdeteksi dipakai ulang) → bersihkan.
    await clearSessionCookies();
    return Response.json({ token: null }, { status: 401 });
  }

  await setSessionCookies(data);
  return Response.json({ token: data.token });
}
