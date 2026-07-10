import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from "@nestjs/common";
import { createRemoteJWKSet, jwtVerify, type JWTVerifyGetKey } from "jose";
import type { AuthedRequest, AuthUser } from "./jwt.types";

/**
 * Verifikasi access token (JWT) yang diterbitkan Logto.
 *
 * Mode:
 * - Produksi/Logto: set LOGTO_JWKS_URL + LOGTO_ISSUER (+ opsional LOGTO_AUDIENCE).
 *   Token diverifikasi via JWKS remote Logto.
 * - Dev/stub: jika AUTH_MODE=stub atau JWKS belum diset, terima token demo
 *   `Bearer dev` dan kembalikan user demo. Memudahkan bangun UI sebelum
 *   tenant Logto siap.
 *
 * KEAMANAN: mode stub DILARANG saat NODE_ENV=production. Tanpa JWKS di produksi
 * guard gagal-tertutup (semua request 401) alih-alih menerima token apa pun.
 */
@Injectable()
export class JwtAuthGuard implements CanActivate {
  private static warned = false;
  private static claimsLogged = false;
  private readonly logger = new Logger(JwtAuthGuard.name);
  private jwks: JWTVerifyGetKey | null = null;

  private get isStub(): boolean {
    const wantsStub = process.env.AUTH_MODE === "stub" || !process.env.LOGTO_JWKS_URL;
    if (!wantsStub) return false;
    if (process.env.NODE_ENV === "production") {
      if (!JwtAuthGuard.warned) {
        JwtAuthGuard.warned = true;
        this.logger.error(
          "AUTH stub diminta di NODE_ENV=production — DITOLAK. Set LOGTO_JWKS_URL + LOGTO_ISSUER.",
        );
      }
      return false; // fail-closed: token akan diverifikasi (dan gagal) → 401
    }
    if (!JwtAuthGuard.warned) {
      JwtAuthGuard.warned = true;
      this.logger.warn("AUTH mode: STUB — menerima token apa pun sebagai demo-user (khusus dev).");
    }
    return true;
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

    if (this.isStub) {
      req.user = this.demoUser(token);
      return true;
    }

    try {
      const { payload } = await jwtVerify(token, this.getJwks(), {
        issuer: process.env.LOGTO_ISSUER,
        audience: process.env.LOGTO_AUDIENCE || undefined,
      });
      // DEBUG sementara: cetak NAMA klaim saja (bukan nilainya) sekali saja.
      if (!JwtAuthGuard.claimsLogged) {
        JwtAuthGuard.claimsLogged = true;
        this.logger.log(`Klaim access token: ${Object.keys(payload).sort().join(", ")}`);
      }
      req.user = {
        sub: String(payload.sub),
        email: payload.email as string | undefined,
        name: payload.name as string | undefined,
        picture: payload.picture as string | undefined,
      };
      return true;
    } catch {
      throw new UnauthorizedException("Invalid token");
    }
  }

  private extractToken(req: AuthedRequest): string | null {
    const header = req.headers.authorization;
    if (!header?.startsWith("Bearer ")) return null;
    return header.slice("Bearer ".length).trim() || null;
  }

  private demoUser(_token: string): AuthUser {
    return {
      sub: "demo-user",
      email: "sefinalika@gmail.com",
      name: "Likae",
      picture: null as unknown as string,
    };
  }
}
