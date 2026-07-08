import { signOut } from "@logto/next/server-actions";
import { logtoConfig } from "@/lib/logto";

export const dynamic = "force-dynamic";

export async function GET() {
  await signOut(logtoConfig, logtoConfig.baseUrl);
  return new Response(null, { status: 302 });
}
