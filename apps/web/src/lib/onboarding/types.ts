import type { LucideIcon } from "lucide-react";

export type PhaseId = "identitas" | "kognitif" | "psikologis" | "preferensi" | "hook";

export interface Phase {
  id: PhaseId;
  /** Label di kanan header (mis "Identitas"). */
  label: string;
  /** Judul layar transisi (mis "Pemetaan Kognitif"). */
  title: string;
  subtitle: string;
  /** Warna aksen fase (untuk transisi). */
  color: string;
}

export interface SelectOption {
  value: string;
  label: string;
  sublabel?: string;
  icon?: LucideIcon;
}

interface Base {
  id: string;
  phase: PhaseId;
  title: string;
  subtitle?: string;
  icon: LucideIcon;
  /** Jika false, pertanyaan dilewati berdasar jawaban sebelumnya. */
  includeIf?: (answers: Answers) => boolean;
}

export type Question =
  | (Base & { kind: "single"; options: SelectOption[] })
  | (Base & {
      kind: "scale";
      min: number;
      max: number;
      step: number;
      default: number;
      valueLabel: (v: number) => { text: string; emoji?: string; color?: string };
    })
  | (Base & {
      kind: "dual";
      left: { key: string; label: string; min: number; max: number; step: number; default: number };
      right: { key: string; label: string; min: number; max: number; step: number; default: number };
    })
  | (Base & {
      kind: "semantic";
      leftLabel: string;
      rightLabel: string;
      default: number; // 0..100
      centerLabel: (v: number) => string;
    })
  | (Base & {
      kind: "capsule";
      default: number; // 0..100
      valueLabel: (v: number) => { text: string; emoji: string; color: string };
    })
  | (Base & { kind: "curve"; hours: number[]; default: number });

export type AnswerValue = string | number | number[] | Record<string, number>;
export type Answers = Record<string, AnswerValue>;
