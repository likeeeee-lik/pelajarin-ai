"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronUp, Pause, Play, RotateCcw, Target } from "lucide-react";

const DEFAULT = 25 * 60;

/** Timer Pomodoro "Fokus" di sub-sidebar workspace. */
export function FocusTimer() {
  const [seconds, setSeconds] = useState(DEFAULT);
  const [running, setRunning] = useState(false);
  const [open, setOpen] = useState(false);
  const ref = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (running) {
      ref.current = setInterval(() => setSeconds((s) => (s <= 1 ? 0 : s - 1)), 1000);
      return () => { if (ref.current) clearInterval(ref.current); };
    }
  }, [running]);

  useEffect(() => {
    if (seconds === 0) setRunning(false);
  }, [seconds]);

  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");

  return (
    <div className="rounded-2xl border border-ink-500/60 bg-ink-700/40 p-3">
      <button type="button" onClick={() => setOpen((o) => !o)} className="flex w-full items-center gap-3">
        <span className="grid h-9 w-9 place-items-center rounded-xl bg-ink-600 text-brand">
          <Target className="h-4 w-4" />
        </span>
        <span className="flex-1 text-left">
          <span className="block text-xs text-muted">Fokus</span>
          <span className="block font-bold">{mm}:{ss}</span>
        </span>
        <ChevronUp className={`h-4 w-4 text-muted transition ${open ? "" : "rotate-180"}`} />
      </button>

      {open ? (
        <div className="mt-3 flex flex-col items-center gap-3">
          <span className="text-4xl font-extrabold tabular-nums">{mm}:{ss}</span>
          <div className="flex items-center gap-3">
            <button type="button" onClick={() => { setSeconds(DEFAULT); setRunning(false); }} aria-label="Reset" className="grid h-9 w-9 place-items-center rounded-full border border-ink-500 text-muted hover:text-white">
              <RotateCcw className="h-4 w-4" />
            </button>
            <button type="button" onClick={() => setRunning((r) => !r)} aria-label={running ? "Pause" : "Play"} className="grid h-11 w-11 place-items-center rounded-full bg-brand text-white shadow-brand">
              {running ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
            </button>
            <span className="w-9" />
          </div>
        </div>
      ) : null}
    </div>
  );
}
