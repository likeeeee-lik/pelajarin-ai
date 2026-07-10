import { cookies } from "next/headers";
import { SESSION_COOKIE, cookieOptions } from "@/lib/auth-cookie";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

/**
 * Teruskan permintaan ke API dan salin balasannya.
 * `setCookieOnToken`: bila API mengembalikan token (mis. reset password →
 * langsung masuk), simpan di cookie httpOnly.
 */
export async function forward(
  request: Request,
  path: string,
  opts: { setCookieOnToken?: boolean } = {},
): Promise<Response> {
  const body = await request.json().catch(() => ({}));

  const res = await fetch(`${API}${path}`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
    cache: "no-store",
  });
  const data = (await res.json().catch(() => null)) as
    | { token?: string; message?: string; ok?: boolean }
    | null;

  if (!res.ok) {
    return Response.json(
      { message: data?.message ?? "Terjadi kesalahan. Coba lagi." },
      { status: res.status },
    );
  }

  if (opts.setCookieOnToken && data?.token) {
    (await cookies()).set(SESSION_COOKIE, data.token, cookieOptions);
  }
  return Response.json({ ok: true, message: data?.message });
}
