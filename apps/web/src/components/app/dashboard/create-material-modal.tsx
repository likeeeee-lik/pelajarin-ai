"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Brain, FileText, Layers, Sparkles, UploadCloud, X, Zap, type LucideIcon } from "lucide-react";
import { materialsApi } from "@/lib/api/resources";
import type { MaterialType } from "@/lib/api/types";
import { SubjectCombobox } from "@/components/app/subject-combobox";

const DROP: Record<string, { accept: string; text: string; sub: string }> = {
  file: {
    accept: ".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt",
    text: "Drag & drop file di sini, atau klik untuk memilih",
    sub: "PDF, Word, PowerPoint, Excel, Text (Maks. 100MB per file)",
  },
  audio: {
    accept: "audio/*,.mp3,.wav",
    text: "Drag & drop file audio di sini, atau klik untuk memilih",
    sub: "MP3, WAV (Maks. 300MB per file)",
  },
  video: {
    accept: "video/*,.mp4,.mov",
    text: "Drag & drop file video di sini, atau klik untuk memilih",
    sub: "MP4, MOV (Maks. 500MB per file)",
  },
};

const MODES: { value: string; label: string; desc: string; icon: LucideIcon }[] = [
  { value: "kilat", label: "Kilat", desc: "Poin penting saja", icon: Zap },
  { value: "standar", label: "Standar", desc: "Seimbang", icon: Layers },
  { value: "lengkap", label: "Lengkap", desc: "Detail & mendalam", icon: Sparkles },
];
const GAYA = [
  { value: "formal", label: "Serius & Formal" },
  { value: "santai", label: "Ramah & Santai" },
  { value: "kreatif", label: "Menyenangkan & Kreatif" },
  { value: "akademis", label: "Akademis & Ilmiah" },
];
const BAHASA = [
  { value: "id", label: "🇮🇩 Bahasa Indonesia" },
  { value: "en", label: "🇺🇸 English" },
  { value: "ar", label: "🇸🇦 العربية (Arab)" },
  { value: "zh", label: "🇨🇳 中文 (Mandarin)" },
];

const fmtSize = (b: number) => `${(b / 1024 / 1024).toFixed(2)} MB`;
const stripExt = (n: string) => n.replace(/\.[^.]+$/, "");

export function CreateMaterialModal({ source, onClose }: { source: MaterialType; onClose: () => void }) {
  const router = useRouter();
  const qc = useQueryClient();
  const isNote = source === "note";
  const isFile = source === "file" || source === "audio" || source === "video";

  const [step, setStep] = useState<1 | 2>(1);
  const [judul, setJudul] = useState("");
  const [url, setUrl] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [subjectId, setSubjectId] = useState("");
  const [mode, setMode] = useState("standar");
  const [gaya, setGaya] = useState("santai");
  const [bahasa, setBahasa] = useState("id");

  const create = useMutation({
    mutationFn: () => {
      if (isFile) {
        const form = new FormData();
        form.append("file", file as File);
        form.append("judul", stripExt((file as File).name));
        form.append("tipe", source);
        if (subjectId) form.append("subjectId", subjectId);
        form.append("modeBelajar", mode);
        form.append("gayaPenulisan", gaya);
        form.append("bahasa", bahasa);
        return materialsApi.upload(form);
      }
      return materialsApi.create({
        judul: isNote ? judul.trim() : judul.trim() || "Catatan dari YouTube",
        tipe: source,
        subjectId: subjectId || undefined,
        sourceUrl: source === "youtube" ? url.trim() : undefined,
        modeBelajar: mode,
        gayaPenulisan: gaya,
        bahasa,
      });
    },
    onSuccess: (m) => {
      qc.invalidateQueries({ queryKey: ["materials"] });
      onClose();
      router.push(`/catatan/${m.id}`);
    },
  });

  const canStep1 = isFile ? file != null : source === "youtube" ? url.trim().length > 0 : true;
  const title = isNote ? "Buat Catatan Baru" : "Unggah File";

  return (
    <div className="fixed inset-0 z-50 grid place-items-center p-4">
      <button type="button" aria-hidden onClick={onClose} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div className="relative z-10 max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-xl2 border border-ink-500 bg-ink-800 p-6 shadow-2xl">
        {create.isPending ? <ProcessingOverlay /> : null}

        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-xl font-extrabold">{title}</h2>
          <button type="button" onClick={onClose} className="text-muted transition hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        {create.isError ? (
          <p className="mb-4 rounded-xl border border-rose-500/40 bg-rose-500/10 px-3 py-2.5 text-sm text-rose-400">
            {create.error instanceof Error ? create.error.message : "Gagal memproses. Coba lagi."}
          </p>
        ) : null}

        {/* ── Tulis Catatan: satu langkah ── */}
        {isNote ? (
          <div className="flex flex-col gap-5">
            <Field label="Judul Catatan" hint="Kosongkan untuk menggunakan nama default">
              <input value={judul} onChange={(e) => setJudul(e.target.value)} placeholder="Catatan Baru" className="input-field" />
            </Field>
            <Field label="Mata Pelajaran/Kuliah" hint="Opsional, bisa ditambahkan nanti" manage>
              <SubjectCombobox value={subjectId} onChange={setSubjectId} />
            </Field>
            <div className="flex justify-end gap-3">
              <button type="button" onClick={onClose} className="rounded-2xl border border-ink-500 px-5 py-2.5 font-semibold text-white hover:bg-ink-600">Batal</button>
              <button type="button" onClick={() => create.mutate()} className="rounded-2xl bg-brand px-5 py-2.5 font-bold text-white shadow-brand">Buat Catatan</button>
            </div>
          </div>
        ) : step === 1 ? (
          /* ── Langkah 1: sumber (dropzone / URL) ── */
          <div className="flex flex-col gap-5">
            {source === "youtube" ? (
              <Field label="URL Video YouTube" hint="Masukkan URL video YouTube yang ingin diubah menjadi catatan">
                <input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://www.youtube.com/watch?v=..." className="input-field" />
              </Field>
            ) : (
              <Dropzone source={source} file={file} onFile={setFile} />
            )}
            <div className="flex justify-between gap-3">
              <button type="button" onClick={onClose} className="rounded-2xl border border-ink-500 px-5 py-2.5 font-semibold text-white hover:bg-ink-600">Batal</button>
              <button type="button" disabled={!canStep1} onClick={() => setStep(2)} className="rounded-2xl bg-brand px-6 py-2.5 font-bold text-white shadow-brand disabled:opacity-40">Lanjutkan</button>
            </div>
          </div>
        ) : (
          /* ── Langkah 2: konfigurasi AI ── */
          <div className="flex flex-col gap-5">
            <Field label="Mata Pelajaran/Kuliah" manage>
              <SubjectCombobox value={subjectId} onChange={setSubjectId} />
            </Field>

            <div>
              <p className="mb-2 text-sm font-bold">Mode Belajar</p>
              <div className="grid grid-cols-3 gap-3">
                {MODES.map((m) => {
                  const on = mode === m.value;
                  const Icon = m.icon;
                  return (
                    <button key={m.value} type="button" onClick={() => setMode(m.value)} className={`rounded-2xl border p-4 text-center transition ${on ? "border-brand bg-brand/10" : "border-ink-500/70 bg-ink-700/40 hover:border-ink-500"}`}>
                      <Icon className={`mx-auto h-6 w-6 ${on ? "text-brand" : "text-muted"}`} />
                      <p className={`mt-2 font-bold ${on ? "text-brand" : ""}`}>{m.label}</p>
                      <p className="text-[11px] text-muted">{m.desc}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            <Field label="Gaya Penulisan">
              <SelectBox value={gaya} onChange={setGaya} options={GAYA} />
            </Field>
            <Field label="Bahasa Generasi" hint="Bahasa yang digunakan AI untuk menghasilkan catatan">
              <SelectBox value={bahasa} onChange={setBahasa} options={BAHASA} />
            </Field>

            {isFile && file ? (
              <div className="flex items-center gap-3 rounded-2xl border border-ink-500/60 bg-ink-700/40 px-4 py-3">
                <FileText className="h-5 w-5 text-sky-400" />
                <span className="min-w-0 flex-1 truncate text-sm">{file.name}</span>
                <span className="text-xs text-muted">{fmtSize(file.size)}</span>
              </div>
            ) : null}

            <div className="flex justify-between gap-3">
              <button type="button" onClick={() => setStep(1)} className="rounded-2xl border border-ink-500 px-5 py-2.5 font-semibold text-white hover:bg-ink-600">Kembali</button>
              <button type="button" onClick={() => create.mutate()} className="rounded-2xl bg-brand px-6 py-2.5 font-bold text-white shadow-brand">Lanjutkan</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Dropzone({ source, file, onFile }: { source: MaterialType; file: File | null; onFile: (f: File | null) => void }) {
  const ref = useRef<HTMLInputElement>(null);
  const [drag, setDrag] = useState(false);
  const meta = DROP[source] ?? DROP.file;

  return (
    <div>
      <div
        onClick={() => ref.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => { e.preventDefault(); setDrag(false); const f = e.dataTransfer.files?.[0]; if (f) onFile(f); }}
        className={`grid cursor-pointer place-items-center rounded-2xl border-2 border-dashed p-10 text-center transition ${drag ? "border-brand bg-brand/5" : "border-ink-500 bg-ink-700/20 hover:border-brand/60"}`}
      >
        <span className="grid h-16 w-16 place-items-center rounded-full bg-brand/15 text-brand">
          <UploadCloud className="h-7 w-7" />
        </span>
        <p className="mt-4 font-bold">{meta.text}</p>
        <p className="mt-1 text-xs text-muted">{meta.sub}</p>
      </div>
      <input ref={ref} type="file" accept={meta.accept} className="hidden" onChange={(e) => onFile(e.target.files?.[0] ?? null)} />

      {file ? (
        <div className="mt-3 flex items-center gap-3 rounded-2xl border border-ink-500/60 bg-ink-700/40 px-4 py-3">
          <FileText className="h-5 w-5 text-sky-400" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold">{file.name}</p>
            <p className="text-xs text-muted">{fmtSize(file.size)}</p>
          </div>
          <button type="button" onClick={(e) => { e.stopPropagation(); onFile(null); }} className="text-muted hover:text-white">
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : null}
    </div>
  );
}

function SelectBox({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: { value: string; label: string }[] }) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)} className="input-field">
      {options.map((o) => (
        <option key={o.value} value={o.value} className="bg-ink-700">{o.label}</option>
      ))}
    </select>
  );
}

function ProcessingOverlay() {
  return (
    <div className="absolute inset-0 z-30 grid place-items-center rounded-xl2 bg-ink-800/95">
      <div className="text-center">
        <div className="relative mx-auto h-24 w-24">
          <span className="absolute inset-0 animate-spin rounded-full border-4 border-ink-500 border-t-brand" />
          <span className="absolute inset-0 grid place-items-center">
            <Brain className="h-8 w-8 text-brand" />
          </span>
        </div>
        <h3 className="mt-4 text-lg font-extrabold">Memproses dengan AI</h3>
        <p className="mt-1 text-sm text-muted">Menganalisis konten dengan AI...</p>
        <div className="mx-auto mt-4 h-1.5 w-56 overflow-hidden rounded-full bg-ink-500/60">
          <div className="h-full w-1/3 animate-[loading_1.2s_ease-in-out_infinite] rounded-full bg-brand" />
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  hint,
  manage,
  children,
}: {
  label: string;
  hint?: string;
  manage?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="block">
      <div className="mb-1.5 flex items-center justify-between">
        <span className="text-sm font-bold">{label}</span>
        {manage ? <a href="/app/mata-pelajaran" className="text-xs font-semibold text-brand">Kelola mata pelajaran</a> : null}
      </div>
      {children}
      {hint ? <span className="mt-1 block text-xs text-muted">{hint}</span> : null}
    </div>
  );
}
