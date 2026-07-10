import { Suspense } from "react";
import { AuthShell } from "@/components/auth/auth-shell";
import { VerifyForm } from "@/components/auth/verify-form";

export default function VerifikasiPage() {
  return (
    <AuthShell title="Verifikasi email" subtitle="Satu langkah lagi untuk mengaktifkan akunmu">
      <Suspense fallback={<p className="text-sm text-muted">Memuat…</p>}>
        <VerifyForm />
      </Suspense>
    </AuthShell>
  );
}
