"use client";

import { useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Dumbbell,
  FileCheck,
  HelpCircle,
  Info,
  Paperclip,
  School,
  Sparkles,
  X,
  type LucideIcon,
} from "lucide-react";
import { subjectsApi } from "@/lib/api/resources";
import { SubjectCombobox } from "@/components/app/subject-combobox";

export type ExamType = "uts" | "uas" | "kuis" | "latihan";

export interface Prediction {
  id: string;
  judul: string;
  mapel: string;
  tipe: ExamType;
  fileCount: number;
}

const TIPE: { value: ExamType; label: string; sub: string; icon: LucideIcon }[] = [
  { value: "uts", label: "UTS", sub: "Ujian Tengah Semester", icon: FileCheck },
  { value: "uas", label: "UAS", sub: "Ujian Akhir Semester", icon: School },
  { value: "kuis", label: "Kuis", sub: "Kuis atau Ulangan", icon: HelpCircle },
  { value: "latihan", label: "Latihan", sub: "Soal Latihan", icon: Dumbbell },
];

export function CreatePredictionModal({
  onClose,
  onCreate,
}: {
  onClose: () => void;
  onCreate: (p: Prediction) => void;
}) {
  const [step, setStep] = useState<1 | 2>(1);
  const [judul, setJudul] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [tipe, setTipe] = useState<ExamType>("uts");
  const [files, setFiles] = useState<File[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);
  const subjects = useQuery({ queryKey: ["subjects"], queryFn: subjectsApi.list });
  const mapel = subjects.data?.find((s) => s.id === subjectId)?.nama ?? "";

  const tipeLabel = TIPE.find((t) => t.value === tipe)?.label ?? "";

  return (
    <div className="fixed inset-0 z-50 grid place-items-center p-4">
      <button type="button" aria-hidden onClick={onClose} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div className="relative z-10 w-full max-w-lg rounded-xl2 border border-ink-500 bg-ink-800 p-6 shadow-2xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button type="button" onClick={onClose} className="text-muted transition hover:text-white">
              <X className="h-5 w-5" />
            </button>
            <h2 className="text-xl font-extrabold">Upload Soal Ujian</h2>
          </div>
          <span className="text-sm text-muted">Langkah {step} / 2</span>
        </div>

        {/* progress */}
        <div className="mt-4 flex gap-2">
          <span className="h-1 flex-1 rounded-full bg-brand" />
          <span className={`h-1 flex-1 rounded-full ${step === 2 ? "bg-brand" : "bg-ink-500"}`} />
        </div>

        {step === 1 ? (
          <div className="mt-6 flex flex-col gap-5">
            <label className="block">
              <span className="mb-1.5 block text-sm font-bold">Judul Koleksi</span>
              <input
                value={judul}
                onChange={(e) => setJudul(e.target.value)}
                placeholder="Contoh: UTS Kalkulus 2024"
                className="input-field"
              />
            </label>

            <div>
              <span className="mb-1.5 block text-sm font-bold">Mata Pelajaran</span>
              <SubjectCombobox value={subjectId} onChange={setSubjectId} />
            </div>

            <div>
              <span className="mb-2 block text-sm font-bold">Tipe Ujian</span>
              <div className="grid grid-cols-2 gap-3">
                {TIPE.map((t) => {
                  const active = tipe === t.value;
                  const Icon = t.icon;
                  return (
                    <button
                      key={t.value}
                      type="button"
                      onClick={() => setTipe(t.value)}
                      className={`rounded-2xl border p-4 text-center transition ${
                        active ? "border-brand bg-brand/10" : "border-ink-500/70 bg-ink-700/40 hover:border-ink-500"
                      }`}
                    >
                      <Icon className={`mx-auto h-6 w-6 ${active ? "text-brand" : "text-muted"}`} />
                      <p className={`mt-2 font-bold ${active ? "text-brand" : ""}`}>{t.label}</p>
                      <p className="text-xs text-muted">{t.sub}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            <p className="flex items-center gap-2 text-xs text-muted">
              <Info className="h-4 w-4" /> Pengguna gratis: 1 prediksi ujian seumur hidup
            </p>

            <button
              type="button"
              disabled={!judul.trim()}
              onClick={() => setStep(2)}
              className="rounded-2xl bg-brand px-5 py-3.5 font-bold text-white shadow-brand transition enabled:hover:bg-brand-600 disabled:opacity-40"
            >
              Lanjutkan
            </button>
          </div>
        ) : (
          <div className="mt-6 flex flex-col gap-5">
            <div>
              <h3 className="flex items-center gap-2 font-bold">
                <Sparkles className="h-5 w-5 text-brand" /> Upload File Soal
              </h3>
              <p className="mt-1 text-sm text-muted">
                Upload satu atau beberapa file soal ujian sebelumnya. AI akan
                menganalisis pola dan membuat prediksi soal.
              </p>
            </div>

            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="grid place-items-center rounded-2xl border-2 border-dashed border-ink-500 bg-ink-700/30 p-8 text-center transition hover:border-brand/60"
            >
              <span className="grid h-14 w-14 place-items-center rounded-full border border-ink-500 text-brand">
                <Paperclip className="h-6 w-6" />
              </span>
              <p className="mt-3 font-bold">Tap untuk memilih file</p>
              <p className="text-xs text-muted">PDF, DOCX, PPT, TXT, PNG, JPG</p>
            </button>
            <input
              ref={fileRef}
              type="file"
              multiple
              accept=".pdf,.docx,.ppt,.pptx,.txt,.png,.jpg,.jpeg"
              className="hidden"
              onChange={(e) => setFiles(Array.from(e.target.files ?? []))}
            />

            <div className="rounded-2xl border border-ink-500/60 bg-ink-700/40 p-4 text-sm">
              <p className="mb-2 flex items-center gap-2 font-bold">
                <Info className="h-4 w-4 text-muted" /> Ringkasan
              </p>
              <p className="text-muted">
                Judul: <span className="text-white">{judul || "-"}</span>
              </p>
              <p className="text-muted">
                Tipe: <span className="text-white">{tipeLabel}</span>
              </p>
              <p className="text-muted">
                File: <span className="text-white">{files.length} file</span>
              </p>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex-1 rounded-2xl border border-ink-500 px-5 py-3.5 font-bold text-white transition hover:bg-ink-600"
              >
                Kembali
              </button>
              <button
                type="button"
                disabled={files.length === 0}
                onClick={() =>
                  onCreate({
                    id: String(Date.now()),
                    judul: judul.trim(),
                    mapel: mapel.trim() || "Umum",
                    tipe,
                    fileCount: files.length,
                  })
                }
                className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-brand px-5 py-3.5 font-bold text-white shadow-brand transition enabled:hover:bg-brand-600 disabled:opacity-40"
              >
                <Sparkles className="h-4 w-4" /> Proses
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
