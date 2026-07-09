"use client";

import { useRef, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Check, ChevronLeft, Loader2 } from "lucide-react";
import { chaptersApi } from "@/lib/api/resources";
import type { Chapter } from "@/lib/api/types";

export function ChapterEditor({
  chapter,
  materialId,
  onBack,
}: {
  chapter: Chapter;
  materialId: string;
  onBack: () => void;
}) {
  const qc = useQueryClient();
  const [konten, setKonten] = useState(chapter.kontenMd ?? "");
  const [saved, setSaved] = useState(true);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const save = useMutation({
    mutationFn: (v: string) => chaptersApi.update(chapter.id, v),
    onSuccess: () => {
      setSaved(true);
      qc.invalidateQueries({ queryKey: ["material", materialId] });
    },
  });

  function onChange(v: string) {
    setKonten(v);
    setSaved(false);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => save.mutate(v), 800);
  }

  return (
    <div className="flex h-full flex-col">
      <div className="mb-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button type="button" onClick={onBack} className="grid h-9 w-9 place-items-center rounded-lg border border-ink-500 text-muted transition hover:text-white">
            <ChevronLeft className="h-5 w-5" />
          </button>
          <h2 className="text-2xl font-extrabold">{chapter.judul}</h2>
        </div>
        <span className="flex items-center gap-1.5 text-sm">
          {saved ? (
            <>
              <Check className="h-4 w-4 text-emerald-400" /> <span className="text-emerald-400">Tersimpan</span>
            </>
          ) : (
            <>
              <Loader2 className="h-4 w-4 animate-spin text-muted" /> <span className="text-muted">Menyimpan...</span>
            </>
          )}
        </span>
      </div>

      <div className="grid flex-1 gap-4 lg:grid-cols-2">
        <div className="flex flex-col">
          <span className="mb-1.5 text-xs font-semibold text-muted">Editor (Markdown)</span>
          <textarea
            value={konten}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Tulis isi bab dalam Markdown..."
            className="min-h-[50vh] flex-1 resize-none rounded-2xl border border-ink-500 bg-ink-700/40 p-4 font-mono text-sm outline-none focus:border-brand"
          />
        </div>
        <div className="flex flex-col">
          <span className="mb-1.5 text-xs font-semibold text-muted">Pratinjau</span>
          <div className="md min-h-[50vh] flex-1 overflow-auto rounded-2xl border border-ink-500/60 bg-ink-700/20 p-4">
            {konten.trim() ? (
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{konten}</ReactMarkdown>
            ) : (
              <p className="text-sm text-muted">Pratinjau akan muncul di sini.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
