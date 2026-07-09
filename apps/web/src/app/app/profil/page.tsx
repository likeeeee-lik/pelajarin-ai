"use client";

import { useEffect, useState } from "react";
import {
  BarChart3,
  BookOpen,
  Check,
  ClipboardList,
  CreditCard,
  FileText,
  Mail,
  Rocket,
  Settings,
  Target,
  User,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { MOCK_USER } from "@/lib/mock-user";
import { BAHASA_GENERASI, BAHASA_TAMPILAN, MOCK_SUBSCRIPTION } from "@/lib/mock-profile";
import { ActivityHeatmap } from "@/components/app/profil/activity-heatmap";
import { materialsApi, predictionsApi } from "@/lib/api/resources";
import { saveProfile, useProfileSettings } from "@/lib/store";

export default function ProfilPage() {
  const profile = useProfileSettings();
  const materialsQuery = useQuery({ queryKey: ["materials"], queryFn: materialsApi.list });
  const materials = materialsQuery.data ?? [];
  const predictionsQuery = useQuery({ queryKey: ["predictions"], queryFn: predictionsApi.list });
  const predictions = predictionsQuery.data ?? [];

  const [nama, setNama] = useState(profile.nama);
  const [bahasaTampilan, setBahasaTampilan] = useState(profile.bahasaTampilan);
  const [bahasaGenerasi, setBahasaGenerasi] = useState(profile.bahasaGenerasi);
  const [saved, setSaved] = useState(false);

  // sinkronkan form bila store berubah dari tempat lain
  useEffect(() => {
    setNama(profile.nama);
    setBahasaTampilan(profile.bahasaTampilan);
    setBahasaGenerasi(profile.bahasaGenerasi);
  }, [profile.nama, profile.bahasaTampilan, profile.bahasaGenerasi]);

  const stats = [
    { label: "Total Catatan", value: materials.length, icon: FileText, color: "text-sky-400 bg-sky-400/15" },
    { label: "Flashcard Dibuat", value: 0, icon: BookOpen, color: "text-emerald-400 bg-emerald-400/15" },
    { label: "Kuis Dibuat", value: 0, icon: ClipboardList, color: "text-purple-400 bg-purple-400/15" },
    { label: "Prediksi Ujian", value: predictions.length, icon: Target, color: "text-red-400 bg-red-400/15" },
    { label: "Total File", value: materials.filter((m) => m.tipe !== "note").length, icon: BarChart3, color: "text-brand bg-brand/15" },
  ];

  function simpan() {
    saveProfile({ nama: nama.trim() || "Pengguna", bahasaTampilan, bahasaGenerasi });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="text-3xl font-extrabold">Profil Pengguna</h1>
        <p className="text-sm text-muted">Kelola informasi dan preferensi akun Anda</p>
      </header>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {stats.map((s) => (
          <div key={s.label} className="card p-5 text-center">
            <span className={`mx-auto grid h-11 w-11 place-items-center rounded-xl ${s.color}`}>
              <s.icon className="h-5 w-5" />
            </span>
            <p className="mt-3 text-2xl font-extrabold">{s.value}</p>
            <p className="text-xs text-muted">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="card p-6">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand/15 text-brand">
              <Settings className="h-5 w-5" />
            </span>
            <div>
              <h2 className="font-bold">Pengaturan Profil</h2>
              <p className="text-sm text-muted">Perbarui informasi akun Anda</p>
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-5">
            <Field label="Nama Lengkap" icon={<User className="h-4 w-4 text-brand" />}>
              <input value={nama} onChange={(e) => setNama(e.target.value)} className="input-field" />
            </Field>

            <Field label="Email" icon={<Mail className="h-4 w-4 text-brand" />}>
              <input value={MOCK_USER.email} disabled className="input-field opacity-60" />
              <p className="mt-1 text-xs text-muted">Email terikat dengan akun dan tidak dapat diubah</p>
            </Field>

            <Field label="Bahasa Tampilan">
              <select value={bahasaTampilan} onChange={(e) => setBahasaTampilan(e.target.value)} className="input-field">
                {BAHASA_TAMPILAN.map((b) => (
                  <option key={b.value} value={b.value} className="bg-ink-700">
                    {b.label}
                  </option>
                ))}
              </select>
              <p className="mt-1 text-xs text-muted">Mengatur bahasa antarmuka aplikasi</p>
            </Field>

            <Field label="Bahasa Generasi">
              <select value={bahasaGenerasi} onChange={(e) => setBahasaGenerasi(e.target.value)} className="input-field">
                {BAHASA_GENERASI.map((b) => (
                  <option key={b.value} value={b.value} className="bg-ink-700">
                    {b.label}
                  </option>
                ))}
              </select>
              <p className="mt-1 text-xs text-muted">
                Mengatur bahasa yang digunakan AI saat membuat konten belajar
              </p>
            </Field>

            <button
              type="button"
              onClick={simpan}
              className="flex items-center justify-center gap-2 rounded-2xl bg-brand px-5 py-3.5 font-bold text-white shadow-brand transition hover:bg-brand-600"
            >
              {saved ? (
                <>
                  <Check className="h-5 w-5" /> Tersimpan
                </>
              ) : (
                "Simpan"
              )}
            </button>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-ink-500/60 text-white">
                <CreditCard className="h-5 w-5" />
              </span>
              <div>
                <h2 className="font-bold">Langganan</h2>
                <p className="text-sm text-muted">Status &amp; Penggunaan</p>
              </div>
            </div>
            <span className="rounded-full border border-ink-500 px-3 py-1 text-xs font-semibold text-muted">
              {MOCK_SUBSCRIPTION.plan}
            </span>
          </div>

          <div className="mt-5 flex items-center justify-between rounded-2xl border border-ink-500/60 bg-ink-700/50 px-4 py-3">
            <span className="text-muted">Siklus Tagihan</span>
            <span className="font-semibold">{MOCK_SUBSCRIPTION.siklusTagihan}</span>
          </div>

          <h3 className="mt-5 font-bold">Kuota Penggunaan</h3>
          <div className="mt-3 flex flex-col gap-3">
            {MOCK_SUBSCRIPTION.quotas.map((q) => {
              const pct = q.limit > 0 ? Math.min(100, (q.used / q.limit) * 100) : 100;
              return (
                <div key={q.label} className="rounded-2xl border border-ink-500/60 bg-ink-700/40 p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">{q.label}</span>
                    <span className="text-sm font-bold">
                      {q.used}/{q.limit}
                    </span>
                  </div>
                  <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-ink-500/60">
                    <div className={`h-full rounded-full ${q.color}`} style={{ width: `${pct}%` }} />
                  </div>
                  {q.resetDate ? <p className="mt-2 text-xs text-muted">Atur Ulang: {q.resetDate}</p> : null}
                </div>
              );
            })}
          </div>

          <button
            type="button"
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-yellow-400 to-brand px-5 py-3.5 font-bold text-white shadow-brand transition hover:opacity-95"
          >
            <Rocket className="h-4 w-4" /> Upgrade ke Pro
          </button>
        </div>
      </div>

      <ActivityHeatmap totalAktivitas={0} />
    </div>
  );
}

function Field({
  label,
  icon,
  children,
}: {
  label: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 flex items-center gap-2 text-sm font-medium text-muted">
        {icon}
        {label}
      </span>
      {children}
    </label>
  );
}
