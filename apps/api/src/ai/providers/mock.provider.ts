import { Injectable } from "@nestjs/common";
import { AiProvider } from "../ai-provider";
import type {
  ChapterInput,
  ChapterResult,
  ChatInput,
  ChatResult,
  FlashcardsInput,
  FlashcardsResult,
  MindmapInput,
  MindmapResult,
  OutlineInput,
  OutlineResult,
  PredictExamInput,
  PredictExamResult,
  QuizInput,
  QuizResult,
  QuizType,
} from "../ai.types";

/**
 * Provider tiruan: mengembalikan konten contoh terstruktur agar seluruh fitur
 * berjalan end-to-end tanpa API key. Ganti ke ClaudeProvider (AI_PROVIDER=claude)
 * saat siap — tanpa mengubah kode fitur.
 */
@Injectable()
export class MockAiProvider extends AiProvider {
  async generateOutline(input: OutlineInput): Promise<OutlineResult> {
    const t = input.judul.trim() || "Materi";
    return {
      chapters: [
        { judul: `Pengenalan ${t}` },
        { judul: `Konsep Dasar ${t}` },
        { judul: `Komponen Utama` },
        { judul: `Penerapan & Contoh` },
        { judul: `Studi Kasus` },
        { judul: `Kesimpulan Materi` },
      ],
    };
  }

  async generateChapter(input: ChapterInput): Promise<ChapterResult> {
    const depth = input.config.modeBelajar === "lengkap" ? 3 : input.config.modeBelajar === "kilat" ? 1 : 2;
    const poin = Array.from({ length: depth + 1 }, (_, i) => `- Poin penting ${i + 1} tentang **${input.chapterTitle}**.`).join("\n");
    return {
      kontenMd: [
        `# ${input.chapterTitle}`,
        ``,
        `Ringkasan bab ini dari materi *${input.judul}* (mode: ${input.config.modeBelajar}, gaya: ${input.config.gayaPenulisan}).`,
        ``,
        `## Poin Utama`,
        poin,
        ``,
        `## Penjelasan`,
        `Bagian ini menjelaskan konsep inti secara ${input.config.gayaPenulisan}. (Konten contoh — akan digantikan hasil AI asli saat AI_PROVIDER=claude.)`,
        ``,
        `> Catatan: Tinjau kembali poin di atas sebelum lanjut ke bab berikutnya.`,
      ].join("\n"),
    };
  }

  async generateMindmap(input: MindmapInput): Promise<MindmapResult> {
    return {
      root: {
        label: input.judul || "Materi",
        children: (input.chapters.length ? input.chapters : ["Bagian 1", "Bagian 2", "Bagian 3"]).map((c) => ({
          label: c,
          children: [{ label: `${c} — inti` }, { label: `${c} — contoh` }],
        })),
      },
    };
  }

  async generateFlashcards(input: FlashcardsInput): Promise<FlashcardsResult> {
    return {
      cards: Array.from({ length: input.count }, (_, i) => ({
        front: `Pertanyaan ${i + 1} dari "${input.judul}"?`,
        back: `Jawaban ringkas ${i + 1}. (contoh)`,
      })),
    };
  }

  async generateQuiz(input: QuizInput): Promise<QuizResult> {
    const types: QuizType[] = input.types.length ? input.types : ["pilihan_ganda"];
    return {
      questions: Array.from({ length: input.count }, (_, i) => {
        const tipe = types[i % types.length] as QuizType;
        if (tipe === "benar_salah") {
          return { pertanyaan: `Pernyataan ${i + 1} tentang ${input.judul} benar.`, tipe, opsi: ["Benar", "Salah"], jawaban: "Benar", pembahasan: "Contoh pembahasan." };
        }
        if (tipe === "isian") {
          return { pertanyaan: `Lengkapi: konsep utama ${input.judul} adalah ___.`, tipe, jawaban: "konsep contoh", pembahasan: "Contoh pembahasan." };
        }
        return {
          pertanyaan: `Soal ${i + 1}: manakah yang benar tentang ${input.judul}?`,
          tipe,
          opsi: ["Opsi A", "Opsi B (benar)", "Opsi C", "Opsi D"],
          jawaban: "Opsi B (benar)",
          pembahasan: "Contoh pembahasan.",
        };
      }),
    };
  }

  async chat(input: ChatInput): Promise<ChatResult> {
    return {
      reply: `Berdasarkan catatan ini, berikut jawaban singkat untuk "${input.question}":\n\n- Poin 1\n- Poin 2\n\n(Jawaban contoh — aktifkan AI asli dengan AI_PROVIDER=claude.)`,
    };
  }

  /** Mock tak bisa melihat gambar. */
  async readImage(): Promise<string> {
    return "";
  }

  async predictExam(input: PredictExamInput): Promise<PredictExamResult> {
    // Pilih bank soal contoh dari kata kunci judul/sumber. (Konten contoh —
    // hasil analisis nyata muncul saat AI_PROVIDER=claude.)
    const hay = `${input.judul} ${input.sourceText}`.toLowerCase();
    const bank = /(fisika|ipa|sains|kimia|biologi)/.test(hay)
      ? PREDICT_FISIKA
      : /(matematika|mtk|kalkulus|aljabar|statistik)/.test(hay)
        ? PREDICT_MATEMATIKA
        : PREDICT_UMUM;
    return { questions: bank.slice(0, 5) };
  }
}

const PREDICT_FISIKA: PredictExamResult["questions"] = [
  {
    pertanyaan:
      "Sebuah bola dilempar horizontal dari ketinggian 20 m dengan kecepatan awal 15 m/s (g = 9,8 m/s², tanpa hambatan udara). Berapa jarak horizontal yang ditempuh sebelum menyentuh tanah?",
    tingkat: "mudah",
    topik: "Kinematika Gerak Horizontal",
    opsi: ["28 meter", "30 meter", "32 meter", "34 meter"],
    jawaban: "30 meter",
    pembahasan: "t = √(2h/g) = √(40/9,8) ≈ 2,02 s; x = v₀·t = 15 × 2,02 ≈ 30 m.",
  },
  {
    pertanyaan: "Benda bermassa 2 kg bergerak dengan kecepatan 10 m/s. Berapa energi kinetiknya?",
    tingkat: "sedang",
    topik: "Energi Kinetik",
    opsi: ["50 J", "100 J", "200 J", "400 J"],
    jawaban: "100 J",
    pembahasan: "Ek = ½mv² = ½ × 2 × 10² = 100 J.",
  },
  {
    pertanyaan: "Gaya 10 N bekerja pada benda bermassa 2 kg. Berapa percepatannya?",
    tingkat: "mudah",
    topik: "Hukum Newton II",
    opsi: ["2 m/s²", "5 m/s²", "10 m/s²", "20 m/s²"],
    jawaban: "5 m/s²",
    pembahasan: "a = F/m = 10 / 2 = 5 m/s².",
  },
  {
    pertanyaan: "Mobil dari keadaan diam dipercepat 2 m/s² selama 5 s. Berapa kecepatan akhirnya?",
    tingkat: "sedang",
    topik: "Gerak Lurus Berubah Beraturan",
    opsi: ["5 m/s", "10 m/s", "15 m/s", "20 m/s"],
    jawaban: "10 m/s",
    pembahasan: "v = v₀ + at = 0 + 2 × 5 = 10 m/s.",
  },
  {
    pertanyaan: "Benda bermassa 5 kg di permukaan bumi (g = 9,8 m/s²). Berapa gaya beratnya?",
    tingkat: "sulit",
    topik: "Gaya Berat",
    opsi: ["5 N", "49 N", "50 N", "98 N"],
    jawaban: "49 N",
    pembahasan: "w = m·g = 5 × 9,8 = 49 N.",
  },
];

const PREDICT_MATEMATIKA: PredictExamResult["questions"] = [
  {
    pertanyaan: "Tentukan akar-akar persamaan x² − 5x + 6 = 0.",
    tingkat: "sedang",
    topik: "Persamaan Kuadrat",
    opsi: ["2 dan 3", "1 dan 6", "−2 dan −3", "2 dan −3"],
    jawaban: "2 dan 3",
    pembahasan: "(x − 2)(x − 3) = 0 → x = 2 atau x = 3.",
  },
  {
    pertanyaan: "Jika f(x) = 3x², maka f′(x) adalah …",
    tingkat: "sedang",
    topik: "Turunan Fungsi",
    opsi: ["3x", "6x", "6x²", "9x"],
    jawaban: "6x",
    pembahasan: "f′(x) = 2 × 3 × x^(2−1) = 6x.",
  },
  {
    pertanyaan: "Diketahui x + y = 10 dan x − y = 2. Nilai x dan y adalah …",
    tingkat: "mudah",
    topik: "Sistem Persamaan Linear",
    opsi: ["x = 6, y = 4", "x = 4, y = 6", "x = 5, y = 5", "x = 8, y = 2"],
    jawaban: "x = 6, y = 4",
    pembahasan: "2x = 12 → x = 6, maka y = 4.",
  },
  {
    pertanyaan: "Barisan aritmetika U₁ = 3, beda 4. Berapa suku ke-5?",
    tingkat: "mudah",
    topik: "Barisan Aritmetika",
    opsi: ["15", "19", "23", "27"],
    jawaban: "19",
    pembahasan: "Uₙ = U₁ + (n−1)b = 3 + 4×4 = 19.",
  },
  {
    pertanyaan: "Sebuah dadu dilempar sekali. Berapa peluang muncul angka genap?",
    tingkat: "sedang",
    topik: "Peluang",
    opsi: ["1/6", "1/3", "1/2", "2/3"],
    jawaban: "1/2",
    pembahasan: "Genap = {2,4,6} → 3/6 = 1/2.",
  },
];

const PREDICT_UMUM: PredictExamResult["questions"] = [
  {
    pertanyaan: "Sinonim yang paling tepat untuk kata \"cerdas\" adalah …",
    tingkat: "mudah",
    topik: "Kosakata",
    opsi: ["Pandai", "Malas", "Lambat", "Lupa"],
    jawaban: "Pandai",
    pembahasan: "\"Cerdas\" bersinonim dengan \"pandai\".",
  },
  {
    pertanyaan: "Perhatikan deret: 2, 4, 8, 16, … Bilangan berikutnya adalah …",
    tingkat: "sedang",
    topik: "Pola Bilangan",
    opsi: ["18", "24", "32", "64"],
    jawaban: "32",
    pembahasan: "Tiap suku dikali 2: 16 × 2 = 32.",
  },
  {
    pertanyaan:
      "\"Membaca setiap hari melatih otak dan memperluas kosakata.\" Ide pokok kalimat tersebut adalah …",
    tingkat: "mudah",
    topik: "Ide Pokok",
    opsi: ["Manfaat membaca", "Cara menulis", "Jenis buku", "Waktu belajar"],
    jawaban: "Manfaat membaca",
    pembahasan: "Kalimat menyebut manfaat dari kegiatan membaca.",
  },
  {
    pertanyaan: "Semua siswa memakai seragam. Budi seorang siswa. Maka …",
    tingkat: "sedang",
    topik: "Penalaran Logis",
    opsi: ["Budi memakai seragam", "Budi tidak berseragam", "Budi bukan siswa", "Tidak dapat disimpulkan"],
    jawaban: "Budi memakai seragam",
    pembahasan: "Silogisme: semua siswa berseragam, Budi siswa → Budi berseragam.",
  },
  {
    pertanyaan: "Hasil dari 15% × 200 adalah …",
    tingkat: "sulit",
    topik: "Aritmetika Dasar",
    opsi: ["15", "20", "30", "45"],
    jawaban: "30",
    pembahasan: "0,15 × 200 = 30.",
  },
];
