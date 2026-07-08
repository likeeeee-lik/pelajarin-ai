"use client";

import { useRouter } from "next/navigation";

/** Tombol "Daftar dengan Email" (oranye, ikon sparkle) di halaman entry. */
export function EmailSignupButton() {
  const router = useRouter();
  return (
    <button
      type="button"
      onClick={() => router.push("/daftar")}
      className="flex w-full items-center justify-center gap-2 rounded-2xl bg-brand px-5 py-3.5 text-sm font-bold text-white shadow-brand transition hover:bg-brand-600 active:translate-y-px"
    >
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M12 2l1.6 4.8L18.5 8l-4.9 1.2L12 14l-1.6-4.8L5.5 8l4.9-1.2L12 2Zm7 10l.9 2.6L22.5 16l-2.6.9L19 19l-.9-2.1L15.5 16l2.6-1.4L19 12Z" />
      </svg>
      Daftar dengan Email
    </button>
  );
}
