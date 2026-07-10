import { API, setSessionCookies, type AuthPayload } from "./session";

/**
 * Teruskan permintaan ke API dan salin balasannya.
 * `setCookieOnToken`: bila API mengembalikan token (mis. reset password →
 * langsung masuk), simpan sepasang token di cookie httpOnly.
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
  const data = (await res.json().catch(() => null)) as AuthPayload | null;

  if (!res.ok) {
    return Response.json(
      { message: data?.message ?? "Terjadi kesalahan. Coba lagi." },
      { status: res.status },
    );
  }

  if (opts.setCookieOnToken && data?.token) await setSessionCookies(data);
  return Response.json({ ok: true, message: data?.message });
}
