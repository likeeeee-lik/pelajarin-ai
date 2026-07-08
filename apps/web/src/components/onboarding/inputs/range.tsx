"use client";

/** Slider horizontal bergaya brand (track oranye + thumb bulat). */
export function Range({
  min,
  max,
  step,
  value,
  onChange,
  className = "",
}: {
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (v: number) => void;
  className?: string;
}) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className={`range-brand w-full ${className}`}
      style={{ "--pct": `${pct}%` } as React.CSSProperties}
    />
  );
}
