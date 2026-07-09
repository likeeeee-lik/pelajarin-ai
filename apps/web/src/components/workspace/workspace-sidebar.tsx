"use client";

import Link from "next/link";
import { ChevronLeft, Sparkles } from "lucide-react";
import { LogoMark } from "@/components/logo";
import { FocusTimer } from "./focus-timer";
import { WORKSPACE_TABS, type WorkspaceTab } from "./tabs-config";

export function WorkspaceSidebar({
  active,
  onChange,
}: {
  active: WorkspaceTab;
  onChange: (t: WorkspaceTab) => void;
}) {
  return (
    <aside className="sticky top-0 flex h-screen w-64 shrink-0 flex-col border-r border-ink-500/50 bg-ink-800/70 p-3 backdrop-blur">
      <Link href="/app" className="mb-2 flex items-center gap-2 px-1 py-2">
        <LogoMark className="h-7 w-7 text-white" />
        <span className="font-extrabold tracking-tight">pelajarin.ai</span>
      </Link>
      <Link href="/app" className="mb-3 flex items-center gap-2 rounded-lg px-2 py-2 text-sm text-muted transition hover:bg-ink-600 hover:text-white">
        <ChevronLeft className="h-4 w-4" /> Kembali
      </Link>

      <nav className="flex flex-1 flex-col gap-1 border-t border-ink-500/40 pt-3">
        {WORKSPACE_TABS.map((t) => {
          const Icon = t.icon;
          const on = active === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => onChange(t.id)}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition ${
                on ? "bg-brand text-white shadow-brand" : "text-muted hover:bg-ink-600 hover:text-white"
              }`}
            >
              <Icon className="h-5 w-5 shrink-0" /> {t.label}
            </button>
          );
        })}
      </nav>

      <Link href="/app/upgrade" className="my-3 flex items-center justify-center gap-2 rounded-xl bg-brand px-3 py-2.5 text-sm font-bold text-white shadow-brand">
        <Sparkles className="h-4 w-4" /> Tingkatkan
      </Link>

      <FocusTimer />
    </aside>
  );
}
