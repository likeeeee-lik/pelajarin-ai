"use client";

import { useSyncExternalStore } from "react";

/**
 * Store client sederhana berbasis localStorage supaya fitur dashboard
 * benar-benar berfungsi & bertahan saat refresh, TANPA backend.
 * TODO(API): ganti sumber data ini dengan pemanggilan API (subjects, materials,
 * predictions, profile) begitu Logto+DB aktif.
 */

export type MaterialType = "file" | "youtube" | "audio" | "video" | "note";

export interface Subject {
  id: string;
  nama: string;
  createdAt: number;
}

export interface Material {
  id: string;
  judul: string;
  tipe: MaterialType;
  subjectId?: string;
  konten?: string; // untuk "Tulis Catatan"
  sourceUrl?: string; // untuk YouTube
  fileName?: string; // untuk file/audio/video
  status: "ready" | "processing";
  createdAt: number;
}

export interface PredictionItem {
  id: string;
  judul: string;
  mapel: string;
  tipe: "uts" | "uas" | "kuis" | "latihan";
  fileCount: number;
  createdAt: number;
}

export interface ProfileSettings {
  nama: string;
  bahasaTampilan: string;
  bahasaGenerasi: string;
}

interface Store<T> {
  read(): T;
  write(v: T): void;
  subscribe(l: () => void): () => void;
  server(): T;
}

function createStore<T>(key: string, initial: T): Store<T> {
  let cache: T = initial;
  let hydrated = false;
  const listeners = new Set<() => void>();

  return {
    read() {
      if (!hydrated && typeof window !== "undefined") {
        try {
          const raw = localStorage.getItem(key);
          if (raw) cache = JSON.parse(raw) as T;
        } catch {
          /* abaikan */
        }
        hydrated = true;
      }
      return cache;
    },
    write(v: T) {
      cache = v;
      hydrated = true;
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem(key, JSON.stringify(v));
        } catch {
          /* abaikan */
        }
      }
      listeners.forEach((l) => l());
    },
    subscribe(l) {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    server() {
      return initial;
    },
  };
}

const subjectsStore = createStore<Subject[]>("pelajarin.subjects", []);
const materialsStore = createStore<Material[]>("pelajarin.materials", []);
const predictionsStore = createStore<PredictionItem[]>("pelajarin.predictions", []);
const profileStore = createStore<ProfileSettings>("pelajarin.profile", {
  nama: "Likae",
  bahasaTampilan: "id",
  bahasaGenerasi: "id",
});

function useStore<T>(store: Store<T>): T {
  return useSyncExternalStore(store.subscribe, store.read, store.server);
}

let counter = 0;
const uid = () => `${Date.now().toString(36)}${(counter++).toString(36)}`;

// ── Subjects ────────────────────────────────────────────────
export const useSubjects = () => useStore(subjectsStore);
export function addSubject(nama: string) {
  subjectsStore.write([...subjectsStore.read(), { id: uid(), nama, createdAt: Date.now() }]);
}
export function removeSubject(id: string) {
  subjectsStore.write(subjectsStore.read().filter((s) => s.id !== id));
}

// ── Materials ───────────────────────────────────────────────
export const useMaterials = () => useStore(materialsStore);
export function addMaterial(input: Omit<Material, "id" | "createdAt">) {
  materialsStore.write([{ ...input, id: uid(), createdAt: Date.now() }, ...materialsStore.read()]);
}
export function removeMaterial(id: string) {
  materialsStore.write(materialsStore.read().filter((m) => m.id !== id));
}

// ── Predictions ─────────────────────────────────────────────
export const usePredictions = () => useStore(predictionsStore);
export function addPrediction(input: Omit<PredictionItem, "id" | "createdAt">) {
  predictionsStore.write([{ ...input, id: uid(), createdAt: Date.now() }, ...predictionsStore.read()]);
}

// ── Profile ─────────────────────────────────────────────────
export const useProfileSettings = () => useStore(profileStore);
export function saveProfile(v: ProfileSettings) {
  profileStore.write(v);
}
