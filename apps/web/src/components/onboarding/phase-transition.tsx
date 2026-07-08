"use client";

import { HelpCircle, Network, Plus, Star, UserRound, type LucideIcon } from "lucide-react";
import type { Phase } from "@/lib/onboarding/types";

const PHASE_ICON: Record<string, LucideIcon> = {
  identitas: UserRound,
  kognitif: Network,
  psikologis: HelpCircle,
  preferensi: Plus,
  hook: Star,
};

/** Layar transisi antar fase (FASE n DARI 5). Presentasional. */
export function PhaseTransition({ phase, index }: { phase: Phase; index: number }) {
  const Icon = PHASE_ICON[phase.id] ?? Star;
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <span
        className="mb-6 grid h-16 w-16 place-items-center rounded-2xl border"
        style={{ borderColor: phase.color, color: phase.color }}
      >
        <Icon className="h-7 w-7" />
      </span>
      <div className="mb-4 flex gap-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <span
            key={i}
            className="h-1.5 w-8 rounded-full"
            style={{ backgroundColor: i <= index ? phase.color : "#232B3D" }}
          />
        ))}
      </div>
      <p className="text-xs font-semibold tracking-[0.25em] text-muted">
        FASE {index + 1} DARI 5
      </p>
      <h2 className="mt-2 text-4xl font-extrabold" style={{ color: phase.color }}>
        {phase.title}
      </h2>
      <p className="mt-2 text-muted">{phase.subtitle}</p>
    </div>
  );
}
