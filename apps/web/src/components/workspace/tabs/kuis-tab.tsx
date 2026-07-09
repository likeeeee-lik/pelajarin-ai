"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Check, HelpCircle, Loader2, RotateCcw, X } from "lucide-react";
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

export function KuisTab({ material }: { material: Material }) {
  const [phase, setPhase] = useState<"config" | "playing" | "result">("config");
  const [types, setTypes] = useState<QuizType[]>(["pilihan_ganda"]);
  const [count, setCount] = useState(5);
  const [chapterIds, setChapterIds] = useState<string[]>(material.chapters.map((c) => c.id));
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [answers, setAnswers] = useState<Record<number, string>>({});

  const gen = useMutation({
    mutationFn: () => quizzesApi.generate(material.id, { count, types, chapterIds }),
    onSuccess: (q) => {
      setQuiz(q);
      setAnswers({});
      setPhase("playing");
    },
  });

  const questions: QuizQuestion[] = quiz?.soalJson.questions ?? [];
  const score = questions.reduce((s, q, i) => (norm(answers[i] ?? "") === norm(q.jawaban) ? s + 1 : s), 0);

  const toggleType = (t: QuizType) =>
    setTypes((prev) => (prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]));

  if (phase === "config") {
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

        <button type="button" onClick={() => gen.mutate()} disabled={gen.isPending || types.length === 0 || chapterIds.length === 0} className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-brand px-6 py-3.5 font-bold text-white shadow-brand disabled:opacity-50">
          {gen.isPending ? <Loader2 className="h-5 w-5 animate-spin" /> : null} Mulai Quiz ({count} soal)
        </button>
      </div>
    );
  }

  const reviewing = phase === "result";
  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold">Kuis</h2>
        {reviewing ? (
          <span className="rounded-full bg-brand/15 px-3 py-1 font-bold text-brand">Skor {score}/{questions.length}</span>
        ) : null}
        <button type="button" onClick={() => setPhase("config")} className="flex items-center gap-2 rounded-xl border border-ink-500 px-4 py-2 text-sm font-semibold hover:bg-ink-600">
          <RotateCcw className="h-4 w-4" /> Ulangi
        </button>
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
        <button type="button" onClick={() => setPhase("result")} className="mt-6 w-full rounded-2xl bg-brand px-6 py-3.5 font-bold text-white shadow-brand">
          Selesai & Lihat Skor
        </button>
      ) : null}
    </div>
  );
}
