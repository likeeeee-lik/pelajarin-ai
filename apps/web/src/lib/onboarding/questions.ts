import {
  Activity,
  BarChart3,
  Bot,
  Brain,
  BookCheck,
  BookMarked,
  BookOpen,
  Briefcase,
  Clock,
  Coffee,
  Dumbbell,
  Eye,
  FileText,
  FileX,
  Flame,
  Gamepad2,
  Gauge,
  Globe,
  GraduationCap,
  Headphones,
  HeartCrack,
  HelpCircle,
  Hourglass,
  Languages,
  Medal,
  MessageSquare,
  MonitorPlay,
  Moon,
  Scale,
  School,
  Shield,
  ShieldAlert,
  Smartphone,
  Sun,
  Target,
  TrendingDown,
  TrendingUp,
  UserRound,
  Users,
} from "lucide-react";
import type { Answers, Phase, Question } from "./types";

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
    icon: UserRound,
    title: "Siapa yang sedang kita bantu hari ini?",
    options: [
      { value: "smp", label: "SMP", icon: School },
      { value: "sma_smk", label: "SMA/SMK", icon: School },
      { value: "mahasiswa_s1", label: "Mahasiswa S1", icon: GraduationCap },
      { value: "pascasarjana", label: "Pascasarjana", icon: BookOpen },
      { value: "profesional", label: "Profesional", icon: Briefcase },
    ],
  },
  {
    id: "target_6bulan",
    phase: "identitas",
    kind: "single",
    icon: Target,
    title: "Apa target utamamu dalam 6 bulan ke depan?",
    options: [
      { value: "lulus_ujian", label: "Lulus Ujian / SNBT", icon: Target },
      { value: "ipk_cumlaude", label: "Kejar IPK Cumlaude", icon: Medal },
      { value: "skripsi", label: "Berjuang Lulus Skripsi/TA", icon: BookMarked },
      { value: "upskilling", label: "Upskilling / Belajar Hal Baru", icon: Flame },
    ],
  },
  {
    id: "ambisi",
    phase: "identitas",
    kind: "scale",
    icon: TrendingUp,
    title: "Seberapa ambisius kamu?",
    subtitle: "1 = santai aja, 10 = harus jadi yang terbaik",
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
    icon: GraduationCap,
    title: "Nilai rata-rata/IPK saat ini vs target?",
    subtitle: "Geser slider untuk menyesuaikan",
    includeIf: (a: Answers) => a.jenjang === "mahasiswa_s1" || a.jenjang === "pascasarjana",
    left: { key: "ipk_saat_ini", label: "IPK Saat Ini", min: 0, max: 4, step: 0.1, default: 3.0 },
    right: { key: "ipk_target", label: "Target IPK", min: 0, max: 4, step: 0.1, default: 3.5 },
  },

  // ── Fase 2: Pemetaan Kognitif ────────────────────────
  {
    id: "golden_hours",
    phase: "kognitif",
    kind: "curve",
    icon: Sun,
    title: "Golden Hours — kapan energi kamu paling tinggi?",
    subtitle: "Geser titik-titik untuk menggambar kurva energi kamu",
    hours: [6, 8, 10, 12, 14, 16, 18, 20, 22, 24],
    default: 50,
  },
  {
    id: "cara_paham",
    phase: "kognitif",
    kind: "single",
    icon: BookOpen,
    title: "Cara tercepat kamu paham materi yang rumit?",
    options: [
      { value: "visual", label: "Visual & Diagram", icon: Eye },
      { value: "audio", label: "Mendengarkan", icon: Headphones },
      { value: "baca", label: "Membaca", icon: BookCheck },
      { value: "latihan", label: "Latihan Soal", icon: Dumbbell },
    ],
  },
  {
    id: "gaya_belajar",
    phase: "kognitif",
    kind: "semantic",
    icon: Scale,
    title: "Posisi gaya belajar kamu",
    subtitle: "Di mana kamu di antara dua kutub ini?",
    leftLabel: "Teori dulu baru praktek",
    rightLabel: "Langsung praktek",
    default: 50,
    centerLabel: (v) => semanticCenter(v, "Teori dulu baru praktek", "Langsung praktek"),
  },
  {
    id: "kelemahan_memori",
    phase: "kognitif",
    kind: "semantic",
    icon: Brain,
    title: "Kelemahan memori kamu",
    subtitle: "Mana yang lebih sering kamu alami?",
    leftLabel: "Lupa detail & fakta",
    rightLabel: "Susah paham konsep besar",
    default: 50,
    centerLabel: (v) => semanticCenter(v, "Lupa detail & fakta", "Susah paham konsep besar"),
  },
  {
    id: "tipe_kerja",
    phase: "kognitif",
    kind: "semantic",
    icon: Gauge,
    title: "Tipe kerja kamu",
    subtitle: "Kamu lebih prioritaskan yang mana?",
    leftLabel: "Kecepatan (Speed)",
    rightLabel: "Ketelitian (Akurasi)",
    default: 50,
    centerLabel: (v) => semanticCenter(v, "Kecepatan (Speed)", "Ketelitian (Akurasi)"),
  },

  // ── Fase 3: Audit Psikologis ─────────────────────────
  {
    id: "musuh_fokus",
    phase: "psikologis",
    kind: "single",
    icon: ShieldAlert,
    title: "Musuh terbesar kamu saat harus fokus?",
    options: [
      { value: "doomscrolling", label: "Doomscrolling HP", icon: Smartphone },
      { value: "overthinking", label: "Terlalu Banyak Berpikir", icon: Brain },
      { value: "ngantuk", label: "Ngantuk", icon: Moon },
      { value: "bingung", label: "Bingung mau mulai dari mana", icon: HelpCircle },
    ],
  },
  {
    id: "reaksi_soal_panjang",
    phase: "psikologis",
    kind: "single",
    icon: FileText,
    title: "Reaksi kamu pas lihat soal ujian yang panjang banget?",
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
    icon: Activity,
    title: "Level stres akademik kamu sekarang?",
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
    icon: Flame,
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
    icon: TrendingDown,
    title: "Reaksi kamu pas dapat nilai jelek?",
    options: [
      { value: "sedih", label: "Sedih & down berhari-hari", icon: HeartCrack },
      { value: "menyalahkan", label: "Menyalahkan dosen/soal/sistem", icon: Shield },
      { value: "evaluasi", label: "Evaluasi & perbaiki strategi", icon: BarChart3 },
      { value: "cuek", label: "Cuek, yang penting lulus", icon: Coffee },
    ],
  },

  // ── Fase 4: Preferensi AI ────────────────────────────
  {
    id: "fokus_tanpa_hp",
    phase: "preferensi",
    kind: "single",
    icon: Hourglass,
    title: "Berapa lama kamu bisa fokus tanpa pegang HP?",
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
    icon: Bot,
    title: "Kamu mau AI bersikap seperti apa?",
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
    icon: FileX,
    title: "Format jawaban AI yang paling kamu benci?",
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
    icon: MonitorPlay,
    title: "Besok kamu presentasi. Mau AI bantu gimana?",
    options: [
      { value: "rangkum", label: "Rangkumin materi, kasih poin-poin penting" },
      { value: "simulasi", label: "Simulasi tanya-jawab kayak presentasi beneran" },
      { value: "outline", label: "Buatkan outline slide presentasi" },
      { value: "tenangkan", label: "Tenangkan aku dulu, kasih tips anti-grogi" },
    ],
  },
  {
    id: "output_bahasa",
    phase: "preferensi",
    kind: "single",
    icon: Languages,
    title: "Mau output bahasanya seperti apa?",
    options: [
      { value: "id_baku", label: "Bahasa Indonesia Baku", icon: Globe },
      { value: "id_santai", label: "Bahasa Indonesia Santai", icon: MessageSquare },
      { value: "en", label: "Bahasa Inggris", icon: Globe },
      { value: "campur", label: "Campur (Indo-English)", icon: Target },
    ],
  },

  // ── Fase 5: The Hook ─────────────────────────────────
  {
    id: "hemat_2jam",
    phase: "hook",
    kind: "single",
    icon: Clock,
    title: "Kalau AI bisa hemat 2 jam belajar kamu setiap hari, mau dipakai buat apa?",
    options: [
      { value: "tidur", label: "Tidur / istirahat", icon: Moon },
      { value: "game", label: "Main game", icon: Gamepad2 },
      { value: "nongkrong", label: "Nongkrong sama temen", icon: Users },
      { value: "belajar_lain", label: "Belajar hal lain", icon: BookOpen },
    ],
  },
];

/** Daftar pertanyaan aktif berdasar cabang jawaban (mis. IPK hanya utk mahasiswa). */
export function activeQuestions(answers: Answers): Question[] {
  return QUESTIONS.filter((q) => !q.includeIf || q.includeIf(answers));
}
