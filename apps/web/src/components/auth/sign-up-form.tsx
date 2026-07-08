"use client";

import { useState } from "react";
import { signUpWithEmail } from "@/lib/auth";

export function SignUpForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
  });
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const mismatch = form.confirm.length > 0 && form.password !== form.confirm;

  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={(e) => {
        e.preventDefault();
        if (mismatch) return;
        signUpWithEmail({ name: form.name, email: form.email, password: form.password });
      }}
    >
      <label className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-muted">Nama</span>
        <input required value={form.name} onChange={set("name")} placeholder="Nama lengkap" className="input-field" />
      </label>
      <label className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-muted">Email</span>
        <input type="email" required value={form.email} onChange={set("email")} placeholder="name@example.com" className="input-field" />
      </label>
      <label className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-muted">Password</span>
        <input type="password" required value={form.password} onChange={set("password")} placeholder="Minimal 8 karakter" className="input-field" />
      </label>
      <label className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-muted">Konfirmasi password</span>
        <input type="password" required value={form.confirm} onChange={set("confirm")} placeholder="Ulangi password" className="input-field" />
      </label>
      {mismatch ? (
        <p className="text-xs text-red-400">Password tidak sama.</p>
      ) : null}
      <button
        type="submit"
        className="mt-1 rounded-2xl bg-brand px-5 py-3.5 text-sm font-bold text-white shadow-brand transition hover:bg-brand-600 active:translate-y-px"
      >
        Buat akun
      </button>
    </form>
  );
}
