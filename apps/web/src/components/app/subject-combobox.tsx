"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Check, ChevronDown, Loader2, Plus, Search } from "lucide-react";
import { subjectsApi } from "@/lib/api/resources";

/** Combobox mata pelajaran: cari, pilih, atau buat baru dari input. */
export function SubjectCombobox({
  value,
  onChange,
}: {
  value: string;
  onChange: (id: string) => void;
}) {
  const qc = useQueryClient();
  const subjects = useQuery({ queryKey: ["subjects"], queryFn: subjectsApi.list });
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");

  const list = subjects.data ?? [];
  const selected = list.find((s) => s.id === value);
  const filtered = list.filter((s) => s.nama.toLowerCase().includes(q.trim().toLowerCase()));
  const exact = list.some((s) => s.nama.toLowerCase() === q.trim().toLowerCase());

  const createSubject = useMutation({
    mutationFn: () => subjectsApi.create(q.trim()),
    onSuccess: (s) => {
      qc.invalidateQueries({ queryKey: ["subjects"] });
      onChange(s.id);
      setOpen(false);
      setQ("");
    },
  });

  return (
    <div className="relative">
      <button type="button" onClick={() => setOpen((o) => !o)} className="flex w-full items-center justify-between rounded-2xl border border-ink-500 bg-ink-700/60 px-4 py-3 text-left">
        <span className={selected ? "" : "text-muted"}>{selected ? selected.nama : "Pilih mata pelajaran..."}</span>
        <ChevronDown className="h-4 w-4 text-muted" />
      </button>

      {open ? (
        <>
          <button type="button" aria-hidden onClick={() => setOpen(false)} className="fixed inset-0 z-10 cursor-default" />
          <div className="absolute z-20 mt-2 w-full rounded-2xl border border-ink-500 bg-ink-800 p-2 shadow-xl">
            <div className="flex items-center gap-2 rounded-xl border border-ink-500/60 bg-ink-700/50 px-3 py-2">
              <Search className="h-4 w-4 text-muted" />
              <input
                autoFocus
                value={q}
                onChange={(e) => setQ(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && q.trim() && !exact && !createSubject.isPending) {
                    e.preventDefault();
                    createSubject.mutate();
                  }
                }}
                placeholder="Cari atau ketik untuk membuat..."
                className="w-full bg-transparent text-sm outline-none"
              />
            </div>
            <div className="mt-2 max-h-56 overflow-y-auto">
              {value ? (
                <button type="button" onClick={() => { onChange(""); setOpen(false); }} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-muted hover:bg-ink-700">
                  Tanpa kategori
                </button>
              ) : null}
              {filtered.map((s) => (
                <button key={s.id} type="button" onClick={() => { onChange(s.id); setOpen(false); }} className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm hover:bg-ink-700">
                  {s.nama}
                  {value === s.id ? <Check className="h-4 w-4 text-brand" /> : null}
                </button>
              ))}

              {filtered.length === 0 ? (
                <p className="px-3 py-3 text-center text-sm text-muted">
                  {q.trim()
                    ? "Tidak ada mata pelajaran yang ditemukan. Ketik sesuatu untuk membuat"
                    : "Belum ada mata pelajaran. Ketik untuk membuat."}
                </p>
              ) : null}

              {q.trim() && !exact ? (
                <button
                  type="button"
                  onClick={() => createSubject.mutate()}
                  disabled={createSubject.isPending}
                  className="mt-1 flex w-full items-center justify-center gap-2 rounded-xl border border-brand/50 bg-brand/10 px-3 py-2.5 text-sm font-bold text-brand transition hover:bg-brand/20 disabled:opacity-60"
                >
                  {createSubject.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                  Buat &quot;{q.trim()}&quot;
                </button>
              ) : null}
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}
