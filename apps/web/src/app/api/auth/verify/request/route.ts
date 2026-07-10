import { forward } from "../../forward";

export const dynamic = "force-dynamic";

/** Kirim (ulang) kode verifikasi email. */
export const POST = (request: Request) => forward(request, "/auth/verify/request");
