"use client";

import { SOURCES } from "./sources";

/** Baris cepat "Buat baru:" dengan tombol per sumber materi. */
export function CreateBar() {
  return (
    <div className="card flex flex-wrap items-center gap-3 p-4">
      <span className="pl-1 text-sm font-semibold text-muted">Buat baru:</span>
      {SOURCES.map((s) => {
        const Icon = s.icon;
        return (
          <button
            key={s.id}
            type="button"
            // TODO(W): buka modal/flow pembuatan materi sesuai sumber.
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
