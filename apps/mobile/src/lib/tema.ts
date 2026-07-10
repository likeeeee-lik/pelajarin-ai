/** Warna merek, disamakan dengan web (Tailwind ink + brand orange). */
export const tema = {
  bg: "#0B1120",
  card: "#111827",
  card2: "#1E293B",
  border: "#1F2937",
  teks: "#F8FAFC",
  muted: "#94A3B8",
  brand: "#F97316",
  brandGelap: "#EA580C",
  hijau: "#22C55E",
  kuning: "#EAB308",
  ungu: "#A855F7",
  biru: "#38BDF8",
  merah: "#F43F5E",
} as const;

/** Warna aksen per fitur (dipakai kartu statistik & ikon). */
export const aksen = {
  brand: { fg: tema.brand, bg: "rgba(249,115,22,0.15)" },
  hijau: { fg: "#34D399", bg: "rgba(16,185,129,0.15)" },
  kuning: { fg: "#FACC15", bg: "rgba(234,179,8,0.15)" },
  ungu: { fg: "#C084FC", bg: "rgba(168,85,247,0.15)" },
  biru: { fg: "#38BDF8", bg: "rgba(56,189,248,0.15)" },
  merah: { fg: "#FB7185", bg: "rgba(244,63,94,0.15)" },
} as const;
