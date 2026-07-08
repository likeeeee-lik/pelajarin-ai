"use client";

import { Brain, Clock, FileText, Sparkles, Zap, Check } from "lucide-react";
import { RadarChart } from "./radar-chart";
import type { RadarScores } from "@/lib/onboarding/scoring";

const BENEFITS = [
  { icon: Brain, text: "Diagram & mind-map otomatis untuk setiap materi" },
  { icon: Clock, text: "Push notification di jam 18:00 — golden hour kamu" },
  { icon: Zap, text: "Unlimited AI chat — tanya sepuasnya" },
  { icon: FileText, text: "Unlimited notes & ringkasan otomatis" },
  { icon: Sparkles, text: "Priority processing — respons lebih cepat" },
];

export function ResultScreen({
  scores,
  answersCount,
  onStartPro,
  onSkip,
}: {
  scores: RadarScores;
  answersCount: number;
  onStartPro: () => void;
  onSkip: () => void;
}) {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-lg flex-col items-center px-4 py-12 text-center">
      <RadarChart scores={scores} size={260} />

      <span className="mt-2 inline-flex items-center gap-2 rounded-full border border-brand/40 bg-brand/10 px-4 py-1.5 text-sm font-semibold text-brand">
        <Sparkles className="h-4 w-4" /> Profil selesai
      </span>

      <h1 className="mt-5 text-3xl font-extrabold">
        Teman Belajar-mu sudah dikustomisasi!
      </h1>
      <p className="mt-2 text-muted">
        Berdasarkan {answersCount} jawaban kamu, kami sudah menyiapkan pengalaman
        belajar yang unik.
      </p>

      <ul className="mt-8 flex w-full flex-col gap-3 text-left">
        {BENEFITS.map((b) => (
          <li key={b.text} className="card flex items-center gap-3 px-5 py-4">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand/15 text-brand">
              <b.icon className="h-5 w-5" />
            </span>
            <span className="flex-1 text-sm">{b.text}</span>
            <Check className="h-5 w-5 text-brand" />
          </li>
        ))}
      </ul>

      <div className="mt-8">
        <p className="text-4xl font-extrabold">
          Rp 60.000 <span className="text-lg font-medium text-muted">/bulan</span>
        </p>
        <p className="text-sm text-muted">Bisa cancel kapan saja</p>
      </div>

      <button
        type="button"
        onClick={onStartPro}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-brand px-5 py-4 font-bold text-white shadow-brand transition hover:bg-brand-600"
      >
        <Zap className="h-5 w-5" /> Mulai Pro Sekarang
      </button>
      <button
        type="button"
        onClick={onSkip}
        className="mt-4 text-sm font-medium text-muted transition hover:text-white"
      >
        Nanti aja, pakai gratisan dulu
      </button>
    </div>
  );
}
