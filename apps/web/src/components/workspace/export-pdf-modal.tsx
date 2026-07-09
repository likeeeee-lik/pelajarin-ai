"use client";

import { useState } from "react";
import { marked } from "marked";
import { Download, X } from "lucide-react";
import type { Material } from "@/lib/api/types";

export function ExportPdfModal({ material, onClose }: { material: Material; onClose: () => void }) {
  const withContent = material.chapters.filter((c) => (c.kontenMd?.trim().length ?? 0) > 0);
  const [selected, setSelected] = useState<string[]>(withContent.map((c) => c.id));

  const allSelected = selected.length === withContent.length;
  const toggle = (id: string) =>
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  async function exportPdf() {
    const chapters = withContent.filter((c) => selected.includes(c.id));
    const parts: string[] = [];
    for (const c of chapters) {
      const html = await marked.parse(c.kontenMd ?? "");
      parts.push(`<section><h2>${escapeHtml(c.judul)}</h2>${html}</section>`);
    }
    const doc = `<!doctype html><html lang="id"><head><meta charset="utf-8"><title>${escapeHtml(material.judul)}</title>
<style>
  @page { margin: 2cm; }
  body { font-family: -apple-system, Segoe UI, Roboto, sans-serif; color: #111; line-height: 1.6; }
  h1 { font-size: 26px; margin-bottom: 4px; }
  .sub { color: #666; margin-bottom: 24px; }
  section { margin-bottom: 28px; page-break-inside: avoid; }
  h2 { font-size: 20px; border-bottom: 2px solid #F97316; padding-bottom: 4px; }
  h3 { font-size: 16px; }
  code { background: #f3f3f3; padding: 1px 4px; border-radius: 4px; }
  pre { background: #f3f3f3; padding: 12px; border-radius: 8px; overflow: auto; }
  blockquote { border-left: 3px solid #F97316; margin: 8px 0; padding-left: 12px; color: #555; }
  table { border-collapse: collapse; } th,td { border: 1px solid #ccc; padding: 4px 8px; }
  .foot { margin-top: 32px; color: #999; font-size: 12px; text-align: center; }
</style></head><body>
<h1>${escapeHtml(material.judul)}</h1>
<div class="sub">${escapeHtml(material.subject?.nama ?? "")} · Pelajarin.ai</div>
${parts.join("")}
<div class="foot">Diekspor dari Pelajarin.ai</div>
</body></html>`;

    const w = window.open("", "_blank");
    if (!w) return;
    w.document.open();
    w.document.write(doc);
    w.document.close();
    w.focus();
    setTimeout(() => w.print(), 400);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center p-4">
      <button type="button" aria-hidden onClick={onClose} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div className="relative z-10 w-full max-w-md rounded-xl2 border border-ink-500 bg-ink-800 p-6 shadow-2xl">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-extrabold">Ekspor PDF</h2>
            <p className="mt-1 text-sm text-muted">Pilih chapter yang ingin diexport ke PDF</p>
          </div>
          <button type="button" onClick={onClose} className="text-muted hover:text-white"><X className="h-5 w-5" /></button>
        </div>

        {withContent.length === 0 ? (
          <p className="mt-5 text-sm text-muted">Belum ada bab dengan isi. Buat/isi bab dulu di tab Catatan.</p>
        ) : (
          <>
            <div className="mt-4 flex items-center justify-between">
              <span className="text-sm font-semibold text-muted">Pilih Chapter</span>
              <button type="button" onClick={() => setSelected(allSelected ? [] : withContent.map((c) => c.id))} className="text-xs font-semibold text-brand">
                {allSelected ? "Batal Semua" : "Pilih Semua"}
              </button>
            </div>
            <div className="mt-2 flex max-h-60 flex-col gap-2 overflow-y-auto">
              {withContent.map((c) => (
                <label key={c.id} className="flex cursor-pointer items-center gap-3 rounded-xl border border-ink-500/60 bg-ink-700/40 px-3 py-2.5 text-sm">
                  <input type="checkbox" checked={selected.includes(c.id)} onChange={() => toggle(c.id)} className="h-4 w-4 accent-[#F97316]" />
                  <span className="truncate">{c.judul}</span>
                </label>
              ))}
            </div>
            <button
              type="button"
              onClick={exportPdf}
              disabled={selected.length === 0}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-brand px-5 py-3 font-bold text-white shadow-brand disabled:opacity-40"
            >
              <Download className="h-5 w-5" /> Ekspor {selected.length} Bab
            </button>
          </>
        )}
      </div>
    </div>
  );
}

function escapeHtml(s: string): string {
  return s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c] as string));
}
