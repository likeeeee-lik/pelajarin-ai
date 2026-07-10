import { apiFetch } from "./http";

export interface Profile {
  id: string;
  nama: string;
  email: string;
  emailVerified: boolean;
  plan: "free" | "pro" | "institusi";
}

export interface UserStats {
  materials: number;
  flashcards: number;
  quizzes: number;
  predictions: number;
  subjects: number;
  files: number;
}

export interface MaterialSummary {
  id: string;
  judul: string;
  tipe: string;
  createdAt: string;
  subject: { id: string; nama: string } | null;
  _count: { chapters: number };
}

// TODO(shared): pindahkan tipe ini ke packages/shared agar web & mobile sama persis.
export const meApi = { get: () => apiFetch<Profile>("/me") };
export const statsApi = { get: () => apiFetch<UserStats>("/stats") };
export const materialsApi = { list: () => apiFetch<MaterialSummary[]>("/materials") };
