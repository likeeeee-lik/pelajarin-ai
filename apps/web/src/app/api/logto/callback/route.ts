import { redirect } from "next/navigation";
import { handleSignIn } from "@logto/next/server-actions";
import { logtoConfig } from "@/lib/logto";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  await handleSignIn(logtoConfig, searchParams);
  // TODO: cek profile.onboardingCompleted → arahkan ke /onboarding utk user baru.
  redirect("/app");
}
