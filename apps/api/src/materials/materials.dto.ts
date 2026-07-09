export interface CreateMaterialDto {
  judul: string;
  tipe: "file" | "youtube" | "audio" | "video" | "note";
  subjectId?: string;
  sourceUrl?: string;
  rawText?: string;
  modeBelajar?: string; // kilat | standar | lengkap
  gayaPenulisan?: string; // formal | santai | kreatif | akademis
  bahasa?: string; // id | en | ar | zh
}
