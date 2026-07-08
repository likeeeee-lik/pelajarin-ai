import type { LogtoNextConfig } from "@logto/next";

/**
 * Konfigurasi Logto (OIDC) untuk web. Dibaca dari env server-side
 * (apps/web/.env.local). Hanya dipakai saat NEXT_PUBLIC_AUTH_MODE=logto.
 */
export const logtoConfig: LogtoNextConfig = {
  endpoint: process.env.LOGTO_ENDPOINT ?? "",
  appId: process.env.LOGTO_APP_ID ?? "",
  appSecret: process.env.LOGTO_APP_SECRET ?? "",
  baseUrl: process.env.LOGTO_BASE_URL ?? "http://localhost:3000",
  cookieSecret: process.env.LOGTO_COOKIE_SECRET ?? "",
  cookieSecure: process.env.NODE_ENV === "production",
  scopes: ["openid", "profile", "email", "offline_access"],
  // Resource = audience API kita, agar bisa minta access token untuk NestJS.
  resources: process.env.LOGTO_API_RESOURCE ? [process.env.LOGTO_API_RESOURCE] : [],
};

/** URL callback yang harus didaftarkan sebagai Redirect URI di Logto. */
export const LOGTO_CALLBACK = `${logtoConfig.baseUrl}/api/logto/callback`;
