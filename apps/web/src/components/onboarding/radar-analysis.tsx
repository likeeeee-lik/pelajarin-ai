"use client";

import { useEffect, useState } from "react";
import { RadarChart } from "./radar-chart";
import type { RadarScores } from "@/lib/onboarding/scoring";

const STEPS = [
  "Mengukur level ambisi...",
  "Memetakan sumber motivasi...",
  "Menganalisis pola fokus...",
  "Menyesuaikan gaya bantuan...",
];

/** Layar loading analisis: radar membangun + status berganti, lalu onDone. */
export function RadarAnalysis({
  scores,
  onDone,
}: {
  scores: RadarScores;
  onDone: () => void;
}) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const start = performance.now();
    const DURATION = 3000;
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / DURATION);
      setProgress(p);
      if (p < 1) raf = requestAnimationFrame(tick);
      else setTimeout(onDone, 500);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [onDone]);

  const step = STEPS[Math.min(STEPS.length - 1, Math.floor(progress * STEPS.length))];

  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center gap-8 px-4 text-center">
      <h1 className="text-3xl font-extrabold">Menganalisis profil kognitifmu...</h1>
      <RadarChart scores={scores} size={320} progress={progress} />
      <div className="w-full max-w-md">
        <p className="mb-3 text-muted">{step}</p>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-ink-500/60">
          <div
            className="h-full rounded-full bg-brand"
            style={{ width: `${Math.round(progress * 100)}%` }}
          />
        </div>
      </div>
    </div>
  );
}
