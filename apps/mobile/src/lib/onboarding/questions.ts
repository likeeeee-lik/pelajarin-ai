import type { Answers, Phase, Question } from "./types";

// TODO(shared): salinan dari apps/web/src/lib/onboarding/questions.ts.
// Ubah di KEDUA tempat sampai disatukan ke packages/shared.

export const PHASES: Phase[] = [
  { id: "identitas", label: "Identitas", title: "Identitas", subtitle: "Kenalan dulu", color: "#F97316" },
  { id: "kognitif", label: "Kognitif", title: "Pemetaan Kognitif", subtitle: "Cara otakmu bekerja", color: "#38BDF8" },
  { id: "psikologis", label: "Psikologis", title: "Audit Psikologis", subtitle: "Mindset & mental kamu", color: "#C084FC" },
  { id: "preferensi", label: "Preferensi", title: "Preferensi AI", subtitle: "Sesuaikan AI-mu", color: "#34D399" },
  { id: "hook", label: "Hook", title: "The Hook", subtitle: "Satu pertanyaan terakhir", color: "#FBBF24" },
];

const semanticCenter = (v: number, left: string, right: string) =>
  v < 40 ? left : v > 60 ? right : "Seimbang";

export const QUESTIONS: Question[] = [
  // ── Fase 1: Identitas ────────────────────────────────
  {
    id: "jenjang",
    phase: "identitas",
    kind: "single",
    icon: "person-outline",
    title: "Siapa yang sedang kita bantu hari ini?",
    subtitle: "Pilih profil yang paling sesuai.",
    options: [
      { value: "smp", label: "SMP", icon: "business-outline" },
      { value: "sma_smk", label: "SMA/SMK", icon: "business-outline" },
      { value: "mahasiswa_s1", label: "Mahasiswa S1", icon: "school-outline" },
      { value: "pascasarjana", label: "Pascasarjana", icon: "book-outline" },
      { value: "profesional", label: "Profesional", icon: "briefcase-outline" },
    ],
  },
  {
    id: "target_6bulan",
    phase: "identitas",
    kind: "single",
    icon: "flag-outline",
    title: "Apa target utamamu dalam 6 bulan ke depan?",
    subtitle: "Fokuskan arah belajar dulu.",
    options: [
      { value: "lulus_ujian", label: "Lulus Ujian / SNBT", icon: "checkmark-circle-outline" },
      { value: "ipk_cumlaude", label: "Kejar IPK Cumlaude", icon: "trophy-outline" },
      { value: "skripsi", label: "Berjuang Lulus Skripsi/TA", icon: "bookmark-outline" },
      { value: "upskilling", label: "Upskilling / Belajar Hal Baru", icon: "flame-outline" },
    ],
  },
  {
    id: "ambisi",
    phase: "identitas",
    kind: "scale",
    icon: "trending-up-outline",
    title: "Seberapa ambisius kamu?",
    subtitle: "1 = santai aja, 10 = harus jadi yang terbaik.",
    min: 1,
    max: 10,
    step: 1,
    default: 5,
    valueLabel: (v) => ({
      emoji: "💪",
      text: v <= 3 ? "Santai aja" : v <= 6 ? "Cukup serius" : v <= 8 ? "Serius" : "Harus jadi terbaik",
    }),
  },
  {
    id: "ipk",
    phase: "identitas",
    kind: "dual",
    icon: "school-outline",
    title: "Nilai rata-rata/IPK saat ini vs target?",
    subtitle: "Geser slider untuk menyesuaikan.",
    includeIf: (a: Answers) => a.jenjang === "mahasiswa_s1" || a.jenjang === "pascasarjana",
    left: { key: "ipk_saat_ini", label: "IPK Saat Ini", min: 0, max: 4, step: 0.1, default: 3.0 },
    right: { key: "ipk_target", label: "Target IPK", min: 0, max: 4, step: 0.1, default: 3.5 },
  },

  // ── Fase 2: Pemetaan Kognitif ────────────────────────
  {
    id: "golden_hours",
    phase: "kognitif",
    kind: "curve",
    icon: "sunny-outline",
    title: "Golden Hours — kapan energi kamu paling tinggi?",
    subtitle: "Atur ritme energi di sepanjang hari.",
    hours: [6, 12, 18, 22],
    default: 50,
  },
  {
    id: "cara_paham",
    phase: "kognitif",
    kind: "single",
    icon: "book-outline",
    title: "Cara tercepat kamu paham materi yang rumit?",
    options: [
      { value: "visual", label: "Visual & Diagram", icon: "eye-outline" },
      { value: "audio", label: "Mendengarkan", icon: "headset-outline" },
      { value: "baca", label: "Membaca", icon: "reader-outline" },
      { value: "latihan", label: "Latihan Soal", icon: "barbell-outline" },
    ],
  },
  {
    id: "gaya_belajar",
    phase: "kognitif",
    kind: "semantic",
    icon: "swap-horizontal-outline",
    title: "Posisi gaya belajar kamu",
    subtitle: "Di antara dua kutub ini, kamu condong ke mana?",
    leftLabel: "Teori dulu baru praktek",
    rightLabel: "Langsung praktek",
    default: 50,
    centerLabel: (v) => semanticCenter(v, "Teori dulu baru praktek", "Langsung praktek"),
  },
  {
    id: "kelemahan_memori",
    phase: "kognitif",
    kind: "semantic",
    icon: "bulb-outline",
    title: "Kelemahan memori kamu",
    subtitle: "Apa yang lebih sering bikin kamu tersendat?",
    leftLabel: "Lupa detail & fakta",
    rightLabel: "Susah paham konsep besar",
    default: 50,
    centerLabel: (v) => semanticCenter(v, "Lupa detail & fakta", "Susah paham konsep besar"),
  },
  {
    id: "tipe_kerja",
    phase: "kognitif",
    kind: "semantic",
    icon: "speedometer-outline",
    title: "Tipe kerja kamu",
    subtitle: "Kamu lebih prioritaskan yang mana?",
    leftLabel: "Kecepatan",
    rightLabel: "Ketelitian",
    default: 50,
    centerLabel: (v) => semanticCenter(v, "Kecepatan", "Ketelitian"),
  },

  // ── Fase 3: Audit Psikologis ─────────────────────────
  {
    id: "musuh_fokus",
    phase: "psikologis",
    kind: "single",
    icon: "shield-outline",
    title: "Musuh terbesar kamu saat harus fokus?",
    options: [
      { value: "doomscrolling", label: "Doomscrolling HP", icon: "phone-portrait-outline" },
      { value: "overthinking", label: "Terlalu Banyak Berpikir", icon: "bulb-outline" },
      { value: "ngantuk", label: "Ngantuk", icon: "moon-outline" },
      { value: "bingung", label: "Bingung mau mulai dari mana", icon: "help-circle-outline" },
    ],
  },
  {
    id: "reaksi_soal_panjang",
    phase: "psikologis",
    kind: "single",
    icon: "document-text-outline",
    title: "Reaksi kamu pas lihat soal ujian yang panjang banget?",
    subtitle: "Jawaban ini dipakai untuk menyesuaikan gaya bantuan.",
    options: [
      { value: "skip", label: "Skip, cari yang gampang dulu" },
      { value: "panik", label: "Panik, blank seketika" },
      { value: "pelan", label: "Baca pelan-pelan dari awal" },
      { value: "nebak", label: "Nebak aja yang penting keisi" },
    ],
  },
  {
    id: "level_stres",
    phase: "psikologis",
    kind: "capsule",
    icon: "thermometer-outline",
    title: "Level stres akademik kamu sekarang?",
    subtitle: "Semakin jujur, semakin akurat personalisasinya.",
    default: 0,
    valueLabel: (v) =>
      v < 25
        ? { text: "Santai", emoji: "😌", color: "#22C55E" }
        : v < 55
          ? { text: "Agak Tegang", emoji: "😐", color: "#84CC16" }
          : v < 80
            ? { text: "Tegang", emoji: "😥", color: "#F97316" }
            : { text: "Mau Pecah", emoji: "🤯", color: "#EF4444" },
  },
  {
    id: "motivasi",
    phase: "psikologis",
    kind: "single",
    icon: "flame-outline",
    title: "Apa dorongan/motivasi terbesar kamu?",
    options: [
      { value: "ortu_bangga", label: "Bikin orang tua bangga" },
      { value: "takut_gagal", label: "Takut gagal / nggak lulus" },
      { value: "pembuktian", label: "Pembuktian diri" },
      { value: "karir", label: "Ambisi karir / masa depan" },
    ],
  },
  {
    id: "reaksi_nilai_jelek",
    phase: "psikologis",
    kind: "single",
    icon: "trending-down-outline",
    title: "Reaksi kamu pas dapat nilai jelek?",
    subtitle: "Ini membantu menentukan pendekatan feedback.",
    options: [
      { value: "sedih", label: "Sedih & down berhari-hari", icon: "heart-dislike-outline" },
      { value: "menyalahkan", label: "Menyalahkan dosen/soal/sistem", icon: "shield-outline" },
      { value: "evaluasi", label: "Evaluasi & perbaiki strategi", icon: "stats-chart-outline" },
      { value: "cuek", label: "Cuek, yang penting lulus", icon: "cafe-outline" },
    ],
  },

  // ── Fase 4: Preferensi AI ────────────────────────────
  {
    id: "fokus_tanpa_hp",
    phase: "preferensi",
    kind: "single",
    icon: "hourglass-outline",
    title: "Berapa lama kamu bisa fokus tanpa pegang HP?",
    subtitle: "Ini dipakai untuk menyesuaikan ritme sesi belajar.",
    options: [
      { value: "lt15", label: "< 15 menit" },
      { value: "30", label: "Sekitar 30 menit" },
      { value: "60", label: "Sekitar 1 jam" },
      { value: "gt120", label: "> 2 jam" },
    ],
  },
  {
    id: "persona",
    phase: "preferensi",
    kind: "single",
    icon: "sparkles-outline",
    title: "Kamu mau AI bersikap seperti apa?",
    subtitle: "Pilih persona yang paling cocok buatmu.",
    options: [
      { value: "militer", label: "Tutor Militer", sublabel: "Tegas, to the point, nggak mau dengar alasan" },
      { value: "guru_bk", label: "Guru BK", sublabel: "Supportif, sabar, penuh empati" },
      { value: "teman_sebaya", label: "Teman Sebaya", sublabel: "Santai, gaul, kayak ngobrol biasa" },
      { value: "profesor", label: "Profesor", sublabel: "Akademis, detail, penuh referensi" },
    ],
  },
  {
    id: "format_benci",
    phase: "preferensi",
    kind: "single",
    icon: "close-circle-outline",
    title: "Format jawaban AI yang paling kamu benci?",
    subtitle: "Supaya jawaban tidak terasa mengganggu.",
    options: [
      { value: "panjang", label: "Terlalu panjang & bertele-tele" },
      { value: "singkat", label: "Terlalu singkat, nggak jelas" },
      { value: "formal", label: "Terlalu formal & kaku" },
      { value: "bullet", label: "Kebanyakan bullet point, kurang penjelasan" },
    ],
  },
  {
    id: "bantuan_presentasi",
    phase: "preferensi",
    kind: "single",
    icon: "easel-outline",
    title: "Besok kamu presentasi. Mau AI bantu gimana?",
    subtitle: "Pilih skenario penyelamatan yang paling relevan.",
    options: [
      { value: "rangkum", label: "Rangkum materi, kasih poin penting" },
      { value: "simulasi", label: "Simulasi tanya-jawab kayak presentasi beneran" },
      { value: "outline", label: "Buatkan outline slide presentasi" },
      { value: "tenangkan", label: "Tenangkan aku dulu, kasih tips anti-grogi" },
    ],
  },
  {
    id: "output_bahasa",
    phase: "preferensi",
    kind: "single",
    icon: "language-outline",
    title: "Mau output bahasanya seperti apa?",
    subtitle: "Pilih bahasa yang paling nyaman untukmu.",
    options: [
      { value: "id_baku", label: "Bahasa Indonesia Baku", icon: "globe-outline" },
      { value: "id_santai", label: "Bahasa Indonesia Santai", icon: "chatbubble-outline" },
      { value: "en", label: "Bahasa Inggris", icon: "globe-outline" },
      { value: "campur", label: "Campur (Indo-English)", icon: "shuffle-outline" },
    ],
  },

  // ── Fase 5: The Hook ─────────────────────────────────
  {
    id: "hemat_2jam",
    phase: "hook",
    kind: "single",
    icon: "time-outline",
    title: "Kalau AI bisa hemat 2 jam belajar kamu setiap hari, mau dipakai buat apa?",
    subtitle: "Jawaban terakhir untuk memunculkan hook yang paling kuat.",
    options: [
      { value: "tidur", label: "Tidur / istirahat", icon: "moon-outline" },
      { value: "game", label: "Main game", icon: "game-controller-outline" },
      { value: "nongkrong", label: "Nongkrong sama temen", icon: "people-outline" },
      { value: "belajar_lain", label: "Belajar hal lain", icon: "book-outline" },
    ],
  },
];

/** Daftar pertanyaan aktif berdasar cabang jawaban (mis. IPK hanya utk mahasiswa). */
export function activeQuestions(answers: Answers): Question[] {
  return QUESTIONS.filter((q) => !q.includeIf || q.includeIf(answers));
}
