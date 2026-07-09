"use client";

import { useState } from "react";
import { Download, Eye, FileText, Link2, Loader2 } from "lucide-react";
import { materialsApi } from "@/lib/api/resources";
import type { Material, MaterialFile } from "@/lib/api/types";

const TIPE_LABEL: Record<string, string> = {
  file: "Dokumen",
  youtube: "YouTube",
  audio: "Audio",
  video: "Video",
  note: "Catatan",
};

const fmtSize = (b: number) => (b < 1024 * 1024 ? `${(b / 1024).toFixed(0)} KB` : `${(b / 1024 / 1024).toFixed(2)} MB`);

export function DokumenTab({ material }: { material: Material }) {
  return (
    <div className="mx-auto max-w-3xl">
      <h2 className="text-xl font-bold">Dokumen</h2>
      <p className="text-sm text-muted">
        Sumber materi · {TIPE_LABEL[material.tipe] ?? material.tipe}
      </p>

      {material.files.length > 0 ? (
        <div className="mt-4 flex flex-col gap-3">
          {material.files.map((f) => (
            <FileRow key={f.id} materialId={material.id} file={f} />
          ))}
        </div>
      ) : material.sourceUrl ? (
        <a href={material.sourceUrl} target="_blank" rel="noreferrer" className="card mt-4 flex items-center gap-2 p-4 text-sm text-brand hover:underline">
          <Link2 className="h-4 w-4" /> {material.sourceUrl}
        </a>
      ) : (
        <p className="mt-4 text-sm text-muted">
          Tidak ada file tersimpan. Aktifkan Supabase Storage (isi <code>SUPABASE_SERVICE_KEY</code>) agar file asli tersimpan &amp; bisa diunduh.
        </p>
      )}

      {material.rawText ? (
        <div className="mt-6">
          <p className="mb-2 text-sm font-semibold text-muted">Teks Terekstrak</p>
          <div className="card max-h-[40vh] overflow-auto whitespace-pre-wrap p-5 text-sm text-white/90">
            {material.rawText}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function FileRow({ materialId, file }: { materialId: string; file: MaterialFile }) {
  const [loading, setLoading] = useState<"download" | "preview" | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const isPdf = file.mime.includes("pdf");

  async function getUrl(): Promise<string | null> {
    const res = await materialsApi.fileUrl(materialId, file.id);
    return res.url;
  }

  async function onDownload() {
    setLoading("download");
    try {
      const url = await getUrl();
      if (url) window.open(url, "_blank", "noopener");
    } finally {
      setLoading(null);
    }
  }

  async function onPreview() {
    if (previewUrl) return setPreviewUrl(null);
    setLoading("preview");
    try {
      setPreviewUrl(await getUrl());
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="card p-4">
      <div className="flex items-center gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand/15 text-brand"><FileText className="h-5 w-5" /></span>
        <div className="min-w-0 flex-1">
          <p className="truncate font-semibold">{file.name}</p>
          <p className="text-xs text-muted">{fmtSize(file.size)}</p>
        </div>
        {isPdf ? (
          <button type="button" onClick={onPreview} className="flex items-center gap-1.5 rounded-xl border border-ink-500 px-3 py-2 text-sm font-semibold transition hover:bg-ink-600">
            {loading === "preview" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Eye className="h-4 w-4" />} {previewUrl ? "Tutup" : "Pratinjau"}
          </button>
        ) : null}
        <button type="button" onClick={onDownload} className="flex items-center gap-1.5 rounded-xl bg-brand px-3 py-2 text-sm font-bold text-white transition hover:bg-brand-600">
          {loading === "download" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />} Unduh
        </button>
      </div>
      {previewUrl ? (
        <iframe title={file.name} src={previewUrl} className="mt-3 h-[60vh] w-full rounded-xl border border-ink-500" />
      ) : null}
    </div>
  );
}
