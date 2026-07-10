"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { confirmVerificationCode, requestVerificationCode } from "@/lib/auth";
import { useSession } from "@/lib/use-session";

const RESEND_SECONDS = 60;

export function VerifyForm() {
  const router = useRouter();
  const params = useSearchParams();
  const { profile } = useSession();

  const email = params.get("email") ?? profile?.email ?? "";
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [pending, setPending] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setInfo("");
    setPending(true);
    const res = await confirmVerificationCode(email, code);
    if (res.ok) {
      router.replace("/app");
      router.refresh();
      return;
    }
    setError(res.message);
    setPending(false);
  }

  async function resend() {
    setError("");
    const res = await requestVerificationCode(email);
    setInfo(res.ok ? "Kode baru sudah dikirim. Cek kotak masukmu." : res.message);
    setCooldown(RESEND_SECONDS);
  }

  return (
    <form className="flex flex-col gap-4" onSubmit={submit}>
      <p className="text-sm text-muted">
        Kami mengirim kode 6 digit ke{" "}
        <span className="font-semibold text-white">{email || "emailmu"}</span>.
      </p>

      <label className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-muted">Kode verifikasi</span>
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

      {error ? (
        <p className="rounded-xl border border-rose-500/40 bg-rose-500/10 px-3 py-2 text-sm text-rose-400">{error}</p>
      ) : null}
      {info ? (
        <p className="rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-400">{info}</p>
      ) : null}

      <button
        type="submit"
        disabled={pending || code.length !== 6}
        className="mt-1 rounded-2xl bg-brand px-5 py-3.5 text-sm font-bold text-white shadow-brand transition enabled:hover:bg-brand-600 disabled:opacity-60"
      >
        {pending ? "Memeriksa…" : "Verifikasi"}
      </button>

      <button
        type="button"
        onClick={resend}
        disabled={cooldown > 0 || !email}
        className="text-sm text-muted transition enabled:hover:text-white disabled:opacity-60"
      >
        {cooldown > 0 ? `Kirim ulang kode dalam ${cooldown} detik` : "Tidak menerima kode? Kirim ulang"}
      </button>
    </form>
  );
}
