"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, RefreshCw, Waypoints } from "lucide-react";
import { mindmapApi } from "@/lib/api/resources";
import type { MindmapNode } from "@/lib/api/types";

export function MindmapTab({ materialId }: { materialId: string }) {
  const qc = useQueryClient();
  const mm = useQuery({ queryKey: ["mindmap", materialId], queryFn: () => mindmapApi.get(materialId) });
  const gen = useMutation({
    mutationFn: () => mindmapApi.generate(materialId),
    onSuccess: (data) => qc.setQueryData(["mindmap", materialId], data),
  });

  if (mm.isLoading) {
    return <div className="grid h-[50vh] place-items-center text-muted"><Loader2 className="h-6 w-6 animate-spin" /></div>;
  }

  if (!mm.data) {
    return (
      <div className="card grid min-h-[60vh] place-items-center p-12 text-center">
        <div>
          <span className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-brand/15 text-brand"><Waypoints className="h-8 w-8" /></span>
          <h2 className="mt-6 text-2xl font-extrabold">Buat Mind Map</h2>
          <p className="mx-auto mt-2 max-w-sm text-muted">Buat peta visual dari catatanmu untuk memahami konsep dan hubungan lebih cepat.</p>
          <button type="button" onClick={() => gen.mutate()} disabled={gen.isPending} className="mx-auto mt-6 flex items-center gap-2 rounded-2xl bg-brand px-6 py-3 font-bold text-white shadow-brand disabled:opacity-60">
            {gen.isPending ? <Loader2 className="h-5 w-5 animate-spin" /> : <Waypoints className="h-5 w-5" />} Buat Mind Map
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold">Mind Map</h2>
        <button type="button" onClick={() => gen.mutate()} disabled={gen.isPending} className="flex items-center gap-2 rounded-xl border border-ink-500 px-4 py-2 text-sm font-semibold transition hover:bg-ink-600 disabled:opacity-60">
          {gen.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />} Buat Ulang
        </button>
      </div>
      <div className="card overflow-x-auto p-6">
        <Node node={mm.data.dataJson} depth={0} />
      </div>
    </div>
  );
}

function Node({ node, depth }: { node: MindmapNode; depth: number }) {
  const colors = ["bg-brand text-white", "bg-brand/15 text-brand", "bg-ink-600 text-white"];
  const cls = colors[Math.min(depth, colors.length - 1)];
  return (
    <div className="flex items-start gap-3">
      <span className={`mt-1 whitespace-nowrap rounded-lg px-3 py-1.5 text-sm font-semibold ${cls}`}>{node.label}</span>
      {node.children && node.children.length > 0 ? (
        <div className="flex flex-col gap-2 border-l border-ink-500/60 pl-4">
          {node.children.map((c, i) => (
            <Node key={i} node={c} depth={depth + 1} />
          ))}
        </div>
      ) : null}
    </div>
  );
}
