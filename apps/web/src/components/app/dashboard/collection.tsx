"use client";

import { FileText, Mic, Trash2, Video, Youtube, PenLine, type LucideIcon } from "lucide-react";
import { removeMaterial, useMaterials, useSubjects, type Material } from "@/lib/store";

const ICON: Record<Material["tipe"], LucideIcon> = {
  file: FileText,
  youtube: Youtube,
  audio: Mic,
  video: Video,
  note: PenLine,
};

const TIPE_LABEL: Record<Material["tipe"], string> = {
  file: "Dokumen",
  youtube: "YouTube",
  audio: "Audio",
  video: "Video",
  note: "Catatan",
};

export function Collection() {
  const materials = useMaterials();
  const subjects = useSubjects();
  const nameOf = (id?: string) => subjects.find((s) => s.id === id)?.nama;

  return (
    <section>
      <div className="mb-4 flex items-center gap-2">
        <h2 className="text-xl font-bold">Koleksi Kamu</h2>
        <span className="text-sm text-muted">{materials.length} materi</span>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {materials.map((m) => {
          const Icon = ICON[m.tipe];
          return (
            <div key={m.id} className="card p-5">
              <div className="flex items-start justify-between">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand/15 text-brand">
                  <Icon className="h-5 w-5" />
                </span>
                <button
                  type="button"
                  onClick={() => removeMaterial(m.id)}
                  aria-label="Hapus materi"
                  className="grid h-8 w-8 place-items-center rounded-lg text-muted transition hover:bg-red-500/10 hover:text-red-400"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <h3 className="mt-3 truncate font-bold">{m.judul}</h3>
              <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted">
                <span>{TIPE_LABEL[m.tipe]}</span>
                {nameOf(m.subjectId) ? <span>· {nameOf(m.subjectId)}</span> : null}
                <span
                  className={`rounded-full px-2 py-0.5 ${
                    m.status === "ready"
                      ? "bg-emerald-500/15 text-emerald-400"
                      : "bg-amber-500/15 text-amber-400"
                  }`}
                >
                  {m.status === "ready" ? "Siap" : "Diproses"}
                </span>
              </div>
              {m.konten ? <p className="mt-3 line-clamp-3 text-sm text-muted">{m.konten}</p> : null}
            </div>
          );
        })}
      </div>
    </section>
  );
}
