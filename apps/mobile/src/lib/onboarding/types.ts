import type { Ionicons } from "@expo/vector-icons";

/**
 * Definisi pertanyaan onboarding untuk mobile.
 *
 * TODO(shared): ini SALINAN dari apps/web/src/lib/onboarding/*. Web memakai
 * ikon Lucide (komponen React DOM) sehingga tak bisa dipakai langsung di RN.
 * Satukan ke packages/shared dengan ikon berupa string, lalu tiap platform
 * memetakannya sendiri. Sampai itu dilakukan, PERUBAHAN PERTANYAAN HARUS
 * DILAKUKAN DI KEDUA TEMPAT.
 */

export type IkonNama = React.ComponentProps<typeof Ionicons>["name"];

export type PhaseId = "identitas" | "kognitif" | "psikologis" | "preferensi" | "hook";

export interface Phase {
  id: PhaseId;
  label: string;
  title: string;
  subtitle: string;
  color: string;
}

export interface SelectOption {
  value: string;
  label: string;
  sublabel?: string;
  icon?: IkonNama;
}

interface Base {
  id: string;
  phase: PhaseId;
  title: string;
  subtitle?: string;
  icon: IkonNama;
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
      valueLabel: (v: number) => { text: string; emoji?: string };
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
