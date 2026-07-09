"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Bot, Loader2, Plus, Send } from "lucide-react";
import { chatApi } from "@/lib/api/resources";
import type { Material } from "@/lib/api/types";
import { ChapterPicker } from "../chapter-picker";

const SUGGESTIONS = [
  "Jelaskan konsep utama dari materi ini",
  "Buat ringkasan singkat dari materi ini",
  "Apa poin-poin penting yang harus saya ingat?",
  "Berikan contoh soal dari materi ini",
];

export function ChatTab({ material }: { material: Material }) {
  const qc = useQueryClient();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [text, setText] = useState("");
  const [chapterIds, setChapterIds] = useState<string[]>(material.chapters.map((c) => c.id));
  const [showCtx, setShowCtx] = useState(false);

  const sessions = useQuery({ queryKey: ["chat-sessions", material.id], queryFn: () => chatApi.listSessions(material.id) });
  const messages = useQuery({
    queryKey: ["chat-messages", activeId],
    queryFn: () => chatApi.getMessages(activeId as string),
    enabled: !!activeId,
  });

  const send = useMutation({
    mutationFn: async (question: string) => {
      let sid = activeId;
      if (!sid) {
        const s = await chatApi.createSession(material.id);
        sid = s.id;
        setActiveId(sid);
        qc.invalidateQueries({ queryKey: ["chat-sessions", material.id] });
      }
      await chatApi.sendMessage(sid, { question, chapterIds });
      return sid;
    },
    onSuccess: (sid) => qc.invalidateQueries({ queryKey: ["chat-messages", sid] }),
  });

  function submit(q: string) {
    const question = q.trim();
    if (!question || send.isPending) return;
    setText("");
    send.mutate(question);
  }

  const msgs = messages.data ?? [];

  return (
    <div className="flex h-[calc(100vh-9rem)] gap-4">
      {/* Sesi */}
      <div className="hidden w-56 shrink-0 flex-col gap-2 sm:flex">
        <button type="button" onClick={() => { setActiveId(null); }} className="flex items-center justify-center gap-2 rounded-xl bg-brand px-3 py-2 text-sm font-bold text-white">
          <Plus className="h-4 w-4" /> New Chat
        </button>
        <div className="flex flex-col gap-1 overflow-y-auto">
          {(sessions.data ?? []).map((s, i) => (
            <button key={s.id} type="button" onClick={() => setActiveId(s.id)} className={`rounded-lg px-3 py-2 text-left text-sm transition ${activeId === s.id ? "bg-ink-600 text-white" : "text-muted hover:bg-ink-700"}`}>
              Percakapan {(sessions.data?.length ?? 0) - i}
            </button>
          ))}
        </div>
      </div>

      {/* Area chat */}
      <div className="flex min-w-0 flex-1 flex-col rounded-xl2 border border-ink-500/60 bg-ink-800/40">
        <div className="flex items-center justify-between border-b border-ink-500/50 px-4 py-2.5">
          <span className="text-sm font-semibold">Asisten AI</span>
          <button type="button" onClick={() => setShowCtx((v) => !v)} className="rounded-lg border border-ink-500 px-3 py-1 text-xs text-muted hover:text-white">
            Konteks: {chapterIds.length === material.chapters.length ? "Semua chapter" : `${chapterIds.length} bab`}
          </button>
        </div>
        {showCtx ? (
          <div className="border-b border-ink-500/50 p-3"><ChapterPicker chapters={material.chapters} selected={chapterIds} onChange={setChapterIds} /></div>
        ) : null}

        <div className="flex-1 overflow-y-auto p-4">
          {msgs.length === 0 ? (
            <div className="grid h-full place-items-center text-center">
              <div>
                <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-brand/15 text-brand"><Bot className="h-7 w-7" /></span>
                <p className="mt-4 font-bold">{material.judul}</p>
                <p className="mx-auto mt-1 max-w-xs text-sm text-muted">Tanyakan tentang catatan ini untuk penjelasan, ringkasan, atau info tambahan.</p>
                <div className="mt-5 grid gap-2 sm:grid-cols-2">
                  {SUGGESTIONS.map((s) => (
                    <button key={s} type="button" onClick={() => submit(s)} className="rounded-xl border border-ink-500/60 bg-ink-700/40 p-3 text-left text-sm text-muted transition hover:text-white">
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {msgs.map((m) => (
                <div key={m.id} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${m.role === "user" ? "bg-brand text-white" : "md bg-ink-700/60"}`}>
                    {m.role === "user" ? m.konten : <ReactMarkdown remarkPlugins={[remarkGfm]}>{m.konten}</ReactMarkdown>}
                  </div>
                </div>
              ))}
              {send.isPending ? <div className="flex justify-start"><div className="rounded-2xl bg-ink-700/60 px-4 py-2.5"><Loader2 className="h-4 w-4 animate-spin text-muted" /></div></div> : null}
            </div>
          )}
        </div>

        <div className="border-t border-ink-500/50 p-3">
          <div className="flex items-center gap-2">
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && submit(text)}
              placeholder="Tanyakan sesuatu tentang catatan ini..."
              className="input-field flex-1"
            />
            <button type="button" onClick={() => submit(text)} disabled={!text.trim() || send.isPending} className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brand text-white disabled:opacity-40">
              <Send className="h-4 w-4" />
            </button>
          </div>
          <p className="mt-1.5 text-center text-[11px] text-muted">AI dapat membuat kesalahan. Periksa informasi penting.</p>
        </div>
      </div>
    </div>
  );
}
