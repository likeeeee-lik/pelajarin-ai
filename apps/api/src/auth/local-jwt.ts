import { SignJWT, jwtVerify } from "jose";
import type { AuthUser } from "./jwt.types";

const ISSUER = "pelajarin";
const AUDIENCE = "pelajarin-api";
/** Umur token. Cukup lama agar user tak sering keluar, cukup pendek agar aman. */
const TTL = "7d";

/** Rahasia penanda tangan. Wajib diisi saat AUTH_MODE=local. */
function secret(): Uint8Array {
  const s = process.env.AUTH_JWT_SECRET;
  if (!s || s.length < 32) {
    throw new Error("AUTH_JWT_SECRET wajib diisi (min. 32 karakter) saat AUTH_MODE=local");
  }
  return new TextEncoder().encode(s);
}

export interface LocalTokenClaims {
  sub: string;
  email: string;
  name: string;
}

export async function signLocalToken(user: LocalTokenClaims): Promise<string> {
  return new SignJWT({ email: user.email, name: user.name })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(user.sub)
    .setIssuer(ISSUER)
    .setAudience(AUDIENCE)
    .setIssuedAt()
    .setExpirationTime(TTL)
    .sign(secret());
}

export async function verifyLocalToken(token: string): Promise<AuthUser> {
  const { payload } = await jwtVerify(token, secret(), {
    issuer: ISSUER,
    audience: AUDIENCE,
  });
  return {
    sub: String(payload.sub),
    email: payload.email as string | undefined,
    name: payload.name as string | undefined,
    picture: undefined,
  };
}
