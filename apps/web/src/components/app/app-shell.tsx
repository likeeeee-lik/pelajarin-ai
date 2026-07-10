"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { meApi } from "@/lib/api/resources";
import { markSignedIn, takeOnboardingPending } from "@/lib/session";
import { useSession } from "@/lib/use-session";
import { Sidebar } from "./sidebar";
import { VerifyBanner } from "./verify-banner";

const MODE = process.env.NEXT_PUBLIC_AUTH_MODE ?? "stub";

/** Kerangka area app (setelah login): sidebar + konten. */
export function AppShell({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const router = useRouter();
  const qc = useQueryClient();
  const { profile } = useSession();

  // Menandai sesi login: masuk dashboard = dianggap login (mode stub).
  useEffect(() => markSignedIn(), []);

  /**
   * Gate onboarding (aktif saat auth nyata; di stub dev dibiarkan agar tak mengganggu).
   * - Wizard anonim (funnel) meninggalkan penanda → tandai selesai di DB.
   * - Login langsung tanpa pernah onboarding → arahkan ke wizard.
   */
  useEffect(() => {
    if (MODE === "stub" || !profile || profile.onboardingCompleted) return;
    if (takeOnboardingPending()) {
      meApi
        .update({ onboardingCompleted: true })
        .then((updated) => qc.setQueryData(["me"], updated))
        .catch(() => {
          /* biarkan; akan dicoba lagi saat kunjungan berikutnya */
        });
      return;
    }
    router.replace("/onboarding");
  }, [profile, router, qc]);

  return (
    <div className="bg-app flex min-h-screen">
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((c) => !c)} />
      <main className="min-w-0 flex-1 px-5 py-6 sm:px-8 sm:py-8">
        <div className="mx-auto max-w-6xl">
          <VerifyBanner />
          {children}
        </div>
      </main>
    </div>
  );
}
