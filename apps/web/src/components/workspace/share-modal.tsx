"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Check, Copy, Globe, Link2, Loader2, Lock, X } from "lucide-react";
import { materialsApi } from "@/lib/api/resources";

export function ShareModal({ materialId, onClose }: { materialId: string; onClose: () => void }) {
  const qc = useQueryClient();
  const material = useQuery({ queryKey: ["material", materialId], queryFn: () => materialsApi.get(materialId) });
  const [copied, setCopied] = useState(false);

  const toggle = useMutation({
    mutationFn: (enable: boolean) => materialsApi.share(materialId, enable),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["material", materialId] }),
  });

  const isPublic = material.data?.sharePublic ?? false;
  const slug = material.data?.shareSlug ?? null;
  const link = slug && typeof window !== "undefined" ? `${window.location.origin}/publik/${slug}` : "";

  async function copy() {
    if (!link) return;
    await navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center p-4">
      <button type="button" aria-hidden onClick={onClose} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div className="relative z-10 w-full max-w-md rounded-xl2 border border-ink-500 bg-ink-800 p-6 shadow-2xl">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-extrabold">Bagikan Catatan</h2>
            <p className="mt-1 text-sm text-muted">Jadikan catatan ini publik untuk membagikannya</p>
          </div>
          <button type="button" onClick={onClose} className="text-muted hover:text-white"><X className="h-5 w-5" /></button>
        </div>

        <div className="mt-5 rounded-2xl border border-ink-500/60 bg-ink-700/40 p-4">
          <div className="flex items-center gap-3">
            <span className={`grid h-10 w-10 place-items-center rounded-xl ${isPublic ? "bg-brand/15 text-brand" : "bg-ink-600 text-muted"}`}>
              {isPublic ? <Globe className="h-5 w-5" /> : <Lock className="h-5 w-5" />}
            </span>
            <div className="flex-1">
              <p className="font-bold">{isPublic ? "Publik" : "Privat"}</p>
              <p className="text-xs text-muted">{isPublic ? "Siapa pun dengan link dapat melihat" : "Hanya kamu yang dapat melihat"}</p>
            </div>
            <button
              type="button"
              onClick={() => toggle.mutate(!isPublic)}
              disabled={toggle.isPending || material.isLoading}
              className={`rounded-xl px-4 py-2 text-sm font-bold transition disabled:opacity-60 ${isPublic ? "border border-ink-500 text-white hover:bg-ink-600" : "bg-brand text-white shadow-brand hover:bg-brand-600"}`}
            >
              {toggle.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : isPublic ? "Nonaktifkan" : "Aktifkan"}
            </button>
          </div>

          {isPublic && link ? (
            <div className="mt-3 flex items-center gap-2 rounded-xl border border-ink-500/60 bg-ink-800 px-3 py-2">
              <Link2 className="h-4 w-4 shrink-0 text-muted" />
              <span className="min-w-0 flex-1 truncate text-sm text-brand">{link}</span>
              <button type="button" onClick={copy} className="flex items-center gap-1 rounded-lg border border-ink-500 px-2.5 py-1 text-xs font-semibold hover:bg-ink-600">
                {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />} {copied ? "Tersalin" : "Salin"}
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
