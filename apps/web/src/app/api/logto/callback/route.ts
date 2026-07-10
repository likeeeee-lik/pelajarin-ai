import { redirect } from "next/navigation";
import { handleSignIn } from "@logto/next/server-actions";
import { LOGTO_CALLBACK, logtoConfig } from "@/lib/logto";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  // Kirim URL callback LENGKAP. Bila hanya searchParams yang dikirim, @logto/next
  // menyusun `${baseUrl}/callback` — beda dari redirect_uri kita
  // (`${baseUrl}/api/logto/callback`) → redirect_uri_mismatched.
  // Memakai LOGTO_CALLBACK (bukan request.url) menjamin sama persis dengan
  // yang dipakai saat signIn, juga di balik proxy/HTTPS.
  await handleSignIn(logtoConfig, new URL(`${LOGTO_CALLBACK}?${searchParams.toString()}`));
  // Gate onboarding ditangani di AppShell (butuh penanda "pending" dari wizard
  // anonim). Menentukannya di sini menyebabkan loop: user funnel sudah
  // onboarding sebelum daftar, tapi flag DB-nya belum sempat diset.
  redirect("/app");
}
