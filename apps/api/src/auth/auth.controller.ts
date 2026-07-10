import { Body, Controller, Post } from "@nestjs/common";
import {
  AuthService,
  type LoginDto,
  type RegisterDto,
  type ResetDto,
  type VerifyDto,
} from "./auth.service";

/** Auth lokal (email + password). Publik — tidak dijaga JwtAuthGuard. */
@Controller("auth")
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post("register")
  register(@Body() dto: RegisterDto) {
    return this.auth.register(dto);
  }

  @Post("login")
  login(@Body() dto: LoginDto) {
    return this.auth.login(dto);
  }

  /** Tukar refresh token dengan sepasang token baru. Token lama langsung hangus. */
  @Post("refresh")
  refresh(@Body() dto: { refreshToken?: string }) {
    return this.auth.refreshSession(dto.refreshToken ?? "");
  }

  /** Keluar dari perangkat ini (mencabut refresh token-nya). */
  @Post("logout")
  logout(@Body() dto: { refreshToken?: string }) {
    return this.auth.logout(dto.refreshToken);
  }

  /** Kirim (ulang) kode verifikasi email. */
  @Post("verify/request")
  requestVerification(@Body() dto: { email?: string }) {
    return this.auth.requestVerification(dto.email ?? "");
  }

  @Post("verify/confirm")
  confirmVerification(@Body() dto: VerifyDto) {
    return this.auth.confirmVerification(dto);
  }

  /** Minta kode reset. Balasan selalu sama, terdaftar atau tidak. */
  @Post("password/forgot")
  forgotPassword(@Body() dto: { email?: string }) {
    return this.auth.forgotPassword(dto.email ?? "");
  }

  @Post("password/reset")
  resetPassword(@Body() dto: ResetDto) {
    return this.auth.resetPassword(dto);
  }
}
