import { apiFetch } from "./http";
import type {
  Chapter,
  ChatMessage,
  ChatSession,
  CreateMaterialInput,
  Flashcard,
  Material,
  MaterialSummary,
  MindMap,
  Quiz,
  QuizType,
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
  upload: (form: FormData) => apiFetch<Material>("/materials/upload", { method: "POST", body: form }),
  fileUrl: (materialId: string, fileId: string) =>
    apiFetch<{ url: string | null; name: string; mime: string }>(`/materials/${materialId}/files/${fileId}/url`),
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

export const mindmapApi = {
  get: (materialId: string) => apiFetch<MindMap | null>(`/materials/${materialId}/mindmap`),
  generate: (materialId: string) =>
    apiFetch<MindMap>(`/materials/${materialId}/mindmap/generate`, { method: "POST" }),
};

export const flashcardsApi = {
  list: (materialId: string) => apiFetch<Flashcard[]>(`/materials/${materialId}/flashcards`),
  generate: (materialId: string, input: { count: number; chapterIds?: string[] }) =>
    apiFetch<Flashcard[]>(`/materials/${materialId}/flashcards/generate`, {
      method: "POST",
      body: JSON.stringify(input),
    }),
};

export const quizzesApi = {
  list: (materialId: string) => apiFetch<Quiz[]>(`/materials/${materialId}/quizzes`),
  generate: (materialId: string, input: { count: number; types: QuizType[]; chapterIds?: string[] }) =>
    apiFetch<Quiz>(`/materials/${materialId}/quizzes/generate`, {
      method: "POST",
      body: JSON.stringify(input),
    }),
  get: (quizId: string) => apiFetch<Quiz>(`/quizzes/${quizId}`),
};

export const chatApi = {
  listSessions: (materialId: string) => apiFetch<ChatSession[]>(`/materials/${materialId}/chat/sessions`),
  createSession: (materialId: string) =>
    apiFetch<ChatSession>(`/materials/${materialId}/chat/sessions`, { method: "POST" }),
  getMessages: (sessionId: string) => apiFetch<ChatMessage[]>(`/chat/sessions/${sessionId}/messages`),
  sendMessage: (sessionId: string, input: { question: string; chapterIds?: string[] }) =>
    apiFetch<{ user: ChatMessage; assistant: ChatMessage }>(`/chat/sessions/${sessionId}/messages`, {
      method: "POST",
      body: JSON.stringify(input),
    }),
};
