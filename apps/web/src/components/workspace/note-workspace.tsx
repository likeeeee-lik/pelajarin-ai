"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { BookOpen, Download, Loader2, Share2 } from "lucide-react";
import { materialsApi } from "@/lib/api/resources";
import { WorkspaceSidebar } from "./workspace-sidebar";
import { type WorkspaceTab } from "./tabs-config";
import { CatatanTab } from "./tabs/catatan-tab";
import { MindmapTab } from "./tabs/mindmap-tab";
import { FlashcardsTab } from "./tabs/flashcards-tab";
import { KuisTab } from "./tabs/kuis-tab";
import { ChatTab } from "./tabs/chat-tab";
import { DokumenTab } from "./tabs/dokumen-tab";
import { ShareModal } from "./share-modal";
import { ExportPdfModal } from "./export-pdf-modal";

export function NoteWorkspace({ id }: { id: string }) {
  const [tab, setTab] = useState<WorkspaceTab>("catatan");
  const [shareOpen, setShareOpen] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);
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
                <button type="button" onClick={() => setShareOpen(true)} className="flex items-center gap-2 rounded-xl border border-ink-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-ink-600">
                  <Share2 className="h-4 w-4" /> Bagikan
                </button>
                <button type="button" onClick={() => setExportOpen(true)} className="flex items-center gap-2 rounded-xl border border-ink-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-ink-600">
                  <Download className="h-4 w-4" /> Ekspor PDF
                </button>
              </div>
            </header>

            {tab === "catatan" ? <CatatanTab material={material.data} /> : null}
            {tab === "mindmap" ? <MindmapTab materialId={material.data.id} /> : null}
            {tab === "flashcards" ? <FlashcardsTab material={material.data} /> : null}
            {tab === "kuis" ? <KuisTab material={material.data} /> : null}
            {tab === "dokumen" ? <DokumenTab material={material.data} /> : null}
            {tab === "chat" ? <ChatTab material={material.data} /> : null}

            {shareOpen ? <ShareModal materialId={id} onClose={() => setShareOpen(false)} /> : null}
            {exportOpen ? <ExportPdfModal material={material.data} onClose={() => setExportOpen(false)} /> : null}
          </>
        )}
      </main>
    </div>
  );
}
