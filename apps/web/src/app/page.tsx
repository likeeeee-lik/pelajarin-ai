import Link from "next/link";
import { LogoMark } from "@/components/logo";
import { ButtonLink } from "@/components/ui/button";
import { EmailSignupButton } from "@/components/auth/entry-actions";
import { OAuthButtons, OrDivider } from "@/components/auth/oauth-buttons";

/** Halaman entry (mirip splash daftar app): brand + pilihan daftar/masuk. */
export default function EntryPage() {
  return (
    <main className="bg-aurora flex min-h-screen flex-col items-center justify-center px-4 py-16">
      <div className="w-full max-w-md text-center">
        <div className="mb-6 flex flex-col items-center">
          <LogoMark className="h-16 w-16 text-white" />
          <h1 className="mt-4 text-4xl font-extrabold tracking-tight">
            pelajarin.ai
          </h1>
        </div>

        <h2 className="text-xl font-bold">Buat akun baru</h2>
        <p className="mt-1 text-sm text-muted">
          Mulai belajar dengan AI di Pelajarin.ai
        </p>

        <div className="mt-8 text-left">
          <OAuthButtons verb="Daftar" flow="register" />
          <OrDivider />
          <EmailSignupButton />
        </div>

        <Link
          href="/masuk"
          className="mt-6 inline-flex items-center gap-1 text-sm font-bold text-brand hover:text-brand-400"
        >
          <span aria-hidden>‹</span> Sudah punya akun? Masuk
        </Link>
      </div>

      <p className="mt-12 text-xs text-muted/70">
        Platform belajar AI untuk siswa · CV Triputra Consulting
      </p>
    </main>
  );
}
