import { Injectable } from "@nestjs/common";
import { LogtoAdmin, type LogtoUserIdentity } from "../logto-admin";

/** Dipakai saat kredensial M2M belum diisi (mis. mode stub). */
@Injectable()
export class NoopLogtoAdmin extends LogtoAdmin {
  readonly enabled = false;
  async getUser(): Promise<LogtoUserIdentity | null> {
    return null;
  }
}
