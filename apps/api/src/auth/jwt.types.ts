import type { Request } from "express";

/** User terverifikasi yang ditempel ke request oleh JwtAuthGuard. */
export interface AuthUser {
  /** subject (Logto user id) */
  sub: string;
  email?: string;
  name?: string;
  picture?: string;
}

export interface AuthedRequest extends Request {
  user?: AuthUser;
}
