import { cookies } from "next/headers";
import { SESSION_COOKIE, cookieOptions } from "@/lib/auth-cookie";

export const dynamic = "force-dynamic";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

/** Daftar akun baru; langsung masuk (token disimpan di cookie httpOnly). */
export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));

  const res = await fetch(`${API}/auth/register`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
    cache: "no-store",
  });
  const data = (await res.json().catch(() => null)) as
    | { token?: string; user?: unknown; message?: string }
    | null;

  if (!res.ok || !data?.token) {
    return Response.json({ message: data?.message ?? "Gagal mendaftar" }, { status: res.status || 400 });
  }

  (await cookies()).set(SESSION_COOKIE, data.token, cookieOptions);
  return Response.json({ ok: true, user: data.user });
}
