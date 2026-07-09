"use client";

import Link from "next/link";
import { LayoutDashboard } from "lucide-react";
import { useSignedIn } from "@/lib/session";
import { useProfileSettings } from "@/lib/store";

/** Tombol kanan navbar landing: profil (bila sudah masuk) atau "Masuk". */
export function NavAuthButton() {
  const signedIn = useSignedIn();
  const profile = useProfileSettings();

  if (signedIn) {
    return (
      <Link
        href="/app"
        title="Buka Dashboard"
        className="flex items-center gap-2 rounded-2xl border border-ink-500 bg-ink-800/60 py-1.5 pl-1.5 pr-3 text-sm font-semibold transition hover:border-brand/50 hover:bg-ink-700"
      >
        <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-gradient-to-br from-brand to-brand-600 text-xs font-bold text-white">
          {(profile.nama || "U").charAt(0).toUpperCase()}
        </span>
        <span className="hidden max-w-[7rem] truncate sm:inline">{profile.nama || "Akun"}</span>
        <LayoutDashboard className="h-4 w-4 text-muted sm:hidden" />
      </Link>
    );
  }

  return (
    <Link
      href="/masuk"
      className="rounded-2xl bg-brand px-5 py-2.5 text-sm font-bold text-white shadow-brand transition hover:bg-brand-600"
    >
      Masuk
    </Link>
  );
}
