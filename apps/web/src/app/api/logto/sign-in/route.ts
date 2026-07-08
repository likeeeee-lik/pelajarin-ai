import { signIn } from "@logto/next/server-actions";
import { LOGTO_CALLBACK, logtoConfig } from "@/lib/logto";

export const dynamic = "force-dynamic";

export async function GET() {
  await signIn(logtoConfig, LOGTO_CALLBACK);
  // signIn menerbitkan redirect ke Logto; baris ini tak terjangkau.
  return new Response(null, { status: 302 });
}
