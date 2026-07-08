import { profileSchema, type Profile, type UpdateProfileInput } from "./schemas/user";

export interface ApiClientOptions {
  baseUrl: string;
  /** Dipanggil tiap request untuk mengambil access token (JWT Logto). */
  getToken?: () => string | null | Promise<string | null>;
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

/**
 * Klien API bersama untuk web & mobile. Semua panggilan ke backend NestJS
 * lewat sini agar tipe & auth konsisten di kedua klien.
 */
export class ApiClient {
  constructor(private readonly opts: ApiClientOptions) {}

  private async request<T>(path: string, init: RequestInit = {}): Promise<T> {
    const token = (await this.opts.getToken?.()) ?? null;
    const res = await fetch(`${this.opts.baseUrl}${path}`, {
      ...init,
      headers: {
        "content-type": "application/json",
        ...(token ? { authorization: `Bearer ${token}` } : {}),
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

  async getMe(): Promise<Profile> {
    return profileSchema.parse(await this.request("/me"));
  }

  async updateMe(input: UpdateProfileInput): Promise<Profile> {
    return profileSchema.parse(
      await this.request("/me", { method: "PATCH", body: JSON.stringify(input) }),
    );
  }
}
