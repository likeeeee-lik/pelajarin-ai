/**
 * Data leaderboard tiruan. Top-10 diambil dari screenshot; sisanya digenerate
 * agar cukup untuk paginasi (50 entri). TODO(API): ganti GET /leaderboard.
 */
export interface LeaderRow {
  name: string;
  level: number;
  xp: number;
  streak: number;
  color: string;
}

const AVATAR_COLORS = [
  "from-teal-500 to-teal-600",
  "from-rose-500 to-rose-600",
  "from-sky-500 to-sky-600",
  "from-amber-500 to-amber-600",
  "from-emerald-500 to-emerald-600",
  "from-purple-500 to-purple-600",
  "from-orange-500 to-orange-600",
  "from-cyan-500 to-cyan-600",
];

const TOP: Omit<LeaderRow, "color">[] = [
  { name: "Asep", level: 43, xp: 45150, streak: 128 },
  { name: "m saba sulaiman", level: 35, xp: 30645, streak: 96 },
  { name: "jonathan felix handoko", level: 34, xp: 29995, streak: 88 },
  { name: "Enna", level: 34, xp: 29257, streak: 74 },
  { name: "Ratu Dianca", level: 28, xp: 20930, streak: 61 },
  { name: "OKI DWI YULIANTO", level: 27, xp: 19050, streak: 54 },
  { name: "Jarvis", level: 26, xp: 18480, streak: 47 },
  { name: "mutey", level: 26, xp: 17895, streak: 43 },
  { name: "Qaireen Shabira Nugraha", level: 25, xp: 17070, streak: 39 },
  { name: "Made Bayu Adhi Wira Pratama", level: 24, xp: 15465, streak: 35 },
];

const FILLER_NAMES = [
  "Dewi Anggraini", "Rizky Pratama", "Siti Nurhaliza", "Bagus Setiawan",
  "Putri Maharani", "Andi Wijaya", "Nabila Zahra", "Farhan Maulana",
  "Intan Permata", "Yoga Saputra", "Kirana Ayu", "Reza Fahlevi",
  "Melati Sari", "Dimas Aditya", "Salsa Kirani", "Gilang Ramadhan",
  "Aulia Rahma", "Bima Sakti", "Nadia Putri", "Fajar Nugroho",
  "Citra Lestari", "Hendra Gunawan", "Vina Oktavia", "Rafi Ahmad",
  "Tania Wulandari", "Ilham Kurnia", "Mega Utami", "Deni Kurniawan",
  "Lia Anjani", "Surya Pratama", "Wulan Sari", "Adit Nugraha",
  "Zahra Amelia", "Krisna Bayu", "Ratih Purnama", "Eko Prasetyo",
  "Ayu Lestari", "Bayu Segara", "Nisa Rahmania", "Toni Hartono",
];

export const LEADERBOARD: LeaderRow[] = [
  ...TOP.map((r, i) => ({ ...r, color: AVATAR_COLORS[i % AVATAR_COLORS.length] as string })),
  ...FILLER_NAMES.map((name, i) => {
    const xp = 15000 - i * 320 - (i % 3) * 90;
    return {
      name,
      level: Math.max(3, 23 - Math.floor(i / 2)),
      xp,
      streak: Math.max(0, 33 - i),
      color: AVATAR_COLORS[(i + 3) % AVATAR_COLORS.length] as string,
    };
  }),
];

export const LEADERBOARD_TOTAL = 50;
export const LEADERBOARD_PER_PAGE = 10;
