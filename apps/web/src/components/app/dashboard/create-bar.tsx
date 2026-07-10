"use client";

import { SOURCES } from "./sources";
import type { MaterialType } from "@/lib/api/types";

/** Baris cepat "Buat baru:" — memicu modal pembuatan materi. */
export function CreateBar({ onPick }: { onPick: (source: MaterialType) => void }) {
  return (
    <div className="card flex flex-wrap items-center gap-3 p-4">
      <span className="pl-1 text-sm font-semibold text-muted">Buat baru:</span>
      {SOURCES.map((s) => {
        const Icon = s.icon;
        return (
          <button
            key={s.id}
            type="button"
            onClick={() => onPick(s.id as MaterialType)}
            className="flex items-center gap-2 rounded-xl border border-ink-500/60 bg-ink-700/50 px-4 py-2.5 text-sm font-semibold transition hover:border-ink-500 hover:bg-ink-600"
          >
            <span className={`grid h-6 w-6 place-items-center rounded-lg ${s.color}`}>
              <Icon className="h-4 w-4" />
            </span>
            {s.label}
          </button>
        );
      })}
    </div>
  );
}
