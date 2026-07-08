"use client";

import { RADAR_AXES, type RadarScores } from "@/lib/onboarding/scoring";

/** Radar/spider chart 8 sumbu profil kognitif. */
export function RadarChart({
  scores,
  size = 300,
  progress = 1,
}: {
  scores: RadarScores;
  size?: number;
  /** 0..1 — porsi polygon yang ditampilkan (untuk animasi "membangun"). */
  progress?: number;
}) {
  const cx = size / 2;
  const cy = size / 2;
  const R = size / 2 - 42;
  const n = RADAR_AXES.length;

  const angle = (i: number) => (Math.PI * 2 * i) / n - Math.PI / 2;
  const point = (i: number, r: number) => ({
    x: cx + Math.cos(angle(i)) * r,
    y: cy + Math.sin(angle(i)) * r,
  });

  const rings = [0.25, 0.5, 0.75, 1];
  const shown = Math.max(0, Math.min(n, Math.round(progress * n)));

  const polygon = RADAR_AXES.slice(0, shown)
    .map((ax, i) => {
      const p = point(i, (scores[ax.key] / 100) * R);
      return `${p.x},${p.y}`;
    })
    .join(" ");

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {/* cincin grid */}
      {rings.map((ring) => (
        <polygon
          key={ring}
          points={RADAR_AXES.map((_, i) => {
            const p = point(i, R * ring);
            return `${p.x},${p.y}`;
          }).join(" ")}
          fill="none"
          stroke="#232B3D"
          strokeWidth={1}
        />
      ))}
      {/* jari-jari + label */}
      {RADAR_AXES.map((ax, i) => {
        const edge = point(i, R);
        const label = point(i, R + 22);
        return (
          <g key={ax.key}>
            <line x1={cx} y1={cy} x2={edge.x} y2={edge.y} stroke="#232B3D" strokeWidth={1} />
            <text
              x={label.x}
              y={label.y}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="11"
              fill="#9AA3B2"
            >
              {ax.label}
            </text>
          </g>
        );
      })}
      {/* polygon skor */}
      {shown >= 2 ? (
        <polygon points={polygon} fill="rgba(249,115,22,0.25)" stroke="#F97316" strokeWidth={2} />
      ) : null}
      {RADAR_AXES.slice(0, shown).map((ax, i) => {
        const p = point(i, (scores[ax.key] / 100) * R);
        return <circle key={ax.key} cx={p.x} cy={p.y} r={4} fill="#F97316" stroke="#0B0F1A" strokeWidth={1.5} />;
      })}
    </svg>
  );
}
