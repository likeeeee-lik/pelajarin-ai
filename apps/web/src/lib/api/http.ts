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
 * - local : JWT pendek (15 mnt) di cookie httpOnly; diperbarui otomatis lewat
 *           refresh token saat API membalas 401.
 * - logto : access token dari sesi Logto.
 */
const TOKEN_URL = MODE === "logto" ? "/api/logto/token" : "/api/auth/token";
const REFRESH_URL = "/api/auth/refresh";

let tokenCache: { token: string; exp: number } | null = null;
const TOKEN_TTL_MS = 60_000;

export function clearTokenCache() {
  tokenCache = null;
}

async function ambilToken(url: string, init?: RequestInit): Promise<string | null> {
  const res = await fetch(url, { cache: "no-store", ...init });
  if (!res.ok) return null;
  const { token } = (await res.json()) as { token: string | null };
  return token ?? null;
}

async function authToken(): Promise<string> {
  if (MODE === "stub") return "dev";

  const now = Date.now();
  if (tokenCache && now < tokenCache.exp) return tokenCache.token;

  const token = await ambilToken(TOKEN_URL);
  if (!token) {
    tokenCache = null;
    throw new ApiError(401, "Sesi berakhir. Silakan masuk lagi.");
  }
  tokenCache = { token, exp: now + TOKEN_TTL_MS };
  return token;
}

/**
 * Perbarui sesi. Hanya untuk mode local — Logto memperbarui tokennya sendiri.
 * Beberapa permintaan yang gagal bersamaan berbagi satu panggilan refresh.
 */
let refreshInFlight: Promise<string | null> | null = null;

async function refreshSession(): Promise<string | null> {
  if (MODE !== "local") return null;
  if (!refreshInFlight) {
    refreshInFlight = ambilToken(REFRESH_URL, { method: "POST" }).finally(() => {
      refreshInFlight = null;
    });
  }
  const token = await refreshInFlight;
  tokenCache = token ? { token, exp: Date.now() + TOKEN_TTL_MS } : null;
  return token;
}

/**
 * Ambil pesan yang bisa dibaca manusia dari balasan error.
 * Nest membalas `{ message, error, statusCode }` — tanpa ini seluruh JSON
 * mentah muncul di UI (atau tertelan jadi "Coba lagi").
 */
async function errorMessage(res: Response): Promise<string> {
  const text = await res.text().catch(() => "");
  if (text) {
    try {
      const body = JSON.parse(text) as { message?: string | string[] };
      if (Array.isArray(body.message)) return body.message.join(", ");
      if (body.message) return body.message;
    } catch {
      return text;
    }
  }
  return res.statusText || "Terjadi kesalahan";
}

function kirim(path: string, init: RequestInit, token: string): Promise<Response> {
  const isForm = typeof FormData !== "undefined" && init.body instanceof FormData;
  return fetch(BASE + path, {
    ...init,
    headers: {
      // FormData: biarkan browser set multipart boundary sendiri.
      ...(isForm ? {} : { "content-type": "application/json" }),
      authorization: `Bearer ${token}`,
      ...(init.headers ?? {}),
    },
  });
}

export async function apiFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  let res = await kirim(path, init, await authToken());

  // Access token kedaluwarsa (15 mnt) → perbarui diam-diam, ulangi SEKALI.
  // Sekali saja: bila token baru pun ditolak, mengulang lagi hanya berputar.
  if (res.status === 401) {
    clearTokenCache();
    const baru = await refreshSession();
    if (baru) res = await kirim(path, init, baru);
  }

  if (!res.ok) {
    if (res.status === 401) clearTokenCache();
    throw new ApiError(res.status, await errorMessage(res));
  }
  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}
