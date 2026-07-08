"use client";

import { Range } from "./range";

export function SemanticSlider({
  leftLabel,
  rightLabel,
  value,
  onChange,
  centerLabel,
}: {
  leftLabel: string;
  rightLabel: string;
  value: number;
  onChange: (v: number) => void;
  centerLabel: (v: number) => string;
}) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-start justify-between gap-4">
        <span className={`max-w-[45%] font-semibold ${value < 45 ? "text-white" : "text-muted"}`}>
          {leftLabel}
        </span>
        <span className={`max-w-[45%] text-right font-semibold ${value > 55 ? "text-white" : "text-muted"}`}>
          {rightLabel}
        </span>
      </div>
      <Range min={0} max={100} step={1} value={value} onChange={onChange} />
      <div className="flex justify-center">
        <span className="rounded-full border border-ink-500 bg-ink-700/60 px-4 py-1.5 text-sm text-muted">
          {centerLabel(value)}
        </span>
      </div>
    </div>
  );
}
