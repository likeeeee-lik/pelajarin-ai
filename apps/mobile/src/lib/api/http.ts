import { ambilAccessToken, ambilRefreshToken, hapusToken, simpanToken } from "./tokens";

/**
 * Ponsel tidak bisa membuka `localhost` milik komputermu. Isi
 * EXPO_PUBLIC_API_URL dengan IP jaringan lokal, mis. http://192.168.1.5:4000
 */
export const BASE = process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:4000";

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

/** Dipanggil saat sesi benar-benar mati, agar UI bisa melempar ke layar masuk. */
let onSesiHabis: (() => void) | null = null;
export function setOnSesiHabis(fn: (() => void) | null) {
  onSesiHabis = fn;
}

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

/** Beberapa permintaan yang gagal bersamaan berbagi satu panggilan refresh. */
let refreshInFlight: Promise<string | null> | null = null;

async function refreshSession(): Promise<string | null> {
  if (!refreshInFlight) {
    refreshInFlight = (async () => {
      const refreshToken = await ambilRefreshToken();
      if (!refreshToken) return null;

      const res = await fetch(`${BASE}/auth/refresh`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      });
      if (!res.ok) {
        // Sesi dicabut / kedaluwarsa / terdeteksi dipakai ulang.
        await hapusToken();
        onSesiHabis?.();
        return null;
      }
      const data = (await res.json()) as { token: string; refreshToken: string };
      await simpanToken(data.token, data.refreshToken);
      return data.token;
    })().finally(() => {
      refreshInFlight = null;
    });
  }
  return refreshInFlight;
}

function kirim(path: string, init: RequestInit, token: string | null): Promise<Response> {
  const isForm = typeof FormData !== "undefined" && init.body instanceof FormData;
  return fetch(BASE + path, {
    ...init,
    headers: {
      ...(isForm ? {} : { "content-type": "application/json" }),
      ...(token ? { authorization: `Bearer ${token}` } : {}),
      ...(init.headers ?? {}),
    },
  });
}

export async function apiFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  let res = await kirim(path, init, await ambilAccessToken());

  // Access token berumur 15 menit → perbarui diam-diam, ulangi SEKALI.
  if (res.status === 401) {
    const baru = await refreshSession();
    if (baru) res = await kirim(path, init, baru);
  }

  if (!res.ok) throw new ApiError(res.status, await errorMessage(res));
  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

/** Endpoint publik (tanpa token). */
export async function apiPost<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(BASE + path, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new ApiError(res.status, await errorMessage(res));
  return (await res.json()) as T;
}
