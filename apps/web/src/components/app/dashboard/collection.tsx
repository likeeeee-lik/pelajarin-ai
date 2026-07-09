"use client";

import Link from "next/link";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FileText, Mic, PenLine, Trash2, Video, Youtube, type LucideIcon } from "lucide-react";
import { materialsApi } from "@/lib/api/resources";
import type { MaterialSummary, MaterialType } from "@/lib/api/types";

const ICON: Record<MaterialType, LucideIcon> = {
  file: FileText,
  youtube: Youtube,
  audio: Mic,
  video: Video,
  note: PenLine,
};

export function Collection({ materials }: { materials: MaterialSummary[] }) {
  const qc = useQueryClient();
  const del = useMutation({
    mutationFn: (id: string) => materialsApi.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["materials"] }),
  });

  return (
    <section>
      <div className="mb-4 flex items-center gap-2">
        <h2 className="text-xl font-bold">Koleksi Kamu</h2>
        <span className="text-sm text-muted">{materials.length} materi</span>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {materials.map((m) => {
          const Icon = ICON[m.tipe] ?? FileText;
          return (
            <div key={m.id} className="card group relative p-5">
              <Link href={`/catatan/${m.id}`} className="block">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand/15 text-brand">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="mt-3 truncate font-bold">{m.judul}</h3>
                <p className="text-xs text-muted">{m.subject?.nama ?? "Tanpa kategori"}</p>
                <p className="mt-3 text-xs text-muted">{m._count.chapters} bab</p>
              </Link>
              <button
                type="button"
                onClick={() => del.mutate(m.id)}
                aria-label="Hapus"
                className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-lg text-muted opacity-0 transition hover:bg-red-500/10 hover:text-red-400 group-hover:opacity-100"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
}
