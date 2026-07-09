"use client";

import { useQuery } from "@tanstack/react-query";
import { ClipboardList, FileText, Layers, Target } from "lucide-react";
import { statsApi } from "@/lib/api/resources";

/** 4 kartu ringkasan di dashboard — hitungan nyata dari DB. */
export function StatCards() {
  const stats = useQuery({ queryKey: ["stats"], queryFn: statsApi.get });
  const s = stats.data;
  const loading = stats.isLoading;

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      <Card
        label="Total Catatan"
        value={s?.materials ?? 0}
        sub={`${s?.files ?? 0} file diunggah`}
        loading={loading}
        icon={<FileText className="h-5 w-5 text-sky-400" />}
        iconBg="bg-sky-400/15"
      />
      <Card
        label="Flashcard"
        value={s?.flashcards ?? 0}
        sub="Kartu dibuat"
        loading={loading}
        icon={<Layers className="h-5 w-5 text-brand" />}
        iconBg="bg-brand/15"
      />
      <Card
        label="Kuis"
        value={s?.quizzes ?? 0}
        sub="Kuis dibuat"
        loading={loading}
        icon={<ClipboardList className="h-5 w-5 text-purple-400" />}
        iconBg="bg-purple-400/15"
      />
      <Card
        label="Prediksi Ujian"
        value={s?.predictions ?? 0}
        sub="Koleksi prediksi"
        loading={loading}
        icon={<Target className="h-5 w-5 text-emerald-400" />}
        iconBg="bg-emerald-400/15"
      />
    </div>
  );
}

function Card({
  label,
  value,
  sub,
  icon,
  iconBg,
  loading,
}: {
  label: string;
  value: number;
  sub: string;
  icon: React.ReactNode;
  iconBg: string;
  loading?: boolean;
}) {
  return (
    <div className="card p-5">
      <div className="flex items-start justify-between">
        <span className="text-sm text-muted">{label}</span>
        <span className={`grid h-9 w-9 place-items-center rounded-xl ${iconBg}`}>{icon}</span>
      </div>
      {loading ? (
        <div className="mt-3 h-8 w-12 animate-pulse rounded bg-ink-500/50" />
      ) : (
        <p className="mt-3 text-2xl font-extrabold">{value}</p>
      )}
      <p className="mt-2 text-xs text-muted">{sub}</p>
    </div>
  );
}
