import { cookies } from "next/headers";
import { SESSION_COOKIE } from "@/lib/auth-cookie";

export const dynamic = "force-dynamic";

/**
 * Jembatan token: komponen klien tak bisa membaca cookie httpOnly, jadi mereka
 * mengambil token untuk memanggil API lewat route ini. Dipakai lib/api/http.ts.
 */
export async function GET() {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return Response.json({ token: null }, { status: 401 });
  return Response.json({ token });
}
