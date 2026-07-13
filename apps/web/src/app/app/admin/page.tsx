"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { BadgeCheck, ChevronLeft, ChevronRight, Loader2, Search, Shield, ShieldAlert } from "lucide-react";
import { adminApi } from "@/lib/api/resources";
import { useSession } from "@/lib/use-session";

const PLAN_LABEL: Record<string, string> = { free: "Free", pro: "Pro", institusi: "Institusi" };

export default function AdminPage() {
  const { profile } = useSession();
  const [q, setQ] = useState("");
  const [cari, setCari] = useState("");
  const [page, setPage] = useState(1);

  const users = useQuery({
    queryKey: ["admin-users", cari, page],
    queryFn: () => adminApi.users(cari, page),
    // Jangan panggil endpoint admin untuk non-admin (akan 403).
    enabled: profile?.role === "admin",
  });

  // Server tetap menolak non-admin (AdminGuard). Ini hanya agar UI-nya jelas.
  if (profile && profile.role !== "admin") {
    return (
      <div className="card grid place-items-center p-12 text-center">
        <ShieldAlert className="h-10 w-10 text-rose-400" />
        <h1 className="mt-4 text-xl font-bold">Akses ditolak</h1>
        <p className="mt-2 text-muted">Halaman ini hanya untuk admin.</p>
      </div>
    );
  }

  const data = users.data;
  const totalHal = data ? Math.max(1, Math.ceil(data.total / data.perPage)) : 1;

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Shield className="h-8 w-8 text-brand" />
          <div>
            <h1 className="text-3xl font-extrabold">Panel Admin</h1>
            <p className="text-sm text-muted">
              {data ? `${data.total} pengguna terdaftar` : "Memuat pengguna…"}
            </p>
          </div>
        </div>
      </header>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          setCari(q);
          setPage(1);
        }}
        className="flex gap-2"
      >
        <div className="flex flex-1 items-center gap-2 rounded-2xl border border-ink-500 bg-ink-700/50 px-4">
          <Search className="h-4 w-4 shrink-0 text-muted" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Cari nama atau email…"
            className="w-full bg-transparent py-3 text-sm outline-none"
          />
        </div>
        <button
          type="submit"
          className="rounded-2xl bg-brand px-5 py-3 text-sm font-bold text-white shadow-brand transition hover:bg-brand-600"
        >
          Cari
        </button>
      </form>

      {users.isLoading ? (
        <div className="card grid place-items-center p-12 text-muted">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      ) : users.isError ? (
        <div className="card p-8 text-center text-sm text-rose-400">
          {users.error instanceof Error ? users.error.message : "Gagal memuat pengguna."}
        </div>
      ) : (
        <div className="card overflow-x-auto p-0">
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="border-b border-ink-500 text-left text-xs uppercase tracking-wide text-muted">
                <th className="px-5 py-3 font-semibold">Pengguna</th>
                <th className="px-5 py-3 font-semibold">Plan</th>
                <th className="px-5 py-3 font-semibold">Catatan</th>
                <th className="px-5 py-3 font-semibold">Prediksi</th>
                <th className="px-5 py-3 font-semibold">Bergabung</th>
              </tr>
            </thead>
            <tbody>
              {data?.rows.map((u) => (
                <tr key={u.id} className="border-b border-ink-500/50 last:border-0">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{u.nama}</span>
                      {u.role === "admin" ? (
                        <span className="rounded-full bg-brand/15 px-2 py-0.5 text-[10px] font-bold text-brand">
                          ADMIN
                        </span>
                      ) : null}
                      {u.emailVerified ? (
                        <BadgeCheck className="h-3.5 w-3.5 text-emerald-400" aria-label="Email terverifikasi" />
                      ) : null}
                    </div>
                    <span className="text-xs text-muted">{u.email}</span>
                  </td>
                  <td className="px-5 py-3">
                    <span className="rounded-full border border-ink-500 px-2.5 py-0.5 text-xs font-semibold text-muted">
                      {PLAN_LABEL[u.plan] ?? u.plan}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-muted">{u.materials}</td>
                  <td className="px-5 py-3 text-muted">{u.predictions}</td>
                  <td className="px-5 py-3 text-muted">
                    {new Date(u.createdAt).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                </tr>
              ))}
              {data?.rows.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-10 text-center text-muted">
                    Tidak ada pengguna yang cocok.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      )}

      {totalHal > 1 ? (
        <div className="flex items-center justify-center gap-3">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
            className="grid h-10 w-10 place-items-center rounded-full border border-ink-500 text-muted enabled:hover:text-white disabled:opacity-30"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="text-sm text-muted">
            {page} / {totalHal}
          </span>
          <button
            type="button"
            disabled={page >= totalHal}
            onClick={() => setPage((p) => p + 1)}
            className="grid h-10 w-10 place-items-center rounded-full border border-ink-500 text-muted enabled:hover:text-white disabled:opacity-30"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      ) : null}

      <p className="text-center text-xs text-muted">
        Panel ini <span className="font-semibold">baca-saja</span>. Admin ditentukan lewat{" "}
        <code className="rounded bg-ink-700 px-1">ADMIN_EMAILS</code> di server — tidak bisa diubah dari
        aplikasi.
      </p>
    </div>
  );
}
