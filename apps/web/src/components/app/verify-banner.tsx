"use client";

import Link from "next/link";
import { MailWarning } from "lucide-react";
import { useSession } from "@/lib/use-session";

const MODE = process.env.NEXT_PUBLIC_AUTH_MODE ?? "stub";

/** Pengingat verifikasi email. Muncul hanya bila auth lokal & belum terverifikasi. */
export function VerifyBanner() {
  const { profile } = useSession();
  if (MODE !== "local" || !profile || profile.emailVerified) return null;

  return (
    <div className="mb-6 flex flex-wrap items-center gap-3 rounded-2xl border border-amber-500/40 bg-amber-500/10 px-4 py-3">
      <MailWarning className="h-5 w-5 shrink-0 text-amber-400" />
      <p className="min-w-0 flex-1 text-sm text-amber-200">
        Email <span className="font-semibold">{profile.email}</span> belum diverifikasi.
      </p>
      <Link
        href={`/verifikasi?email=${encodeURIComponent(profile.email)}`}
        className="shrink-0 rounded-xl bg-amber-500 px-3.5 py-2 text-sm font-bold text-ink-900 transition hover:bg-amber-400"
      >
        Verifikasi sekarang
      </Link>
    </div>
  );
}
