"use client";

import { FileText, Link2 } from "lucide-react";
import type { Material } from "@/lib/api/types";

const TIPE_LABEL: Record<string, string> = {
  file: "Dokumen",
  youtube: "YouTube",
  audio: "Audio",
  video: "Video",
  note: "Catatan",
};

export function DokumenTab({ material }: { material: Material }) {
  return (
    <div className="mx-auto max-w-2xl">
      <h2 className="text-xl font-bold">Dokumen</h2>
      <p className="text-sm text-muted">Sumber materi untuk catatan ini</p>

      <div className="card mt-4 p-5">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand/15 text-brand"><FileText className="h-5 w-5" /></span>
          <div>
            <p className="font-bold">{material.judul}</p>
            <p className="text-xs text-muted">{TIPE_LABEL[material.tipe] ?? material.tipe}</p>
          </div>
        </div>

        {material.sourceUrl ? (
          <a href={material.sourceUrl} target="_blank" rel="noreferrer" className="mt-4 flex items-center gap-2 rounded-xl border border-ink-500/60 bg-ink-700/40 px-4 py-2.5 text-sm text-brand hover:underline">
            <Link2 className="h-4 w-4" /> {material.sourceUrl}
          </a>
        ) : null}
      </div>

      {material.rawText ? (
        <div className="mt-4">
          <p className="mb-2 text-sm font-semibold text-muted">Pratinjau Sumber</p>
          <div className="card max-h-[50vh] overflow-auto whitespace-pre-wrap p-5 text-sm text-white/90">
            {material.rawText}
          </div>
        </div>
      ) : (
        <p className="mt-4 text-sm text-muted">Belum ada teks sumber. (Ingestion file/transkrip akan mengisi ini nanti.)</p>
      )}
    </div>
  );
}
