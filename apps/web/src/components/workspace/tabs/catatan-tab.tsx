"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Check, Loader2, Lock, Plus, Sparkles } from "lucide-react";
import { chaptersApi } from "@/lib/api/resources";
import type { Material } from "@/lib/api/types";
import { ChapterEditor } from "./chapter-editor";

export function CatatanTab({ material }: { material: Material }) {
  const qc = useQueryClient();
  const [openId, setOpenId] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [judul, setJudul] = useState("");

  const invalidate = () => qc.invalidateQueries({ queryKey: ["material", material.id] });
  const gen = useMutation({ mutationFn: (id: string) => chaptersApi.generate(id), onSuccess: invalidate });
  const add = useMutation({
    mutationFn: () => chaptersApi.add(material.id, judul.trim()),
    onSuccess: () => {
      invalidate();
      setAdding(false);
      setJudul("");
    },
  });

  const open = openId ? material.chapters.find((c) => c.id === openId) : null;
  if (open) return <ChapterEditor chapter={open} materialId={material.id} onBack={() => setOpenId(null)} />;

  const chapters = material.chapters;
  const done = chapters.filter((c) => c.status === "ready" && (c.kontenMd?.trim().length ?? 0) > 0).length;
  const locked = chapters.filter((c) => c.isPro).length;

  return (
    <div>
      <div className="mb-4 flex items-center gap-3">
        <h2 className="text-xl font-bold">Bab</h2>
        <span className="text-sm text-muted">
          {done}/{chapters.length} selesai
        </span>
        {locked > 0 ? (
          <span className="flex items-center gap-1 rounded-full border border-ink-500 px-2 py-0.5 text-xs text-muted">
            <Lock className="h-3 w-3" /> {locked} terkunci
          </span>
        ) : null}
      </div>

      <div className="flex flex-col gap-3">
        {chapters.map((c) => {
          const hasContent = (c.kontenMd?.trim().length ?? 0) > 0;
          const isReady = c.status === "ready"; // bab manual (Tulis Catatan) langsung bisa diisi
          return (
            <div key={c.id} className="card flex items-center gap-4 p-4">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-ink-600 font-bold text-brand">
                {c.urutan}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold">{c.judul}</p>
                <div className="mt-1 flex items-center gap-2 text-xs">
                  {hasContent ? (
                    <span className="flex items-center gap-1 text-emerald-400">
                      <Check className="h-3 w-3" /> Selesai
                    </span>
                  ) : (
                    <span className="text-muted">Menunggu</span>
                  )}
                  {c.isPro ? (
                    <span className="flex items-center gap-1 rounded-full bg-brand/15 px-2 py-0.5 text-brand">
                      <Lock className="h-3 w-3" /> Pro
                    </span>
                  ) : null}
                </div>
              </div>

              {isReady ? (
                <button
                  type="button"
                  onClick={() => setOpenId(c.id)}
                  className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
                    hasContent ? "border border-ink-500 hover:bg-ink-600" : "bg-brand text-white shadow-brand hover:bg-brand-600"
                  }`}
                >
                  {hasContent ? "Buka" : "Tulis"}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => gen.mutate(c.id)}
                  disabled={gen.isPending && gen.variables === c.id}
                  className="flex items-center gap-2 rounded-xl bg-brand px-4 py-2 text-sm font-bold text-white shadow-brand transition enabled:hover:bg-brand-600 disabled:opacity-60"
                >
                  {gen.isPending && gen.variables === c.id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Sparkles className="h-4 w-4" />
                  )}
                  Buat
                </button>
              )}
            </div>
          );
        })}
      </div>

      {adding ? (
        <div className="mt-3 flex gap-2">
          <input
            autoFocus
            value={judul}
            onChange={(e) => setJudul(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && judul.trim() && add.mutate()}
            placeholder="Judul chapter baru..."
            className="input-field flex-1"
          />
          <button type="button" onClick={() => judul.trim() && add.mutate()} disabled={!judul.trim() || add.isPending} className="rounded-xl bg-brand px-4 font-bold text-white disabled:opacity-40">
            Tambah
          </button>
          <button type="button" onClick={() => setAdding(false)} className="px-2 text-sm text-muted">Batal</button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setAdding(true)}
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-ink-500 py-4 text-sm text-muted transition hover:border-brand/60 hover:text-white"
        >
          <Plus className="h-4 w-4" /> Tambah Chapter
        </button>
      )}
    </div>
  );
}
