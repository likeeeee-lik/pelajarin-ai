import { Injectable, Logger } from "@nestjs/common";
import { LogtoAdmin, type LogtoUserIdentity } from "../logto-admin";

interface TokenResponse {
  access_token: string;
  expires_in: number;
}

interface LogtoUserResponse {
  id: string;
  primaryEmail?: string | null;
  username?: string | null;
  name?: string | null;
  avatar?: string | null;
}

/**
 * Ambil identitas user via Management API Logto memakai aplikasi M2M
 * (client_credentials). Token M2M di-cache sampai mendekati kedaluwarsa.
 */
@Injectable()
export class LogtoManagementProvider extends LogtoAdmin {
  private readonly logger = new Logger(LogtoManagementProvider.name);
  private cached: { token: string; exp: number } | null = null;

  readonly enabled = !!process.env.LOGTO_M2M_APP_ID && !!process.env.LOGTO_M2M_APP_SECRET;

  /** `https://xxxx.logto.app/` — diturunkan dari issuer bila tak diset. */
  private get endpoint(): string {
    const raw =
      process.env.LOGTO_ENDPOINT ||
      (process.env.LOGTO_ISSUER ?? "").replace(/\/oidc\/?$/, "");
    return raw.replace(/\/+$/, "");
  }

  /** Indicator resource Management API; default `{endpoint}/api`. */
  private get resource(): string {
    return process.env.LOGTO_MANAGEMENT_API_RESOURCE || `${this.endpoint}/api`;
  }

  private async token(): Promise<string> {
    const now = Date.now();
    if (this.cached && now < this.cached.exp) return this.cached.token;

    const basic = Buffer.from(
      `${process.env.LOGTO_M2M_APP_ID}:${process.env.LOGTO_M2M_APP_SECRET}`,
    ).toString("base64");

    const res = await fetch(`${this.endpoint}/oidc/token`, {
      method: "POST",
      headers: {
        authorization: `Basic ${basic}`,
        "content-type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "client_credentials",
        resource: this.resource,
        scope: "all",
      }),
    });
    if (!res.ok) {
      throw new Error(`Token M2M gagal (${res.status}): ${(await res.text()).slice(0, 200)}`);
    }
    const data = (await res.json()) as TokenResponse;
    // sisakan 60 detik agar tidak dipakai tepat saat kedaluwarsa
    this.cached = { token: data.access_token, exp: now + Math.max(0, data.expires_in - 60) * 1000 };
    return data.access_token;
  }

  async getUser(userId: string): Promise<LogtoUserIdentity | null> {
    if (!this.enabled) return null;
    try {
      const token = await this.token();
      const res = await fetch(`${this.endpoint}/api/users/${encodeURIComponent(userId)}`, {
        headers: { authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        this.logger.warn(`Ambil user ${userId} gagal (${res.status})`);
        return null;
      }
      const u = (await res.json()) as LogtoUserResponse;
      return {
        email: u.primaryEmail ?? undefined,
        name: u.name ?? u.username ?? undefined,
        picture: u.avatar ?? undefined,
      };
    } catch (e) {
      // identitas hanyalah pelengkap — jangan sampai menggagalkan request user
      this.cached = null;
      this.logger.warn(`Management API error: ${(e as Error).message}`);
      return null;
    }
  }
}
