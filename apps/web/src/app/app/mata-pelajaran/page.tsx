"use client";

import { useState } from "react";
import { BookOpen, Folder, Plus, Trash2 } from "lucide-react";
import { addSubject, removeSubject, useMaterials, useSubjects } from "@/lib/store";

export default function MataPelajaranPage() {
  const subjects = useSubjects();
  const materials = useMaterials();
  const [nama, setNama] = useState("");

  const totalCatatan = materials.length;
  const catatanOf = (id: string) => materials.filter((m) => m.subjectId === id).length;

  function add() {
    const trimmed = nama.trim();
    if (!trimmed) return;
    addSubject(trimmed);
    setNama("");
  }

  return (
    <div className="flex flex-col gap-6">
      <header className="flex items-center gap-3">
        <BookOpen className="h-8 w-8 text-brand" />
        <div>
          <h1 className="text-3xl font-extrabold">Mata Pelajaran</h1>
          <p className="text-sm text-muted">
            Kelola daftar mata pelajaran untuk mengorganisir catatan Anda
          </p>
        </div>
      </header>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="card p-6">
          <h2 className="text-lg font-bold">Tambah Mata Pelajaran Baru</h2>
          <div className="mt-4 flex gap-3">
            <input
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && add()}
              placeholder="Nama mata pelajaran baru..."
              className="input-field flex-1"
            />
            <button
              type="button"
              onClick={add}
              disabled={!nama.trim()}
              className="flex items-center gap-2 rounded-2xl bg-brand px-5 py-3 font-bold text-white shadow-brand transition enabled:hover:bg-brand-600 disabled:opacity-40"
            >
              <Plus className="h-4 w-4" /> Tambah
            </button>
          </div>
        </div>

        <div className="card p-6">
          <h2 className="text-lg font-bold">Statistik</h2>
          <div className="mt-4 flex gap-10">
            <div>
              <p className="text-3xl font-extrabold text-brand">{subjects.length}</p>
              <p className="text-sm text-muted">Total Mata Pelajaran</p>
            </div>
            <div>
              <p className="text-3xl font-extrabold">{totalCatatan}</p>
              <p className="text-sm text-muted">Total Catatan</p>
            </div>
          </div>
        </div>
      </div>

      <section>
        <h2 className="mb-4 text-xl font-bold">Daftar Mata Pelajaran</h2>
        {subjects.length === 0 ? (
          <div className="card grid place-items-center p-12 text-center">
            <Folder className="h-10 w-10 text-muted" />
            <p className="mt-4 font-semibold">Belum ada mata pelajaran</p>
            <p className="mt-1 text-sm text-muted">
              Tambahkan mata pelajaran pertama Anda di atas
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {subjects.map((s) => (
              <div key={s.id} className="card flex items-center gap-3 p-5">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand/15 text-brand">
                  <Folder className="h-5 w-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-bold">{s.nama}</p>
                  <p className="text-xs text-muted">{catatanOf(s.id)} catatan</p>
                </div>
                <button
                  type="button"
                  onClick={() => removeSubject(s.id)}
                  aria-label={`Hapus ${s.nama}`}
                  className="grid h-9 w-9 place-items-center rounded-lg text-muted transition hover:bg-red-500/10 hover:text-red-400"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
