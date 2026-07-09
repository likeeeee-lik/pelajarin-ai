import { Bot, Folder, HelpCircle, Layers, NotebookText, Waypoints, type LucideIcon } from "lucide-react";

export type WorkspaceTab = "catatan" | "mindmap" | "flashcards" | "kuis" | "dokumen" | "chat";

export const WORKSPACE_TABS: { id: WorkspaceTab; label: string; icon: LucideIcon }[] = [
  { id: "catatan", label: "Catatan", icon: NotebookText },
  { id: "mindmap", label: "Mind Map", icon: Waypoints },
  { id: "flashcards", label: "Flashcards", icon: Layers },
  { id: "kuis", label: "Kuis", icon: HelpCircle },
  { id: "dokumen", label: "Dokumen", icon: Folder },
  { id: "chat", label: "Chat", icon: Bot },
];
