"use client";

import type { Chapter } from "@/lib/api/types";

/** Pemilih bab (checkbox) untuk fitur flashcards/kuis/chat. */
export function ChapterPicker({
  chapters,
  selected,
  onChange,
}: {
  chapters: Chapter[];
  selected: string[];
  onChange: (ids: string[]) => void;
}) {
  const allSelected = selected.length === chapters.length;
  const toggle = (id: string) =>
    onChange(selected.includes(id) ? selected.filter((x) => x !== id) : [...selected, id]);

  if (chapters.length === 0) {
    return <p className="text-sm text-muted">Belum ada bab. Buat bab dulu di tab Catatan.</p>;
  }

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm font-semibold text-muted">Pilih Chapter</span>
        <button
          type="button"
          onClick={() => onChange(allSelected ? [] : chapters.map((c) => c.id))}
          className="text-xs font-semibold text-brand"
        >
          {allSelected ? "Batal Semua" : "Pilih Semua"}
        </button>
      </div>
      <div className="flex max-h-40 flex-col gap-2 overflow-y-auto">
        {chapters.map((c) => (
          <label key={c.id} className="flex cursor-pointer items-center gap-3 rounded-xl border border-ink-500/60 bg-ink-700/40 px-3 py-2 text-sm">
            <input
              type="checkbox"
              checked={selected.includes(c.id)}
              onChange={() => toggle(c.id)}
              className="h-4 w-4 accent-[#F97316]"
            />
            <span className="truncate">{c.judul}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
