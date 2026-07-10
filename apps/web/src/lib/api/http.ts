const BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";
const MODE = process.env.NEXT_PUBLIC_AUTH_MODE ?? "stub";

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

/**
 * Token auth untuk API.
 * - stub  : guard API menerima token apa pun sebagai demo-user → kirim "dev".
 * - local : token JWT sendiri, disimpan di cookie httpOnly (route /api/auth/token).
 * - logto : access token dari sesi Logto (route /api/logto/token).
 * Keduanya di-cache singkat di memori agar tidak memanggil route tiap request.
 */
const TOKEN_URL = MODE === "logto" ? "/api/logto/token" : "/api/auth/token";

let tokenCache: { token: string; exp: number } | null = null;
const TOKEN_TTL_MS = 60_000;

export function clearTokenCache() {
  tokenCache = null;
}

async function authToken(): Promise<string> {
  if (MODE === "stub") return "dev";

  const now = Date.now();
  if (tokenCache && now < tokenCache.exp) return tokenCache.token;

  const res = await fetch(TOKEN_URL, { cache: "no-store" });
  if (!res.ok) {
    tokenCache = null;
    throw new ApiError(401, "Sesi berakhir. Silakan masuk lagi.");
  }
  const { token } = (await res.json()) as { token: string | null };
  if (!token) {
    tokenCache = null;
    throw new ApiError(401, "Sesi berakhir. Silakan masuk lagi.");
  }
  tokenCache = { token, exp: now + TOKEN_TTL_MS };
  return token;
}

export async function apiFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  const isForm = typeof FormData !== "undefined" && init.body instanceof FormData;
  const res = await fetch(BASE + path, {
    ...init,
    headers: {
      // FormData: biarkan browser set multipart boundary sendiri.
      ...(isForm ? {} : { "content-type": "application/json" }),
      authorization: `Bearer ${await authToken()}`,
      ...(init.headers ?? {}),
    },
  });
  if (!res.ok) {
    // token mungkin kedaluwarsa → paksa ambil ulang di percobaan berikutnya
    if (res.status === 401) clearTokenCache();
    const text = await res.text().catch(() => res.statusText);
    throw new ApiError(res.status, text || res.statusText);
  }
  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}
