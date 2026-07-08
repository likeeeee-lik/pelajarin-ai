import Link from "next/link";
import { LogoWordmark } from "@/components/logo";

/**
 * Placeholder area setelah login (stub). Dashboard sungguhan menyusul di W3.
 * Halaman ini menandai bahwa flow login (entry → consent → app) berhasil.
 */
export default function AppHome() {
  return (
    <main className="bg-aurora flex min-h-screen flex-col items-center justify-center gap-6 px-4 text-center">
      <LogoWordmark markClass="h-8 w-8" />
      <div>
        <h1 className="text-2xl font-extrabold">Signed in 🎉</h1>
        <p className="mt-2 text-sm text-muted">
          Flow login berhasil (mode stub). Dashboard asli dibuat di tahap W3.
        </p>
      </div>
      <Link href="/" className="text-sm font-semibold text-brand hover:text-brand-400">
        ← Kembali ke entry
      </Link>
    </main>
  );
}
