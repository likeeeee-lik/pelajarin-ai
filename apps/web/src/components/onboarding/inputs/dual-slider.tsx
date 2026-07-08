"use client";

import { Range } from "./range";

interface Side {
  key: string;
  label: string;
  min: number;
  max: number;
  step: number;
}

export function DualSlider({
  left,
  right,
  values,
  onChange,
}: {
  left: Side;
  right: Side;
  values: Record<string, number>;
  onChange: (key: string, v: number) => void;
}) {
  const sides: [Side, string][] = [
    [left, "text-white"],
    [right, "text-brand"],
  ];
  return (
    <div className="grid gap-8 sm:grid-cols-2">
      {sides.map(([side, valueColor]) => (
        <div key={side.key} className="flex flex-col gap-3">
          <div className="flex items-baseline justify-between">
            <span className="text-sm text-muted">{side.label}</span>
            <span className={`text-2xl font-extrabold ${valueColor}`}>
              {(values[side.key] ?? 0).toFixed(1)}
            </span>
          </div>
          <Range
            min={side.min}
            max={side.max}
            step={side.step}
            value={values[side.key] ?? 0}
            onChange={(v) => onChange(side.key, v)}
          />
        </div>
      ))}
    </div>
  );
}
