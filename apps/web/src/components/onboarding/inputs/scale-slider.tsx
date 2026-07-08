"use client";

import { Range } from "./range";

export function ScaleSlider({
  min,
  max,
  step,
  value,
  onChange,
  valueLabel,
}: {
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (v: number) => void;
  valueLabel: (v: number) => { text: string; emoji?: string; color?: string };
}) {
  const label = valueLabel(value);
  return (
    <div className="flex flex-col items-center gap-6">
      <div
        className="text-6xl font-extrabold"
        style={{ color: label.color ?? "#FBBF24" }}
      >
        {value}
      </div>
      <div className="flex items-center gap-2 text-lg text-muted">
        {label.emoji ? <span>{label.emoji}</span> : null}
        <span>{label.text}</span>
      </div>
      <Range min={min} max={max} step={step} value={value} onChange={onChange} />
    </div>
  );
}
