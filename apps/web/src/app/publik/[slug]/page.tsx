"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { BookOpen, Loader2 } from "lucide-react";
import { LogoWordmark } from "@/components/logo";
import { publicApi } from "@/lib/api/resources";

export default function PublicNotePage() {
  const params = useParams<{ slug: string }>();
  const q = useQuery({ queryKey: ["public", params.slug], queryFn: () => publicApi.get(params.slug) });

  return (
    <main className="bg-app min-h-screen">
      <header className="border-b border-ink-500/40">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-5 py-4">
          <Link href="/"><LogoWordmark /></Link>
          <Link href="/daftar" className="rounded-xl bg-brand px-4 py-2 text-sm font-bold text-white shadow-brand">Coba Gratis</Link>
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-5 py-10">
        {q.isLoading ? (
          <div className="grid h-[50vh] place-items-center text-muted"><Loader2 className="h-7 w-7 animate-spin" /></div>
        ) : q.isError || !q.data ? (
          <div className="card p-10 text-center text-muted">Catatan tidak ditemukan atau tidak dibagikan.</div>
        ) : (
          <article>
            <h1 className="text-4xl font-extrabold">{q.data.judul}</h1>
            <p className="mt-2 flex items-center gap-2 text-sm text-muted">
              <BookOpen className="h-4 w-4" /> {q.data.subject?.nama ?? "Umum"} · dibagikan via Pelajarin.ai
            </p>

            <div className="mt-8 flex flex-col gap-10">
              {q.data.chapters.length === 0 ? (
                <p className="text-muted">Belum ada bab yang bisa ditampilkan.</p>
              ) : (
                q.data.chapters.map((c) => (
                  <section key={c.urutan}>
                    <h2 className="mb-3 border-b border-ink-500/50 pb-2 text-2xl font-extrabold">{c.judul}</h2>
                    <div className="md">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>{c.kontenMd ?? ""}</ReactMarkdown>
                    </div>
                  </section>
                ))
              )}
            </div>
          </article>
        )}
      </div>
    </main>
  );
}
