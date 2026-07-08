"use client";

import { Range } from "./range";

export function CapsuleSlider({
  value,
  onChange,
  valueLabel,
}: {
  value: number;
  onChange: (v: number) => void;
  valueLabel: (v: number) => { text: string; emoji: string; color: string };
}) {
  const label = valueLabel(value);
  return (
    <div className="flex flex-col items-center gap-6">
      <div className="text-4xl">{label.emoji}</div>

      {/* Kapsul vertikal terisi dari bawah sesuai nilai */}
      <div className="relative h-64 w-24 overflow-hidden rounded-full border border-ink-500 bg-ink-700/50">
        <div
          className="absolute inset-x-0 bottom-0 transition-[height] duration-200"
          style={{ height: `${value}%`, backgroundColor: label.color }}
        />
        <div className="absolute inset-0 grid place-items-center">
          <span className="text-3xl font-extrabold text-white drop-shadow">{value}</span>
        </div>
      </div>

      <span className="text-lg font-bold" style={{ color: label.color }}>
        {label.text}
      </span>

      <Range min={0} max={100} step={1} value={value} onChange={onChange} />
    </div>
  );
}
