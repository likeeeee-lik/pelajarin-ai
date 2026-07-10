"use client";

import { Telescope } from "lucide-react";
import { SOURCES } from "./sources";
import type { MaterialType } from "@/lib/api/types";

/** Empty state dashboard: ajakan mulai + 5 kartu sumber materi. */
export function StartEmpty({ onPick }: { onPick: (source: MaterialType) => void }) {
  return (
    <div className="card p-8 text-center">
      <span className="mx-auto grid h-20 w-20 place-items-center rounded-2xl bg-brand/15 text-brand">
        <Telescope className="h-9 w-9" />
      </span>
      <h2 className="mt-6 text-2xl font-extrabold">Mulai Belajar dengan AI</h2>
      <p className="mx-auto mt-2 max-w-md text-muted">
        Upload materi belajarmu dan biarkan AI membuat catatan, flashcard, dan kuis
        otomatis.
      </p>

      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {SOURCES.map((s) => {
          const Icon = s.icon;
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => onPick(s.id as MaterialType)}
              className="flex flex-col items-center gap-3 rounded-2xl border border-ink-500/60 bg-ink-700/40 p-5 text-center transition hover:border-brand/60 hover:bg-ink-600"
            >
              <span className={`grid h-12 w-12 place-items-center rounded-xl ${s.color}`}>
                <Icon className="h-6 w-6" />
              </span>
              <span className="text-sm font-bold">{s.label}</span>
              <span className="text-xs text-muted">{s.desc}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
