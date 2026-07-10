import { Suspense } from "react";
import Link from "next/link";
import { AuthShell } from "@/components/auth/auth-shell";
import { ResetForm } from "@/components/auth/reset-form";

export default function ResetPasswordPage() {
  return (
    <AuthShell title="Atur ulang password" subtitle="Masukkan kode yang kami kirim ke emailmu">
      <Suspense fallback={<p className="text-sm text-muted">Memuat…</p>}>
        <ResetForm />
      </Suspense>
      <p className="mt-5 text-center text-sm text-muted">
        Belum menerima kode?{" "}
        <Link href="/lupa-password" className="font-semibold text-brand hover:text-brand-400">
          Kirim ulang
        </Link>
      </p>
    </AuthShell>
  );
}
