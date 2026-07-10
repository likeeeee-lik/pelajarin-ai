import { forward } from "../forward";

export const dynamic = "force-dynamic";

/** Reset berhasil = terbukti menguasai inbox → langsung masuk (set cookie). */
export const POST = (request: Request) => forward(request, "/auth/password/reset", { setCookieOnToken: true });
