import { signIn } from "@logto/next/server-actions";
import { LOGTO_CALLBACK, logtoConfig } from "@/lib/logto";

export const dynamic = "force-dynamic";

/**
 * Mulai flow sign-in Logto.
 * - `?provider=google|discord` → langsung ke penyedia sosial (directSignIn)
 * - `?first_screen=register`   → buka layar pendaftaran
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const provider = searchParams.get("provider");
  const register = searchParams.get("first_screen") === "register";
  const social = provider === "google" || provider === "discord";

  await signIn(logtoConfig, {
    redirectUri: LOGTO_CALLBACK,
    ...(register ? { firstScreen: "register" as const } : {}),
    ...(social ? { directSignIn: { method: "social" as const, target: provider } } : {}),
  });
  // signIn menerbitkan redirect ke Logto; baris ini tak terjangkau.
  return new Response(null, { status: 302 });
}
