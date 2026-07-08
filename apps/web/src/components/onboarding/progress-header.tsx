"use client";

/** Header onboarding: bar 5-segmen (per fase) + "n/total" + label fase. */
export function ProgressHeader({
  segments,
  current,
  total,
  phaseLabel,
}: {
  segments: number[]; // 5 nilai 0..1
  current: number;
  total: number;
  phaseLabel: string;
}) {
  return (
    <div className="mx-auto w-full max-w-2xl px-4 pt-6">
      <div className="flex gap-2">
        {segments.map((frac, i) => (
          <div key={i} className="h-1.5 flex-1 overflow-hidden rounded-full bg-ink-500/60">
            <div
              className="h-full rounded-full bg-brand transition-[width] duration-300"
              style={{ width: `${Math.round(frac * 100)}%` }}
            />
          </div>
        ))}
      </div>
      <div className="mt-2 flex items-center justify-between text-sm">
        <span className="text-muted">
          {current}/{total}
        </span>
        <span className="font-semibold text-brand">{phaseLabel}</span>
      </div>
    </div>
  );
}
