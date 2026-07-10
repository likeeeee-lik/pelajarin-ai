"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { resetPassword } from "@/lib/auth";

export function ResetForm() {
  const router = useRouter();
  const params = useSearchParams();

  const [email, setEmail] = useState(params.get("email") ?? "");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  const mismatch = confirm.length > 0 && password !== confirm;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (mismatch) return;
    setError("");
    setPending(true);
    const res = await resetPassword(email, code, password);
    if (res.ok) {
      // Reset berhasil = sudah masuk (cookie diset server).
      router.replace("/app");
      router.refresh();
      return;
    }
    setError(res.message);
    setPending(false);
  }

  return (
    <form className="flex flex-col gap-4" onSubmit={submit}>
      <label className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-muted">Email</span>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input-field"
        />
      </label>

      <label className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-muted">Kode dari email</span>
        <input
          required
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={6}
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
          placeholder="000000"
          className="input-field text-center font-mono text-2xl tracking-[0.4em]"
        />
      </label>

      <label className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-muted">Password baru</span>
        <input
          type="password"
          required
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Min. 8 karakter, ada huruf & angka"
          className="input-field"
        />
      </label>

      <label className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-muted">Konfirmasi password baru</span>
        <input
          type="password"
          required
          autoComplete="new-password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          placeholder="Ulangi password"
          className="input-field"
        />
      </label>

      {mismatch ? <p className="text-xs text-red-400">Password tidak sama.</p> : null}
      {error ? (
        <p className="rounded-xl border border-rose-500/40 bg-rose-500/10 px-3 py-2 text-sm text-rose-400">{error}</p>
      ) : null}

      <button
        type="submit"
        disabled={pending || mismatch || code.length !== 6}
        className="mt-1 rounded-2xl bg-brand px-5 py-3.5 text-sm font-bold text-white shadow-brand transition enabled:hover:bg-brand-600 disabled:opacity-60"
      >
        {pending ? "Menyimpan…" : "Atur ulang password"}
      </button>
    </form>
  );
}
