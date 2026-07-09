const BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

/**
 * Token auth untuk API. Mode stub: guard API menerima token apa pun sebagai
 * demo-user, jadi kirim "dev". TODO(logto): ambil access token dari sesi Logto.
 */
function authToken(): string {
  return "dev";
}

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export async function apiFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  const isForm = typeof FormData !== "undefined" && init.body instanceof FormData;
  const res = await fetch(BASE + path, {
    ...init,
    headers: {
      // FormData: biarkan browser set multipart boundary sendiri.
      ...(isForm ? {} : { "content-type": "application/json" }),
      authorization: `Bearer ${authToken()}`,
      ...(init.headers ?? {}),
    },
  });
  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText);
    throw new ApiError(res.status, text || res.statusText);
  }
  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}
