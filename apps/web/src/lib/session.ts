"use client";

import { useSyncExternalStore } from "react";

/**
 * Penanda sesi login sisi-klien (mode stub, sebelum Logto aktif).
 * Diset saat masuk area dashboard (AppShell), dihapus saat "Keluar".
 * Dipakai navbar landing untuk menampilkan profil vs tombol "Masuk".
 * TODO(logto): ganti dengan status sesi Logto asli.
 */

const KEY = "pelajarin.session";
const listeners = new Set<() => void>();
let hydrated = false;
let cache = false;

function read(): boolean {
  if (!hydrated && typeof window !== "undefined") {
    try {
      cache = localStorage.getItem(KEY) === "1";
    } catch {
      /* abaikan */
    }
    hydrated = true;
  }
  return cache;
}

function write(v: boolean) {
  cache = v;
  hydrated = true;
  if (typeof window !== "undefined") {
    try {
      if (v) localStorage.setItem(KEY, "1");
      else localStorage.removeItem(KEY);
    } catch {
      /* abaikan */
    }
  }
  listeners.forEach((l) => l());
}

export function markSignedIn() {
  if (!read()) write(true);
}

export function clearSession() {
  write(false);
}

export function useSignedIn(): boolean {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    read,
    () => false,
  );
}
