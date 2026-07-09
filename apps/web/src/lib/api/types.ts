export type MaterialType = "file" | "youtube" | "audio" | "video" | "note";
export type ChapterStatus = "pending" | "ready";

export interface Subject {
  id: string;
  nama: string;
  warna?: string | null;
  createdAt: string;
  _count?: { materials: number };
}

export interface Chapter {
  id: string;
  materialId: string;
  urutan: number;
  judul: string;
  status: ChapterStatus;
  kontenMd: string | null;
  isPro: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface MaterialSummary {
  id: string;
  judul: string;
  tipe: MaterialType;
  status: string;
  sourceUrl: string | null;
  subjectId: string | null;
  subject: { id: string; nama: string } | null;
  createdAt: string;
  _count: { chapters: number };
}

export interface Material {
  id: string;
  judul: string;
  tipe: MaterialType;
  status: string;
  sourceUrl: string | null;
  rawText: string | null;
  subjectId: string | null;
  subject: { id: string; nama: string } | null;
  modeBelajar: string;
  gayaPenulisan: string;
  bahasa: string;
  sharePublic: boolean;
  shareSlug: string | null;
  createdAt: string;
  updatedAt: string;
  chapters: Chapter[];
}

export interface CreateMaterialInput {
  judul: string;
  tipe: MaterialType;
  subjectId?: string;
  sourceUrl?: string;
  rawText?: string;
  modeBelajar?: string;
  gayaPenulisan?: string;
  bahasa?: string;
}
