import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from "@nestjs/common";
import { createRemoteJWKSet, jwtVerify, type JWTVerifyGetKey } from "jose";
import { verifyLocalToken } from "./local-jwt";
import type { AuthedRequest, AuthUser } from "./jwt.types";

type Mode = "local" | "logto" | "stub";

/**
 * Verifikasi access token pada setiap request.
 *
 * Mode dipilih lewat env `AUTH_MODE`:
 * - `local` (default bila AUTH_JWT_SECRET ada): JWT HS256 terbitan API sendiri.
 * - `logto`: JWT diverifikasi via JWKS remote Logto (butuh LOGTO_JWKS_URL/ISSUER).
 * - `stub` : terima token apa pun sebagai demo-user. HANYA untuk dev.
 *
 * KEAMANAN: `stub` ditolak saat NODE_ENV=production → guard gagal-tertutup
 * (semua request 401) alih-alih menerima token apa pun.
 */
@Injectable()
export class JwtAuthGuard implements CanActivate {
  private static announced = false;
  private readonly logger = new Logger(JwtAuthGuard.name);
  private jwks: JWTVerifyGetKey | null = null;

  private get mode(): Mode {
    const raw = process.env.AUTH_MODE;
    let mode: Mode;
    if (raw === "local" || raw === "logto" || raw === "stub") mode = raw;
    else if (process.env.AUTH_JWT_SECRET) mode = "local";
    else if (process.env.LOGTO_JWKS_URL) mode = "logto";
    else mode = "stub";

    if (mode === "stub" && process.env.NODE_ENV === "production") {
      this.announceOnce("AUTH stub diminta di NODE_ENV=production — DITOLAK.", "error");
      // fail-closed: verifikasi lokal akan gagal (tanpa secret) → 401
      return "local";
    }
    this.announceOnce(`AUTH mode: ${mode.toUpperCase()}`, mode === "stub" ? "warn" : "log");
    return mode;
  }

  private announceOnce(msg: string, level: "log" | "warn" | "error") {
    if (JwtAuthGuard.announced) return;
    JwtAuthGuard.announced = true;
    if (level === "error") this.logger.error(msg);
    else if (level === "warn") this.logger.warn(`${msg} — menerima token apa pun (khusus dev).`);
    else this.logger.log(msg);
  }

  private getJwks(): JWTVerifyGetKey {
    if (!this.jwks) {
      this.jwks = createRemoteJWKSet(new URL(process.env.LOGTO_JWKS_URL as string));
    }
    return this.jwks;
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<AuthedRequest>();
    const token = this.extractToken(req);
    if (!token) throw new UnauthorizedException("Missing bearer token");

    const mode = this.mode;

    if (mode === "stub") {
      req.user = this.demoUser();
      return true;
    }

    try {
      req.user = mode === "local" ? await verifyLocalToken(token) : await this.verifyLogto(token);
      return true;
    } catch {
      throw new UnauthorizedException("Invalid token");
    }
  }

  private async verifyLogto(token: string): Promise<AuthUser> {
    const { payload } = await jwtVerify(token, this.getJwks(), {
      issuer: process.env.LOGTO_ISSUER,
      audience: process.env.LOGTO_AUDIENCE || undefined,
    });
    // Access token Logto hanya memuat `sub`; identitas diambil UsersService
    // lewat Management API (lihat src/logto/).
    return {
      sub: String(payload.sub),
      email: payload.email as string | undefined,
      name: payload.name as string | undefined,
      picture: payload.picture as string | undefined,
    };
  }

  private extractToken(req: AuthedRequest): string | null {
    const header = req.headers.authorization;
    if (!header?.startsWith("Bearer ")) return null;
    return header.slice("Bearer ".length).trim() || null;
  }

  /** User tiruan mode stub. Sengaja tanpa email nyata (repo publik). */
  private demoUser(): AuthUser {
    return {
      sub: "demo-user",
      email: "demo@pelajarin.local",
      name: "Demo",
    };
  }
}
