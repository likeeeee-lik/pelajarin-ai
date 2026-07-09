"use client";

import { useEffect, useState, type ReactNode } from "react";
import { markSignedIn } from "@/lib/session";
import { Sidebar } from "./sidebar";

/** Kerangka area app (setelah login): sidebar + konten. */
export function AppShell({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  // Menandai sesi login: masuk dashboard = dianggap login (mode stub).
  useEffect(() => markSignedIn(), []);
  return (
    <div className="bg-app flex min-h-screen">
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((c) => !c)} />
      <main className="min-w-0 flex-1 px-5 py-6 sm:px-8 sm:py-8">
        <div className="mx-auto max-w-6xl">{children}</div>
      </main>
    </div>
  );
}
