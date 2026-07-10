"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AuthShell } from "@/components/auth/auth-shell";
import { requestPasswordReset } from "@/lib/auth";

export default function LupaPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setPending(true);
    const res = await requestPasswordReset(email);
    if (!res.ok) {
      setError(res.message);
      setPending(false);
      return;
    }
    // Server sengaja membalas sama untuk email terdaftar maupun tidak, jadi kita
    // selalu lanjut ke halaman kode — tanpa memberi tahu akun itu ada atau tidak.
    router.push(`/reset-password?email=${encodeURIComponent(email)}`);
  }

  return (
    <AuthShell title="Lupa password" subtitle="Kami akan mengirim kode untuk mengatur ulang passwordmu">
      <form className="flex flex-col gap-4" onSubmit={submit}>
        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-muted">Email</span>
          <input
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@example.com"
            className="input-field"
          />
        </label>

        {error ? (
          <p className="rounded-xl border border-rose-500/40 bg-rose-500/10 px-3 py-2 text-sm text-rose-400">{error}</p>
        ) : null}

        <button
          type="submit"
          disabled={pending}
          className="mt-1 rounded-2xl bg-brand px-5 py-3.5 text-sm font-bold text-white shadow-brand transition enabled:hover:bg-brand-600 disabled:opacity-60"
        >
          {pending ? "Mengirim…" : "Kirim kode"}
        </button>
      </form>

      <p className="mt-5 text-center text-sm text-muted">
        Ingat passwordmu?{" "}
        <Link href="/masuk" className="font-semibold text-brand hover:text-brand-400">
          Masuk
        </Link>
      </p>
    </AuthShell>
  );
}
