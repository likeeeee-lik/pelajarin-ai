"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  BadgeCheck,
  BookOpen,
  Calendar,
  Crown,
  FileText,
  Lightbulb,
  Loader2,
  Lock,
  Sparkles,
} from "lucide-react";
import { predictionsApi } from "@/lib/api/resources";
import type { ExamType, Tingkat } from "@/lib/api/types";

const TIPE_LABEL: Record<ExamType, string> = {
  uts: "UTS",
  uas: "UAS",
  kuis: "Kuis",
  latihan: "Latihan",
};

const KESULITAN_LABEL: Record<Tingkat, string> = { mudah: "Mudah", sedang: "Sedang", sulit: "Sulit" };
const KESULITAN_STYLE: Record<Tingkat, string> = {
  mudah: "bg-emerald-500/15 text-emerald-400",
  sedang: "bg-amber-500/15 text-amber-400",
  sulit: "bg-rose-500/15 text-rose-400",
};
const KESULITAN_BAR: Record<Tingkat, string> = {
  mudah: "bg-emerald-500",
  sedang: "bg-amber-500",
  sulit: "bg-rose-500",
};

export default function PredictionDetailPage() {
  const params = useParams<{ id: string }>();
  const query = useQuery({
    queryKey: ["prediction", params.id],
    queryFn: () => predictionsApi.get(params.id),
    enabled: !!params.id,
  });

  const back = (
    <Link href="/app/latihan-soal" className="flex w-fit items-center gap-2 text-sm text-muted transition hover:text-white">
      <ArrowLeft className="h-4 w-4" /> Kembali ke Latihan Soal
    </Link>
  );

  if (query.isLoading) {
    return (
      <div className="flex flex-col gap-6">
        {back}
        <div className="card grid place-items-center p-12 text-muted">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      </div>
    );
  }

  const item = query.data;
  if (!item) {
    return (
      <div className="flex flex-col gap-6">
        {back}
        <div className="card grid place-items-center p-12 text-center">
          <h1 className="text-xl font-bold">Prediksi tidak ditemukan</h1>
          <p className="mt-2 text-muted">Prediksi ini mungkin sudah dihapus.</p>
        </div>
      </div>
    );
  }

  const questions = item.questions;
  const tanggal = new Date(item.createdAt).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const dist: Record<Tingkat, number> = { mudah: 0, sedang: 0, sulit: 0 };
  for (const q of questions) dist[q.tingkat] = (dist[q.tingkat] ?? 0) + 1;

  return (
    <div className="flex flex-col gap-6">
      {back}

      <header className="flex flex-col gap-4">
        <h1 className="text-3xl font-extrabold">{item.judul}</h1>
        <div className="flex flex-wrap items-center gap-2 text-sm">
          {item.mapel ? (
            <span className="flex items-center gap-1.5 text-muted">
              <BookOpen className="h-4 w-4" /> {item.mapel}
            </span>
          ) : null}
          <span className="flex items-center gap-1.5 text-muted">
            <Calendar className="h-4 w-4" /> {tanggal}
          </span>
          <span className="rounded-lg border border-ink-500 px-2.5 py-1 text-xs font-semibold">
            {TIPE_LABEL[item.tipe] ?? item.tipe}
          </span>
          <span className="flex items-center gap-1.5 rounded-lg border border-ink-500 px-2.5 py-1 text-xs font-semibold text-muted">
            <FileText className="h-3.5 w-3.5" /> {item.fileCount} soal sumber
          </span>
          <span className="flex items-center gap-1.5 rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-400">
            <BadgeCheck className="h-3.5 w-3.5" /> Selesai
          </span>
        </div>
        <span className="flex w-fit items-center gap-2 rounded-xl border border-ink-500 bg-ink-700/40 px-3.5 py-2 text-sm font-semibold text-muted">
          <Lock className="h-4 w-4" /> Terkunci <Crown className="h-4 w-4 text-brand" />
        </span>
      </header>

      <div className="grid gap-6 lg:grid-cols-[1fr_20rem]">
        <div className="flex flex-col gap-4">
          {questions.length === 0 ? (
            <div className="card p-6 text-muted">Belum ada soal prediksi.</div>
          ) : (
            questions.map((q, idx) => (
              <div key={idx} className="card p-5 sm:p-6">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-brand/15 font-bold text-brand">
                    {idx + 1}
                  </span>
                  <span className={`rounded-lg px-2.5 py-1 text-xs font-bold ${KESULITAN_STYLE[q.tingkat]}`}>
                    {KESULITAN_LABEL[q.tingkat]}
                  </span>
                  <span className="rounded-lg border border-ink-500 px-2.5 py-1 text-xs font-semibold">{q.topik}</span>
                </div>

                <p className="mt-4 whitespace-pre-line leading-relaxed text-white/90">{q.pertanyaan}</p>

                {q.opsi && q.opsi.length > 0 ? (
                  <div className="mt-4 flex flex-col gap-2.5">
                    {q.opsi.map((opt, i) => (
                      <div
                        key={i}
                        className="rounded-2xl border border-ink-500/70 bg-ink-700/40 px-4 py-3.5 text-sm transition hover:border-ink-500"
                      >
                        {opt}
                      </div>
                    ))}
                  </div>
                ) : null}
              </div>
            ))
          )}
        </div>

        <aside className="lg:sticky lg:top-6 lg:self-start">
          <div className="card relative overflow-hidden p-5">
            <div className="flex items-center justify-between">
              <h2 className="flex items-center gap-2 font-bold">
                <Lightbulb className="h-5 w-5 text-brand" /> Analisis
              </h2>
              <span className="flex items-center gap-1 rounded-full border border-brand/50 bg-brand/10 px-2 py-0.5 text-xs font-bold text-brand">
                <Crown className="h-3 w-3" /> PRO
              </span>
            </div>

            {/* konten Pro (di-blur) */}
            <div aria-hidden className="pointer-events-none mt-4 select-none blur-sm">
              <p className="text-xs font-bold text-muted">Kunci jawaban &amp; pembahasan</p>
              <div className="mt-2 flex flex-col gap-2">
                {questions.map((q, i) => (
                  <div key={i} className="rounded-lg bg-ink-700/50 px-3 py-2 text-xs">
                    Soal {i + 1}: {q.jawaban ?? "—"}
                  </div>
                ))}
              </div>
              <p className="mt-4 text-xs font-bold text-muted">Distribusi kesulitan</p>
              <div className="mt-2 flex flex-col gap-2">
                {(["mudah", "sedang", "sulit"] as Tingkat[]).map((k) => (
                  <div key={k} className="flex items-center gap-2">
                    <span className="w-14 text-xs text-muted">{KESULITAN_LABEL[k]}</span>
                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-ink-700">
                      <div
                        className={`h-full rounded-full ${KESULITAN_BAR[k]}`}
                        style={{ width: `${questions.length ? (dist[k] / questions.length) * 100 : 0}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* overlay kunci */}
            <div className="absolute inset-0 grid place-items-center bg-ink-800/40 p-5 text-center backdrop-blur-[2px]">
              <div>
                <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-brand/15 text-brand">
                  <Lock className="h-6 w-6" />
                </span>
                <p className="mt-3 text-sm font-semibold">Analisis lengkap tersedia di Pro</p>
                <Link
                  href="/app/upgrade"
                  className="mt-4 inline-flex items-center gap-2 rounded-xl bg-brand px-4 py-2.5 text-sm font-bold text-white shadow-brand transition hover:bg-brand-600"
                >
                  <Crown className="h-4 w-4" /> Tingkatkan
                </Link>
              </div>
            </div>
          </div>

          <p className="mt-3 flex items-start gap-2 px-1 text-xs text-muted">
            <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand" />
            Soal prediksi dihasilkan dari analisis pola {item.fileCount} soal sumber.
          </p>
        </aside>
      </div>
    </div>
  );
}
