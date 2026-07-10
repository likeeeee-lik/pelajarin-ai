import Link from "next/link";
import { AuthShell } from "@/components/auth/auth-shell";
import { OAuthButtons, OrDivider } from "@/components/auth/oauth-buttons";
import { SignUpForm } from "@/components/auth/sign-up-form";

// Mode "local" belum punya OAuth sendiri.
const LOCAL = process.env.NEXT_PUBLIC_AUTH_MODE === "local";

export default function DaftarPage() {
  return (
    <AuthShell title="Buat akun" subtitle="Mulai belajar dengan AI di Pelajarin.ai">
      {!LOCAL && (
        <>
          <OAuthButtons verb="Daftar" flow="register" />
          <OrDivider />
        </>
      )}
      <SignUpForm />
      <p className="mt-5 text-center text-sm text-muted">
        Sudah punya akun?{" "}
        <Link href="/masuk" className="font-semibold text-brand hover:text-brand-400">
          Masuk
        </Link>
      </p>
    </AuthShell>
  );
}
