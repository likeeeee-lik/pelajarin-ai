"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { BookOpen, Download, Loader2, Share2 } from "lucide-react";
import { materialsApi } from "@/lib/api/resources";
import { WorkspaceSidebar } from "./workspace-sidebar";
import { WORKSPACE_TABS, type WorkspaceTab } from "./tabs-config";
import { CatatanTab } from "./tabs/catatan-tab";
import { PlaceholderTab } from "./tabs/placeholder-tab";

export function NoteWorkspace({ id }: { id: string }) {
  const [tab, setTab] = useState<WorkspaceTab>("catatan");
  const material = useQuery({ queryKey: ["material", id], queryFn: () => materialsApi.get(id) });

  return (
    <div className="bg-app flex min-h-screen">
      <WorkspaceSidebar active={tab} onChange={setTab} />

      <main className="min-w-0 flex-1 p-6 lg:p-8">
        {material.isLoading ? (
          <div className="grid h-[60vh] place-items-center text-muted">
            <Loader2 className="h-7 w-7 animate-spin" />
          </div>
        ) : material.isError || !material.data ? (
          <div className="card p-8 text-center text-muted">
            Materi tidak ditemukan atau server API tidak berjalan.
          </div>
        ) : (
          <>
            <header className="mb-6 flex flex-wrap items-start justify-between gap-4">
              <div>
                <h1 className="text-3xl font-extrabold">{material.data.judul}</h1>
                <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-muted">
                  <span className="flex items-center gap-1">
                    <BookOpen className="h-4 w-4" /> {material.data.subject?.nama ?? "Tanpa kategori"}
                  </span>
                  <span>{material.data.chapters.length} bab</span>
                </div>
              </div>
              <div className="flex gap-2">
                <button type="button" title="Segera" className="flex items-center gap-2 rounded-xl border border-ink-500 px-4 py-2 text-sm font-semibold text-muted transition hover:text-white">
                  <Share2 className="h-4 w-4" /> Bagikan
                </button>
                <button type="button" title="Segera" className="flex items-center gap-2 rounded-xl border border-ink-500 px-4 py-2 text-sm font-semibold text-muted transition hover:text-white">
                  <Download className="h-4 w-4" /> Ekspor PDF
                </button>
              </div>
            </header>

            {tab === "catatan" ? (
              <CatatanTab material={material.data} />
            ) : (
              (() => {
                const meta = WORKSPACE_TABS.find((t) => t.id === tab)!;
                return <PlaceholderTab label={meta.label} icon={meta.icon} />;
              })()
            )}
          </>
        )}
      </main>
    </div>
  );
}
