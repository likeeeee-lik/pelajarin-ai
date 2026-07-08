"use client";

import { useEffect, useRef, useState } from "react";

const PAD = { left: 34, right: 12, top: 14, bottom: 26 };

/** Kurva energi harian: geser tiap titik naik/turun (0-100). */
export function GoldenHours({
  hours,
  values,
  onChange,
}: {
  hours: number[];
  values: number[];
  onChange: (values: number[]) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<number | null>(null);
  const [box, setBox] = useState({ w: 340, h: 240 });

  useEffect(() => {
    const measure = () => {
      const el = ref.current;
      if (el) setBox({ w: el.clientWidth, h: el.clientHeight });
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const n = hours.length;
  const chartW = box.w - PAD.left - PAD.right;
  const chartH = box.h - PAD.top - PAD.bottom;
  const xFor = (i: number) => PAD.left + (n <= 1 ? 0 : (i * chartW) / (n - 1));
  const yFor = (v: number) => PAD.top + (1 - v / 100) * chartH;

  function updateFromPointer(clientX: number, clientY: number, forceIdx?: number) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const cw = rect.width - PAD.left - PAD.right;
    const ch = rect.height - PAD.top - PAD.bottom;
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    const idx =
      forceIdx ?? Math.max(0, Math.min(n - 1, Math.round(((x - PAD.left) / cw) * (n - 1))));
    const v = Math.max(0, Math.min(100, Math.round((1 - (y - PAD.top) / ch) * 100)));
    const next = values.slice();
    next[idx] = v;
    onChange(next);
    return idx;
  }

  const linePoints = values.map((v, i) => `${xFor(i)},${yFor(v)}`).join(" ");
  const areaPoints = `${PAD.left},${PAD.top + chartH} ${linePoints} ${PAD.left + chartW},${PAD.top + chartH}`;

  return (
    <div
      ref={ref}
      className="relative h-60 w-full touch-none select-none"
      onPointerDown={(e) => {
        (e.target as Element).setPointerCapture?.(e.pointerId);
        const idx = updateFromPointer(e.clientX, e.clientY);
        if (idx != null) setActive(idx);
      }}
      onPointerMove={(e) => {
        if (active == null) return;
        updateFromPointer(e.clientX, e.clientY, active);
      }}
      onPointerUp={() => setActive(null)}
      onPointerLeave={() => setActive(null)}
    >
      <svg className="h-full w-full" viewBox={`0 0 ${box.w} ${box.h}`} preserveAspectRatio="none">
        {[0, 25, 50, 75, 100].map((g) => (
          <g key={g}>
            <line x1={PAD.left} x2={PAD.left + chartW} y1={yFor(g)} y2={yFor(g)} stroke="#232B3D" strokeWidth={1} />
            <text x={PAD.left - 8} y={yFor(g) + 4} textAnchor="end" fontSize="10" fill="#9AA3B2">
              {g}
            </text>
          </g>
        ))}
        <polygon points={areaPoints} fill="rgba(249,115,22,0.15)" />
        <polyline points={linePoints} fill="none" stroke="#F97316" strokeWidth={3} strokeLinejoin="round" />
        {values.map((v, i) => (
          <circle key={i} cx={xFor(i)} cy={yFor(v)} r={active === i ? 8 : 6} fill="#0B0F1A" stroke="#F97316" strokeWidth={3} />
        ))}
        {hours.map((h, i) =>
          i % 2 === 0 ? (
            <text key={h} x={xFor(i)} y={box.h - 8} textAnchor="middle" fontSize="10" fill="#9AA3B2">
              {h === 24 ? "0:00" : `${h}:00`}
            </text>
          ) : null,
        )}
      </svg>
    </div>
  );
}
