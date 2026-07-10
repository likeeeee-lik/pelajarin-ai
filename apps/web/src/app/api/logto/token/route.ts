import { getAccessToken, getLogtoContext } from "@logto/next/server-actions";
import { logtoConfig } from "@/lib/logto";

export const dynamic = "force-dynamic";

/**
 * Jembatan token: komponen klien tidak bisa membaca sesi Logto (cookie httpOnly),
 * jadi mereka mengambil access token untuk API NestJS lewat route ini.
 * Dipakai oleh lib/api/http.ts saat NEXT_PUBLIC_AUTH_MODE=logto.
 */
export async function GET() {
  try {
    const { isAuthenticated } = await getLogtoContext(logtoConfig);
    if (!isAuthenticated) {
      return Response.json({ token: null }, { status: 401 });
    }
    const resource = process.env.LOGTO_API_RESOURCE || undefined;
    const token = await getAccessToken(logtoConfig, resource);
    return Response.json({ token });
  } catch {
    return Response.json({ token: null }, { status: 401 });
  }
}
