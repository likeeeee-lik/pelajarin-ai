import { redirect } from "next/navigation";
import { getAccessToken, handleSignIn } from "@logto/next/server-actions";
import { logtoConfig } from "@/lib/logto";

export const dynamic = "force-dynamic";

/** Tanya API apakah user sudah menyelesaikan onboarding. */
async function onboardingCompleted(): Promise<boolean> {
  try {
    const token = await getAccessToken(logtoConfig, process.env.LOGTO_API_RESOURCE || undefined);
    const base = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";
    const res = await fetch(`${base}/me`, {
      headers: { authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    if (!res.ok) return true; // jangan jebak user di onboarding bila API bermasalah
    const me = (await res.json()) as { onboardingCompleted?: boolean };
    return me.onboardingCompleted ?? true;
  } catch {
    return true;
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  await handleSignIn(logtoConfig, searchParams);
  const done = await onboardingCompleted();
  // redirect() melempar NEXT_REDIRECT — panggil di luar try/catch.
  redirect(done ? "/app" : "/onboarding");
}
