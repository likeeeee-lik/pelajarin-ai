import { redirect } from "next/navigation";
import { handleSignIn } from "@logto/next/server-actions";
import { logtoConfig } from "@/lib/logto";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  await handleSignIn(logtoConfig, searchParams);
  // Gate onboarding ditangani di AppShell (butuh penanda "pending" dari wizard
  // anonim). Menentukannya di sini menyebabkan loop: user funnel sudah
  // onboarding sebelum daftar, tapi flag DB-nya belum sempat diset.
  redirect("/app");
}
