import type { PredictionItem } from "./store";

/**
 * Generator soal prediksi (mock, deterministik dari id) supaya halaman detail
 * Latihan Soal punya konten nyata tanpa backend AI. Bank soal dipilih dari
 * kata kunci mata pelajaran; urutan/subset di-seed dari id agar stabil saat
 * refresh namun berbeda antar prediksi.
 * TODO(API): ganti dengan hasil prediksi AI nyata saat endpoint tersedia.
 */

export type Kesulitan = "mudah" | "sedang" | "sulit";

export interface PredictedQuestion {
  nomor: number;
  kesulitan: Kesulitan;
  topik: string;
  pertanyaan: string;
  opsi: string[];
  jawabanIndex: number;
  pembahasan: string;
}

type BankItem = Omit<PredictedQuestion, "nomor">;

const FISIKA: BankItem[] = [
  {
    kesulitan: "mudah",
    topik: "Kinematika Gerak Horizontal",
    pertanyaan:
      "Sebuah bola dilempar secara horizontal dari ketinggian 20 m dengan kecepatan awal 15 m/s. Asumsikan percepatan gravitasi g = 9,8 m/s² dan tidak ada tahanan udara.\n\nHitung jarak horizontal yang ditempuh bola tersebut sebelum menyentuh tanah.",
    opsi: ["28 meter", "30 meter", "32 meter", "34 meter"],
    jawabanIndex: 1,
    pembahasan:
      "Waktu jatuh t = √(2h/g) = √(40/9,8) ≈ 2,02 s. Jarak horizontal x = v₀·t = 15 × 2,02 ≈ 30 meter.",
  },
  {
    kesulitan: "sedang",
    topik: "Energi Kinetik",
    pertanyaan: "Sebuah benda bermassa 2 kg bergerak dengan kecepatan 10 m/s. Berapa energi kinetiknya?",
    opsi: ["50 J", "100 J", "200 J", "400 J"],
    jawabanIndex: 1,
    pembahasan: "Ek = ½mv² = ½ × 2 × 10² = 100 J.",
  },
  {
    kesulitan: "mudah",
    topik: "Hukum Newton II",
    pertanyaan: "Gaya sebesar 10 N bekerja pada benda bermassa 2 kg. Berapa percepatan benda tersebut?",
    opsi: ["2 m/s²", "5 m/s²", "10 m/s²", "20 m/s²"],
    jawabanIndex: 1,
    pembahasan: "a = F/m = 10 / 2 = 5 m/s².",
  },
  {
    kesulitan: "sedang",
    topik: "Gerak Lurus Berubah Beraturan",
    pertanyaan: "Mobil bergerak dari keadaan diam dengan percepatan 2 m/s² selama 5 sekon. Berapa kecepatan akhirnya?",
    opsi: ["5 m/s", "10 m/s", "15 m/s", "20 m/s"],
    jawabanIndex: 1,
    pembahasan: "v = v₀ + at = 0 + 2 × 5 = 10 m/s.",
  },
  {
    kesulitan: "sulit",
    topik: "Gaya Berat",
    pertanyaan: "Sebuah benda bermassa 5 kg berada di permukaan bumi (g = 9,8 m/s²). Berapa gaya beratnya?",
    opsi: ["5 N", "49 N", "50 N", "98 N"],
    jawabanIndex: 1,
    pembahasan: "w = m·g = 5 × 9,8 = 49 N.",
  },
  {
    kesulitan: "sedang",
    topik: "Usaha",
    pertanyaan: "Gaya 20 N mendorong benda sejauh 3 m searah gaya. Berapa usaha yang dilakukan?",
    opsi: ["20 J", "40 J", "60 J", "80 J"],
    jawabanIndex: 2,
    pembahasan: "W = F·s = 20 × 3 = 60 J.",
  },
];

const MATEMATIKA: BankItem[] = [
  {
    kesulitan: "sedang",
    topik: "Persamaan Kuadrat",
    pertanyaan: "Tentukan akar-akar persamaan x² − 5x + 6 = 0.",
    opsi: ["2 dan 3", "1 dan 6", "−2 dan −3", "2 dan −3"],
    jawabanIndex: 0,
    pembahasan: "x² − 5x + 6 = (x − 2)(x − 3) = 0, sehingga x = 2 atau x = 3.",
  },
  {
    kesulitan: "sedang",
    topik: "Turunan Fungsi",
    pertanyaan: "Jika f(x) = 3x², maka turunan pertama f′(x) adalah …",
    opsi: ["3x", "6x", "6x²", "9x"],
    jawabanIndex: 1,
    pembahasan: "f′(x) = 2 × 3 × x^(2−1) = 6x.",
  },
  {
    kesulitan: "mudah",
    topik: "Sistem Persamaan Linear",
    pertanyaan: "Diketahui x + y = 10 dan x − y = 2. Nilai x dan y adalah …",
    opsi: ["x = 6, y = 4", "x = 4, y = 6", "x = 5, y = 5", "x = 8, y = 2"],
    jawabanIndex: 0,
    pembahasan: "Jumlahkan kedua persamaan: 2x = 12 → x = 6, maka y = 4.",
  },
  {
    kesulitan: "mudah",
    topik: "Barisan Aritmetika",
    pertanyaan: "Barisan aritmetika dengan U₁ = 3 dan beda 4. Berapa suku ke-5?",
    opsi: ["15", "19", "23", "27"],
    jawabanIndex: 1,
    pembahasan: "Uₙ = U₁ + (n−1)b = 3 + 4×4 = 19.",
  },
  {
    kesulitan: "sedang",
    topik: "Peluang",
    pertanyaan: "Sebuah dadu dilempar sekali. Berapa peluang muncul angka genap?",
    opsi: ["1/6", "1/3", "1/2", "2/3"],
    jawabanIndex: 2,
    pembahasan: "Angka genap = {2, 4, 6} → 3 dari 6, peluang = 3/6 = 1/2.",
  },
  {
    kesulitan: "sulit",
    topik: "Logaritma",
    pertanyaan: "Nilai dari log 100 (basis 10) adalah …",
    opsi: ["1", "2", "10", "100"],
    jawabanIndex: 1,
    pembahasan: "log₁₀ 100 = log₁₀ 10² = 2.",
  },
];

const UMUM: BankItem[] = [
  {
    kesulitan: "mudah",
    topik: "Kosakata",
    pertanyaan: "Sinonim (persamaan kata) yang paling tepat untuk kata \"cerdas\" adalah …",
    opsi: ["Pandai", "Malas", "Lambat", "Lupa"],
    jawabanIndex: 0,
    pembahasan: "\"Cerdas\" bersinonim dengan \"pandai\".",
  },
  {
    kesulitan: "sedang",
    topik: "Pola Bilangan",
    pertanyaan: "Perhatikan deret: 2, 4, 8, 16, … Bilangan berikutnya adalah …",
    opsi: ["18", "24", "32", "64"],
    jawabanIndex: 2,
    pembahasan: "Setiap suku dikali 2: 16 × 2 = 32.",
  },
  {
    kesulitan: "mudah",
    topik: "Ide Pokok",
    pertanyaan:
      "\"Membaca setiap hari melatih otak, memperluas kosakata, dan meningkatkan konsentrasi.\" Ide pokok kalimat tersebut adalah …",
    opsi: ["Manfaat membaca", "Cara menulis", "Jenis buku", "Waktu belajar"],
    jawabanIndex: 0,
    pembahasan: "Kalimat menyebut berbagai manfaat dari kegiatan membaca.",
  },
  {
    kesulitan: "sedang",
    topik: "Penalaran Logis",
    pertanyaan: "Semua siswa memakai seragam. Budi seorang siswa. Maka …",
    opsi: ["Budi memakai seragam", "Budi tidak berseragam", "Budi bukan siswa", "Tidak dapat disimpulkan"],
    jawabanIndex: 0,
    pembahasan: "Silogisme: jika semua siswa berseragam dan Budi siswa, maka Budi berseragam.",
  },
  {
    kesulitan: "sulit",
    topik: "Antonim",
    pertanyaan: "Antonim (lawan kata) dari kata \"abstrak\" adalah …",
    opsi: ["Konkret", "Rumit", "Samar", "Umum"],
    jawabanIndex: 0,
    pembahasan: "Lawan dari \"abstrak\" (tidak berwujud) adalah \"konkret\" (nyata).",
  },
  {
    kesulitan: "mudah",
    topik: "Aritmetika Dasar",
    pertanyaan: "Hasil dari 15% × 200 adalah …",
    opsi: ["15", "20", "30", "45"],
    jawabanIndex: 2,
    pembahasan: "15% × 200 = 0,15 × 200 = 30.",
  },
];

function pickBank(mapel: string): BankItem[] {
  const m = mapel.toLowerCase();
  if (/(fisika|ipa|sains|kimia|biologi)/.test(m)) return FISIKA;
  if (/(matematika|mtk|kalkulus|aljabar|statistik)/.test(m)) return MATEMATIKA;
  return UMUM;
}

function seedFrom(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return h;
}

/** Hasilkan daftar soal prediksi deterministik untuk sebuah item prediksi. */
export function generatePredictedQuestions(item: Pick<PredictionItem, "id" | "mapel">): PredictedQuestion[] {
  const bank = pickBank(item.mapel);
  const seed = seedFrom(item.id);
  const count = Math.min(5, bank.length);
  const start = seed % bank.length;
  return Array.from({ length: count }, (_, i) => {
    const q = bank[(start + i) % bank.length];
    return { ...q, nomor: i + 1 };
  });
}

export const KESULITAN_LABEL: Record<Kesulitan, string> = {
  mudah: "Mudah",
  sedang: "Sedang",
  sulit: "Sulit",
};
