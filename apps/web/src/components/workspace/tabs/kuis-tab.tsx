"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Check, ClipboardList, HelpCircle, Loader2, Plus, RotateCcw, Sparkles, X } from "lucide-react";
import { quizzesApi } from "@/lib/api/resources";
import type { Material, Quiz, QuizQuestion, QuizType } from "@/lib/api/types";
import { ChapterPicker } from "../chapter-picker";

const TYPES: { value: QuizType; label: string }[] = [
  { value: "pilihan_ganda", label: "Pilihan Ganda" },
  { value: "benar_salah", label: "Benar/Salah" },
  { value: "isian", label: "Isian" },
];
const COUNTS = [
  { n: 5, pro: false },
  { n: 15, pro: true },
  { n: 20, pro: true },
  { n: 30, pro: true },
];

const norm = (s: string) => s.trim().toLowerCase();
const tanggal = (iso: string) =>
  new Date(iso).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });

type Phase = "list" | "config" | "playing" | "result";

export function KuisTab({ material }: { material: Material }) {
  const qc = useQueryClient();
  const list = useQuery({ queryKey: ["quizzes", material.id], queryFn: () => quizzesApi.list(material.id) });

  const [phase, setPhase] = useState<Phase | null>(null);
  const [types, setTypes] = useState<QuizType[]>(["pilihan_ganda"]);
  const [count, setCount] = useState(5);
  const [chapterIds, setChapterIds] = useState<string[]>(material.chapters.map((c) => c.id));
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [answers, setAnswers] = useState<Record<number, string>>({});

  const gen = useMutation({
    mutationFn: () => quizzesApi.generate(material.id, { count, types, chapterIds }),
    onSuccess: (q) => {
      qc.invalidateQueries({ queryKey: ["quizzes", material.id] });
      mulai(q);
    },
  });

  const simpanSkor = useMutation({
    mutationFn: (skor: number) => quizzesApi.saveScore(quiz!.id, skor),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["quizzes", material.id] }),
  });

  /** Kerjakan kuis dari data yang SUDAH ada — tanpa panggilan AI. */
  function mulai(q: Quiz) {
    setQuiz(q);
    setAnswers({});
    setPhase("playing");
  }

  const quizzes = list.data ?? [];
  // Fase awal: ada riwayat → tampilkan daftar; belum ada → langsung konfigurasi.
  const fase: Phase = phase ?? (quizzes.length > 0 ? "list" : "config");

  const questions: QuizQuestion[] = quiz?.soalJson.questions ?? [];
  const score = questions.reduce((s, q, i) => (norm(answers[i] ?? "") === norm(q.jawaban) ? s + 1 : s), 0);

  const toggleType = (t: QuizType) =>
    setTypes((prev) => (prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]));

  if (list.isLoading) {
    return <div className="grid h-[50vh] place-items-center text-muted"><Loader2 className="h-6 w-6 animate-spin" /></div>;
  }

  // ── Daftar riwayat ────────────────────────────────────────
  if (fase === "list") {
    return (
      <div className="mx-auto max-w-2xl">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold">Kuis</h2>
            <p className="text-sm text-muted">{quizzes.length} kuis tersimpan · kerjakan ulang tanpa biaya AI</p>
          </div>
          <button
            type="button"
            onClick={() => setPhase("config")}
            className="flex items-center gap-2 rounded-xl bg-brand px-4 py-2.5 text-sm font-bold text-white shadow-brand transition hover:bg-brand-600"
          >
            <Plus className="h-4 w-4" /> Kuis Baru
          </button>
        </div>

        <div className="flex flex-col gap-3">
          {quizzes.map((q) => {
            const total = q.soalJson.questions.length;
            return (
              <div key={q.id} className="card flex items-center gap-4 p-4">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brand/15 text-brand">
                  <ClipboardList className="h-5 w-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold">{total} soal</p>
                  <p className="text-xs text-muted">
                    {tanggal(q.createdAt)}
                    {q.skor !== null ? ` · skor terakhir ${q.skor}/${total}` : " · belum pernah dikerjakan"}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => mulai(q)}
                  className="shrink-0 rounded-xl border border-ink-500 px-4 py-2 text-sm font-semibold transition hover:bg-ink-600"
                >
                  Kerjakan
                </button>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // ── Konfigurasi (memanggil AI) ────────────────────────────
  if (fase === "config") {
    return (
      <div className="card mx-auto max-w-lg p-8">
        <div className="text-center">
          <span className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-brand/15 text-brand"><HelpCircle className="h-8 w-8" /></span>
          <h2 className="mt-4 text-2xl font-extrabold">Buat Kuis</h2>
        </div>

        <div className="mt-6">
          <p className="mb-2 text-sm font-semibold text-muted">Jenis Soal</p>
          <div className="grid grid-cols-3 gap-2">
            {TYPES.map((t) => (
              <button key={t.value} type="button" onClick={() => toggleType(t.value)} className={`rounded-xl border p-2.5 text-xs font-semibold transition ${types.includes(t.value) ? "border-brand bg-brand/10 text-brand" : "border-ink-500/70 bg-ink-700/40"}`}>
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-5">
          <p className="mb-2 text-sm font-semibold text-muted">Jumlah Soal</p>
          <div className="grid grid-cols-4 gap-2">
            {COUNTS.map((c) => (
              <button key={c.n} type="button" onClick={() => setCount(c.n)} className={`relative rounded-xl border p-3 transition ${count === c.n ? "border-brand bg-brand/10 text-brand" : "border-ink-500/70 bg-ink-700/40"}`}>
                {c.pro ? <span className="absolute -top-2 right-1 rounded-full bg-brand px-1.5 py-0.5 text-[9px] font-bold text-white">PRO</span> : null}
                <p className="text-lg font-extrabold">{c.n}</p>
                <p className="text-[10px] text-muted">soal</p>
              </button>
            ))}
          </div>
        </div>

        <div className="mt-5"><ChapterPicker chapters={material.chapters} selected={chapterIds} onChange={setChapterIds} /></div>

        <p className="mt-4 flex items-center gap-2 text-xs text-muted">
          <Sparkles className="h-3.5 w-3.5 text-brand" /> Membuat kuis baru memanggil AI. Kuis lama tetap tersimpan.
        </p>

        <button type="button" onClick={() => gen.mutate()} disabled={gen.isPending || types.length === 0 || chapterIds.length === 0} className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl bg-brand px-6 py-3.5 font-bold text-white shadow-brand disabled:opacity-50">
          {gen.isPending ? <Loader2 className="h-5 w-5 animate-spin" /> : null} Mulai Quiz ({count} soal)
        </button>

        {gen.isError ? (
          <p className="mt-3 rounded-xl border border-rose-500/40 bg-rose-500/10 px-3 py-2 text-sm text-rose-400">
            {gen.error instanceof Error ? gen.error.message : "Gagal membuat kuis."}
          </p>
        ) : null}

        {quizzes.length > 0 ? (
          <button type="button" onClick={() => setPhase("list")} className="mt-3 w-full text-sm text-muted transition hover:text-white">
            Kembali ke daftar kuis
          </button>
        ) : null}
      </div>
    );
  }

  // ── Mengerjakan / hasil ───────────────────────────────────
  const reviewing = fase === "result";
  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-bold">Kuis</h2>
        {reviewing ? (
          <span className="rounded-full bg-brand/15 px-3 py-1 font-bold text-brand">Skor {score}/{questions.length}</span>
        ) : null}
        <div className="flex items-center gap-2">
          {reviewing ? (
            <button type="button" onClick={() => { setAnswers({}); setPhase("playing"); }} className="flex items-center gap-2 rounded-xl border border-ink-500 px-4 py-2 text-sm font-semibold hover:bg-ink-600">
              <RotateCcw className="h-4 w-4" /> Kerjakan Ulang
            </button>
          ) : null}
          <button type="button" onClick={() => setPhase("list")} className="rounded-xl border border-ink-500 px-4 py-2 text-sm font-semibold hover:bg-ink-600">
            Daftar Kuis
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {questions.map((q, i) => {
          const opsi = q.tipe === "benar_salah" ? ["Benar", "Salah"] : q.opsi ?? [];
          const correct = norm(answers[i] ?? "") === norm(q.jawaban);
          return (
            <div key={i} className="card p-5">
              <p className="font-semibold">{i + 1}. {q.pertanyaan}</p>
              <div className="mt-3 flex flex-col gap-2">
                {q.tipe === "isian" ? (
                  <input
                    value={answers[i] ?? ""}
                    disabled={reviewing}
                    onChange={(e) => setAnswers((a) => ({ ...a, [i]: e.target.value }))}
                    placeholder="Jawaban..."
                    className="input-field"
                  />
                ) : (
                  opsi.map((o) => {
                    const picked = answers[i] === o;
                    const isAnswer = norm(o) === norm(q.jawaban);
                    const cls = reviewing
                      ? isAnswer ? "border-emerald-500 bg-emerald-500/10" : picked ? "border-red-500 bg-red-500/10" : "border-ink-500/60"
                      : picked ? "border-brand bg-brand/10" : "border-ink-500/60 hover:border-ink-500";
                    return (
                      <button key={o} type="button" disabled={reviewing} onClick={() => setAnswers((a) => ({ ...a, [i]: o }))} className={`rounded-xl border px-4 py-2.5 text-left text-sm transition ${cls}`}>
                        {o}
                      </button>
                    );
                  })
                )}
              </div>
              {reviewing ? (
                <div className="mt-3 rounded-xl bg-ink-700/50 p-3 text-sm">
                  <p className={`flex items-center gap-1 font-semibold ${correct ? "text-emerald-400" : "text-red-400"}`}>
                    {correct ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
                    {correct ? "Benar" : `Jawaban: ${q.jawaban}`}
                  </p>
                  {q.pembahasan ? <p className="mt-1 text-muted">{q.pembahasan}</p> : null}
                </div>
              ) : null}
            </div>
          );
        })}
      </div>

      {!reviewing ? (
        <button
          type="button"
          onClick={() => {
            setPhase("result");
            if (quiz) simpanSkor.mutate(score);
          }}
          className="mt-6 w-full rounded-2xl bg-brand px-6 py-3.5 font-bold text-white shadow-brand"
        >
          Selesai &amp; Lihat Skor
        </button>
      ) : null}
    </div>
  );
}
