"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Rocket } from "lucide-react";
import { useSession } from "@/lib/use-session";

/** Sapaan + tanggal hari ini (id-ID) + tombol Tingkatkan Pro. */
export function Greeting() {
  const { profile } = useSession();
  const [tanggal, setTanggal] = useState("");

  useEffect(() => {
    setTanggal(
      new Intl.DateTimeFormat("id-ID", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(new Date()),
    );
  }, []);

  return (
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">
          Halo, {profile?.nama ?? "Pengguna"}! <span className="align-middle">👋</span>
        </h1>
        <p className="mt-1 text-muted">{tanggal || " "}</p>
      </div>
      <Link
        href="/app/upgrade"
        className="flex items-center gap-2 rounded-2xl bg-brand px-5 py-3 text-sm font-bold text-white shadow-brand transition hover:bg-brand-600"
      >
        <Rocket className="h-4 w-4" /> Tingkatkan Pro
      </Link>
    </div>
  );
}
