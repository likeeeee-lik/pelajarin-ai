"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight, Layers, Loader2, RefreshCw } from "lucide-react";
import { flashcardsApi } from "@/lib/api/resources";
import type { Material } from "@/lib/api/types";
import { ChapterPicker } from "../chapter-picker";

const COUNTS = [
  { n: 15, pro: false },
  { n: 25, pro: false },
  { n: 50, pro: true },
];

export function FlashcardsTab({ material }: { material: Material }) {
  const qc = useQueryClient();
  const list = useQuery({ queryKey: ["flashcards", material.id], queryFn: () => flashcardsApi.list(material.id) });

  const [count, setCount] = useState(15);
  const [chapterIds, setChapterIds] = useState<string[]>(material.chapters.map((c) => c.id));
  const [configuring, setConfiguring] = useState(false);
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const gen = useMutation({
    mutationFn: () => flashcardsApi.generate(material.id, { count, chapterIds }),
    onSuccess: (data) => {
      qc.setQueryData(["flashcards", material.id], data);
      setConfiguring(false);
      setIdx(0);
      setFlipped(false);
    },
  });

  if (list.isLoading) {
    return <div className="grid h-[50vh] place-items-center text-muted"><Loader2 className="h-6 w-6 animate-spin" /></div>;
  }

  const cards = list.data ?? [];
  const showConfig = configuring || cards.length === 0;

  if (showConfig) {
    return (
      <div className="card mx-auto max-w-lg p-8 text-center">
        <span className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-brand/15 text-brand"><Layers className="h-8 w-8" /></span>
        <h2 className="mt-6 text-2xl font-extrabold">Buat Flashcards</h2>
        <p className="mt-2 text-muted">Pilih jumlah flashcards yang ingin dibuat dari catatan ini.</p>

        <div className="mt-6 grid grid-cols-3 gap-3">
          {COUNTS.map((c) => (
            <button key={c.n} type="button" onClick={() => setCount(c.n)} className={`relative rounded-2xl border p-4 transition ${count === c.n ? "border-brand bg-brand/10 text-brand" : "border-ink-500/70 bg-ink-700/40"}`}>
              {c.pro ? <span className="absolute -top-2 right-2 rounded-full bg-brand px-2 py-0.5 text-[10px] font-bold text-white">PRO</span> : null}
              <p className="text-2xl font-extrabold">{c.n}</p>
              <p className="text-xs text-muted">flashcard</p>
            </button>
          ))}
        </div>

        <div className="mt-6 text-left"><ChapterPicker chapters={material.chapters} selected={chapterIds} onChange={setChapterIds} /></div>

        <button type="button" onClick={() => gen.mutate()} disabled={gen.isPending || chapterIds.length === 0} className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-brand px-6 py-3.5 font-bold text-white shadow-brand disabled:opacity-50">
          {gen.isPending ? <Loader2 className="h-5 w-5 animate-spin" /> : null} Buat {count} Flashcards
        </button>
      </div>
    );
  }

  const card = cards[idx];
  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-4 flex items-center justify-between">
        <span className="text-sm text-muted">{idx + 1} / {cards.length}</span>
        <button type="button" onClick={() => setConfiguring(true)} className="flex items-center gap-2 rounded-xl border border-ink-500 px-4 py-2 text-sm font-semibold hover:bg-ink-600">
          <RefreshCw className="h-4 w-4" /> Buat Ulang
        </button>
      </div>

      <button
        type="button"
        onClick={() => setFlipped((f) => !f)}
        className="grid min-h-[280px] w-full place-items-center rounded-xl2 border border-ink-500 bg-ink-700/40 p-8 text-center transition hover:border-brand/50"
      >
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-muted">{flipped ? "Jawaban" : "Pertanyaan"}</p>
          <p className="mt-4 text-xl font-semibold">{flipped ? card?.back : card?.front}</p>
          <p className="mt-6 text-xs text-muted">klik untuk membalik</p>
        </div>
      </button>

      <div className="mt-4 flex items-center justify-between">
        <button type="button" disabled={idx === 0} onClick={() => { setIdx((i) => i - 1); setFlipped(false); }} className="grid h-11 w-11 place-items-center rounded-full border border-ink-500 text-muted enabled:hover:text-white disabled:opacity-30">
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button type="button" disabled={idx >= cards.length - 1} onClick={() => { setIdx((i) => i + 1); setFlipped(false); }} className="grid h-11 w-11 place-items-center rounded-full border border-ink-500 text-muted enabled:hover:text-white disabled:opacity-30">
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
