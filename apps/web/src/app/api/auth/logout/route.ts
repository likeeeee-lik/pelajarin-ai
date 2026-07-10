import { cookies } from "next/headers";
import { REFRESH_COOKIE } from "@/lib/auth-cookie";
import { API, clearSessionCookies } from "../session";

export const dynamic = "force-dynamic";

export async function POST() {
  const refreshToken = (await cookies()).get(REFRESH_COOKIE)?.value;

  // Cabut di server agar token yang mungkin sudah disalin ikut mati.
  if (refreshToken) {
    await fetch(`${API}/auth/logout`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ refreshToken }),
      cache: "no-store",
    }).catch(() => undefined);
  }

  await clearSessionCookies();
  return Response.json({ ok: true });
}
