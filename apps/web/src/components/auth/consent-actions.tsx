"use client";

import { useRouter } from "next/navigation";
import { isLogtoMode, completeConsent } from "@/lib/auth";

export function ConsentActions() {
  const router = useRouter();

  function onAllow() {
    if (isLogtoMode()) {
      completeConsent();
      return;
    }
    // Onboarding sudah dilakukan sebelum daftar (funnel), jadi register & login
    // sama-sama masuk ke app.
    router.push("/app");
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <button
        type="button"
        onClick={onAllow}
        className="w-full rounded-2xl bg-brand px-5 py-3.5 text-sm font-bold text-white shadow-brand transition hover:bg-brand-600 active:translate-y-px"
      >
        Allow access
      </button>
      <button
        type="button"
        onClick={() => router.push("/")}
        className="text-sm font-semibold text-muted transition hover:text-white"
      >
        Deny
      </button>
    </div>
  );
}
