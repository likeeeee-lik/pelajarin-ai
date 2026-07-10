"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signUpWithEmail } from "@/lib/auth";

export function SignUpForm() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const mismatch = form.confirm.length > 0 && form.password !== form.confirm;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (mismatch) return;
    setError("");
    setPending(true);
    const res = await signUpWithEmail({ name: form.name, email: form.email, password: form.password });
    if (res.ok) {
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
        <span className="text-sm font-medium text-muted">Nama</span>
        <input required value={form.name} onChange={set("name")} placeholder="Nama lengkap" autoComplete="name" className="input-field" />
      </label>
      <label className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-muted">Email</span>
        <input type="email" required value={form.email} onChange={set("email")} placeholder="name@example.com" autoComplete="email" className="input-field" />
      </label>
      <label className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-muted">Password</span>
        <input type="password" required value={form.password} onChange={set("password")} placeholder="Min. 8 karakter, ada huruf & angka" autoComplete="new-password" className="input-field" />
      </label>
      <label className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-muted">Konfirmasi password</span>
        <input type="password" required value={form.confirm} onChange={set("confirm")} placeholder="Ulangi password" autoComplete="new-password" className="input-field" />
      </label>

      {mismatch ? <p className="text-xs text-red-400">Password tidak sama.</p> : null}
      {error ? (
        <p className="rounded-xl border border-rose-500/40 bg-rose-500/10 px-3 py-2 text-sm text-rose-400">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending || mismatch}
        className="mt-1 rounded-2xl bg-brand px-5 py-3.5 text-sm font-bold text-white shadow-brand transition enabled:hover:bg-brand-600 enabled:active:translate-y-px disabled:opacity-60"
      >
        {pending ? "Membuat akun…" : "Buat akun"}
      </button>
    </form>
  );
}
