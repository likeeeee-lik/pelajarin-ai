import { Mic, PenLine, Upload, Video, Youtube, type LucideIcon } from "lucide-react";

export interface Source {
  id: string;
  label: string;
  desc: string;
  icon: LucideIcon;
  /** kelas warna ikon (text + bg). */
  color: string;
}

export const SOURCES: Source[] = [
  { id: "file", label: "Unggah File", desc: "PDF, DOCX, PPT", icon: Upload, color: "text-sky-400 bg-sky-400/15" },
  { id: "youtube", label: "YouTube", desc: "Link Video", icon: Youtube, color: "text-red-400 bg-red-400/15" },
  { id: "audio", label: "Audio", desc: "MP3, WAV", icon: Mic, color: "text-emerald-400 bg-emerald-400/15" },
  { id: "video", label: "Video", desc: "MP4, MOV", icon: Video, color: "text-purple-400 bg-purple-400/15" },
  { id: "note", label: "Tulis Catatan", desc: "Mulai dari nol", icon: PenLine, color: "text-amber-400 bg-amber-400/15" },
];
