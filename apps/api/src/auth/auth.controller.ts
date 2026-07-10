import { Body, Controller, Post } from "@nestjs/common";
import { AuthService, type LoginDto, type RegisterDto } from "./auth.service";

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
}
