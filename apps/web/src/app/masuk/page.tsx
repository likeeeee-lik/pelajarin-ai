import Link from "next/link";
import { AuthShell } from "@/components/auth/auth-shell";
import { OAuthButtons, OrDivider } from "@/components/auth/oauth-buttons";
import { SignInForm } from "@/components/auth/sign-in-form";

// Mode "local" belum punya OAuth sendiri.
const LOCAL = process.env.NEXT_PUBLIC_AUTH_MODE === "local";

export default function MasukPage() {
  return (
    <AuthShell title="Masuk" subtitle="Lanjutkan belajar dengan AI di Pelajarin.ai">
      {!LOCAL && (
        <>
          <OAuthButtons verb="Masuk" />
          <OrDivider />
        </>
      )}
      <SignInForm />
      <div className="mt-5 flex items-center justify-between text-sm text-muted">
        <Link href="/lupa-password" className="hover:text-white">
          Lupa password?
        </Link>
        <Link href="/daftar" className="font-semibold text-brand hover:text-brand-400">
          Buat akun
        </Link>
      </div>
    </AuthShell>
  );
}
