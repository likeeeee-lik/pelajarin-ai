import { createParamDecorator, type ExecutionContext } from "@nestjs/common";
import type { AuthedRequest, AuthUser } from "./jwt.types";

export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): AuthUser => {
    const req = ctx.switchToHttp().getRequest<AuthedRequest>();
    return req.user as AuthUser;
  },
);
