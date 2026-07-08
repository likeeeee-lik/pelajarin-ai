"use client";

import { useState } from "react";
import { Plus, Sparkles, Target } from "lucide-react";
import { CreatePredictionModal } from "@/components/app/latihan-soal/create-modal";
import type { Prediction } from "@/components/app/latihan-soal/create-modal";
import { PredictionCard } from "@/components/app/latihan-soal/prediction-card";

export default function LatihanSoalPage() {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<Prediction[]>([]);

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Target className="h-8 w-8 text-brand" />
          <div>
            <h1 className="text-3xl font-extrabold">Prediksi Soal Ujian</h1>
            <p className="text-sm text-muted">
              Upload soal ujian sebelumnya dan dapatkan prediksi soal berikutnya
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 rounded-2xl bg-brand px-5 py-3 font-bold text-white shadow-brand transition hover:bg-brand-600"
        >
          <Plus className="h-4 w-4" /> Buat Prediksi
        </button>
      </header>

      {items.length === 0 ? (
        <div className="card grid place-items-center p-12 text-center">
          <span className="grid h-16 w-16 place-items-center rounded-full bg-brand/15 text-brand">
            <Sparkles className="h-8 w-8" />
          </span>
          <h2 className="mt-6 text-xl font-bold">Prediksi Soal dengan AI</h2>
          <p className="mx-auto mt-2 max-w-md text-muted">
            Upload soal-soal ujian sebelumnya dan AI akan menganalisis pola untuk
            membuat prediksi soal ujian berikutnya.
          </p>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="mt-6 flex items-center gap-2 rounded-2xl bg-brand px-5 py-3 font-bold text-white shadow-brand transition hover:bg-brand-600"
          >
            <Plus className="h-4 w-4" /> Buat Prediksi Pertama
          </button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((p) => (
            <PredictionCard key={p.id} item={p} />
          ))}
        </div>
      )}

      {open ? (
        <CreatePredictionModal
          onClose={() => setOpen(false)}
          onCreate={(p) => {
            setItems((prev) => [p, ...prev]);
            setOpen(false);
          }}
        />
      ) : null}
    </div>
  );
}
