import { ApiClient } from "@pelajarin/shared";

/**
 * Instance klien API bersama untuk web.
 * getToken sementara null (stub). Saat Logto aktif, ganti dengan pengambilan
 * access token dari sesi Logto.
 */
export const api = new ApiClient({
  baseUrl: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000",
  getToken: () => null,
});
