"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, Plus, X } from "lucide-react";
import { SOURCES } from "./sources";
import { materialsApi, subjectsApi } from "@/lib/api/resources";
import type { MaterialType } from "@/lib/api/types";

const MODES = [
  { value: "kilat", label: "Kilat", desc: "Poin penting" },
  { value: "standar", label: "Standar", desc: "Seimbang" },
  { value: "lengkap", label: "Lengkap", desc: "Detail" },
];
const GAYA = [
  { value: "formal", label: "Serius & Formal" },
  { value: "santai", label: "Ramah & Santai" },
  { value: "kreatif", label: "Menyenangkan & Kreatif" },
  { value: "akademis", label: "Akademis & Ilmiah" },
];
const BAHASA = [
  { value: "id", label: "Bahasa Indonesia" },
  { value: "en", label: "English" },
  { value: "ar", label: "العربية (Arab)" },
  { value: "zh", label: "中文 (Mandarin)" },
];

export function CreateMaterialModal({ source, onClose }: { source: MaterialType; onClose: () => void }) {
  const router = useRouter();
  const qc = useQueryClient();
  const meta = SOURCES.find((s) => s.id === source);
  const Icon = meta?.icon;

  const subjects = useQuery({ queryKey: ["subjects"], queryFn: subjectsApi.list });

  const [judul, setJudul] = useState("");
  const [konten, setKonten] = useState("");
  const [url, setUrl] = useState("");
  const [fileName, setFileName] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [mode, setMode] = useState("standar");
  const [gaya, setGaya] = useState("santai");
  const [bahasa, setBahasa] = useState("id");
  const fileRef = useRef<HTMLInputElement>(null);

  const isFile = source === "file" || source === "audio" || source === "video";
  const canCreate =
    judul.trim().length > 0 &&
    (source === "note" ? true : source === "youtube" ? url.trim().length > 0 : fileName.length > 0);

  const create = useMutation({
    mutationFn: () =>
      materialsApi.create({
        judul: judul.trim(),
        tipe: source,
        subjectId: subjectId || undefined,
        sourceUrl: source === "youtube" ? url.trim() : undefined,
        rawText: source === "note" ? konten.trim() : fileName || undefined,
        modeBelajar: mode,
        gayaPenulisan: gaya,
        bahasa,
      }),
    onSuccess: (m) => {
      qc.invalidateQueries({ queryKey: ["materials"] });
      onClose();
      router.push(`/catatan/${m.id}`);
    },
  });

  return (
    <div className="fixed inset-0 z-50 grid place-items-center p-4">
      <button type="button" aria-hidden onClick={onClose} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div className="relative z-10 max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl2 border border-ink-500 bg-ink-800 p-6 shadow-2xl">
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
            <Field label="Isi Catatan (opsional)">
              <textarea value={konten} onChange={(e) => setKonten(e.target.value)} rows={4} placeholder="Tulis atau tempel materi..." className="input-field resize-y" />
            </Field>
          ) : source === "youtube" ? (
            <Field label="Link YouTube">
              <input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://youtube.com/watch?v=..." className="input-field" />
            </Field>
          ) : (
            <Field label="File">
              <button type="button" onClick={() => fileRef.current?.click()} className="w-full rounded-2xl border-2 border-dashed border-ink-500 bg-ink-700/30 px-4 py-6 text-center text-sm text-muted transition hover:border-brand/60">
                {fileName ? <span className="text-white">{fileName}</span> : "Tap untuk memilih file"}
                <span className="mt-1 block text-xs">{meta?.desc}</span>
              </button>
              <input ref={fileRef} type="file" className="hidden" onChange={(e) => setFileName(e.target.files?.[0]?.name ?? "")} />
            </Field>
          )}

          <Field label="Mata Pelajaran (opsional)">
            <SubjectSelect
              value={subjectId}
              onChange={setSubjectId}
              subjects={subjects.data ?? []}
              onCreated={() => qc.invalidateQueries({ queryKey: ["subjects"] })}
            />
          </Field>

          {source !== "note" ? (
            <>
              <Field label="Mode Belajar">
                <div className="grid grid-cols-3 gap-2">
                  {MODES.map((m) => (
                    <button key={m.value} type="button" onClick={() => setMode(m.value)} className={`rounded-xl border p-2.5 text-center transition ${mode === m.value ? "border-brand bg-brand/10 text-brand" : "border-ink-500/70 bg-ink-700/40"}`}>
                      <p className="text-sm font-bold">{m.label}</p>
                      <p className="text-[11px] text-muted">{m.desc}</p>
                    </button>
                  ))}
                </div>
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Gaya Penulisan">
                  <select value={gaya} onChange={(e) => setGaya(e.target.value)} className="input-field">
                    {GAYA.map((g) => <option key={g.value} value={g.value} className="bg-ink-700">{g.label}</option>)}
                  </select>
                </Field>
                <Field label="Bahasa">
                  <select value={bahasa} onChange={(e) => setBahasa(e.target.value)} className="input-field">
                    {BAHASA.map((b) => <option key={b.value} value={b.value} className="bg-ink-700">{b.label}</option>)}
                  </select>
                </Field>
              </div>
            </>
          ) : null}

          {create.isError ? <p className="text-sm text-red-400">Gagal membuat materi. Pastikan API berjalan.</p> : null}

          <button
            type="button"
            disabled={!canCreate || create.isPending}
            onClick={() => create.mutate()}
            className="flex items-center justify-center gap-2 rounded-2xl bg-brand px-5 py-3.5 font-bold text-white shadow-brand transition enabled:hover:bg-brand-600 disabled:opacity-40"
          >
            {create.isPending ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" /> Memproses dengan AI...
              </>
            ) : (
              "Buat"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

function SubjectSelect({
  value,
  onChange,
  subjects,
  onCreated,
}: {
  value: string;
  onChange: (v: string) => void;
  subjects: { id: string; nama: string }[];
  onCreated: () => void;
}) {
  const [creating, setCreating] = useState(false);
  const [nama, setNama] = useState("");
  const createSubject = useMutation({
    mutationFn: () => subjectsApi.create(nama.trim()),
    onSuccess: (s) => {
      onCreated();
      onChange(s.id);
      setCreating(false);
      setNama("");
    },
  });

  if (creating) {
    return (
      <div className="flex gap-2">
        <input autoFocus value={nama} onChange={(e) => setNama(e.target.value)} placeholder="Nama mata pelajaran..." className="input-field flex-1" />
        <button type="button" disabled={!nama.trim() || createSubject.isPending} onClick={() => createSubject.mutate()} className="rounded-xl bg-brand px-4 font-bold text-white disabled:opacity-40">
          Buat
        </button>
        <button type="button" onClick={() => setCreating(false)} className="px-2 text-sm text-muted">Batal</button>
      </div>
    );
  }
  return (
    <div className="flex gap-2">
      <select value={value} onChange={(e) => onChange(e.target.value)} className="input-field flex-1">
        <option value="" className="bg-ink-700">Tanpa kategori</option>
        {subjects.map((s) => <option key={s.id} value={s.id} className="bg-ink-700">{s.nama}</option>)}
      </select>
      <button type="button" onClick={() => setCreating(true)} className="grid w-11 place-items-center rounded-xl border border-ink-500 text-muted transition hover:text-white" title="Buat mata pelajaran">
        <Plus className="h-4 w-4" />
      </button>
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
