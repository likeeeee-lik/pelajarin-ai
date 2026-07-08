"use client";

import { useRef, useState } from "react";
import { X } from "lucide-react";
import { SOURCES } from "./sources";
import { addMaterial, useSubjects, type MaterialType } from "@/lib/store";

export function CreateMaterialModal({
  source,
  onClose,
}: {
  source: MaterialType;
  onClose: () => void;
}) {
  const subjects = useSubjects();
  const meta = SOURCES.find((s) => s.id === source);
  const Icon = meta?.icon;

  const [judul, setJudul] = useState("");
  const [konten, setKonten] = useState("");
  const [url, setUrl] = useState("");
  const [fileName, setFileName] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const isFileSource = source === "file" || source === "audio" || source === "video";
  const canCreate =
    judul.trim().length > 0 &&
    (source === "note" ? konten.trim().length > 0 : source === "youtube" ? url.trim().length > 0 : fileName.length > 0);

  function create() {
    if (!canCreate) return;
    addMaterial({
      judul: judul.trim(),
      tipe: source,
      subjectId: subjectId || undefined,
      konten: source === "note" ? konten.trim() : undefined,
      sourceUrl: source === "youtube" ? url.trim() : undefined,
      fileName: isFileSource ? fileName : undefined,
      status: source === "note" ? "ready" : "processing",
    });
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center p-4">
      <button type="button" aria-hidden onClick={onClose} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div className="relative z-10 w-full max-w-lg rounded-xl2 border border-ink-500 bg-ink-800 p-6 shadow-2xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {Icon && meta ? (
              <span className={`grid h-10 w-10 place-items-center rounded-xl ${meta.color}`}>
                <Icon className="h-5 w-5" />
              </span>
            ) : null}
            <h2 className="text-lg font-extrabold">{meta?.label ?? "Buat Materi"}</h2>
          </div>
          <button type="button" onClick={onClose} className="text-muted transition hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-5 flex flex-col gap-4">
          <Field label="Judul">
            <input value={judul} onChange={(e) => setJudul(e.target.value)} placeholder="Beri judul materi..." className="input-field" />
          </Field>

          {source === "note" ? (
            <Field label="Isi Catatan">
              <textarea
                value={konten}
                onChange={(e) => setKonten(e.target.value)}
                rows={5}
                placeholder="Tulis catatanmu di sini..."
                className="input-field resize-y"
              />
            </Field>
          ) : source === "youtube" ? (
            <Field label="Link YouTube">
              <input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://youtube.com/watch?v=..." className="input-field" />
            </Field>
          ) : (
            <Field label="File">
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="w-full rounded-2xl border-2 border-dashed border-ink-500 bg-ink-700/30 px-4 py-6 text-center text-sm text-muted transition hover:border-brand/60"
              >
                {fileName ? <span className="text-white">{fileName}</span> : "Tap untuk memilih file"}
                <span className="mt-1 block text-xs">{meta?.desc}</span>
              </button>
              <input
                ref={fileRef}
                type="file"
                className="hidden"
                onChange={(e) => setFileName(e.target.files?.[0]?.name ?? "")}
              />
            </Field>
          )}

          <Field label="Mata Pelajaran (opsional)">
            <select value={subjectId} onChange={(e) => setSubjectId(e.target.value)} className="input-field">
              <option value="" className="bg-ink-700">
                Tanpa kategori
              </option>
              {subjects.map((s) => (
                <option key={s.id} value={s.id} className="bg-ink-700">
                  {s.nama}
                </option>
              ))}
            </select>
          </Field>

          {source !== "note" ? (
            <p className="text-xs text-muted">
              Materi akan berstatus <span className="text-amber-400">diproses</span> — pembuatan
              catatan/flashcard oleh AI menyusul saat backend AI aktif.
            </p>
          ) : null}

          <button
            type="button"
            disabled={!canCreate}
            onClick={create}
            className="rounded-2xl bg-brand px-5 py-3.5 font-bold text-white shadow-brand transition enabled:hover:bg-brand-600 disabled:opacity-40"
          >
            Buat
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-semibold text-muted">{label}</span>
      {children}
    </label>
  );
}
