import { apiFetch } from "./http";
import type {
  Chapter,
  CreateMaterialInput,
  Material,
  MaterialSummary,
  Subject,
} from "./types";

/** Kumpulan fungsi API per-resource (dipakai lewat React Query di komponen). */

export const subjectsApi = {
  list: () => apiFetch<Subject[]>("/subjects"),
  create: (nama: string) => apiFetch<Subject>("/subjects", { method: "POST", body: JSON.stringify({ nama }) }),
  remove: (id: string) => apiFetch<{ ok: true }>(`/subjects/${id}`, { method: "DELETE" }),
};

export const materialsApi = {
  list: () => apiFetch<MaterialSummary[]>("/materials"),
  get: (id: string) => apiFetch<Material>(`/materials/${id}`),
  create: (input: CreateMaterialInput) =>
    apiFetch<Material>("/materials", { method: "POST", body: JSON.stringify(input) }),
  remove: (id: string) => apiFetch<{ ok: true }>(`/materials/${id}`, { method: "DELETE" }),
};

export const chaptersApi = {
  add: (materialId: string, judul: string) =>
    apiFetch<Chapter>("/chapters", { method: "POST", body: JSON.stringify({ materialId, judul }) }),
  generate: (id: string) => apiFetch<Chapter>(`/chapters/${id}/generate`, { method: "POST" }),
  update: (id: string, kontenMd: string) =>
    apiFetch<Chapter>(`/chapters/${id}`, { method: "PATCH", body: JSON.stringify({ kontenMd }) }),
  remove: (id: string) => apiFetch<{ ok: true }>(`/chapters/${id}`, { method: "DELETE" }),
};
