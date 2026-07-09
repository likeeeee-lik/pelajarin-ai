# Spesifikasi Fitur Detail — Note Workspace & AI (userDashboard)

> Sumber: `docs/ss/web/userDashboard/` (55 screenshot). Ini **inti produk** — alur upload materi → pemrosesan AI → catatan berbab, mind map, flashcards, kuis, chat, prediksi soal. **Semua fitur AI = 3rd-party (Claude/Whisper).** Banyak fitur ber-gating Free/Pro.

## A. Pembuatan Materi (dari Dashboard "Buat baru")
Tiap sumber = modal, lalu (untuk file) form konfigurasi, lalu **modal "Memproses dengan AI"** (ring 0→100%, teks: "Menunggu antrian" → "Menganalisis konten dengan AI...").

### Unggah File
1. Modal "Unggah File": dropzone **Drag & drop** — PDF, Word, PowerPoint, Excel, Text (Maks. 100MB/file). File terpilih tampil (nama + ukuran, tombol X). "Batal" / "Lanjutkan".
2. Form konfigurasi (scroll):
   - **Mata Pelajaran/Kuliah**: dropdown searchable "Pilih mata pelajaran..."; ketik → "Tidak ada... Ketik untuk membuat" → tombol **Buat "X"**. Link "Kelola mata pelajaran".
   - **Mode Belajar** (3 kartu): **Kilat** (Poin penting saja) · **Standar** (Seimbang, default) · **Lengkap** (Detail & mendalam).
   - **Gaya Penulisan** (dropdown): Serius & Formal · Ramah & Santai (default) · Menyenangkan & Kreatif · Akademis & Ilmiah.
   - **Bahasa Generasi** (dropdown): 🇮🇩 Bahasa Indonesia · 🇺🇸 English · 🇸🇦 العربية (Arab) · 🇨🇳 中文 (Mandarin).
   - Ringkasan file + "Lanjutkan" → proses AI.

### YouTube
Modal "Unggah File" → field **URL Video YouTube** (`https://youtube.com/watch?v=...`) → "Lanjutkan" → (form konfigurasi sama) → proses. (AI: ambil transkrip → catatan.)

### Audio
Modal dua tab: **Unggah File** (dropzone MP3, WAV — Maks 300MB) / **Rekam Audio** (rekam langsung). → proses (AI: Whisper transkrip → catatan).

### Video
Modal dropzone MP4, MOV → proses (transkrip + catatan).

### Tulis Catatan
Modal "Buat Catatan Baru": **Judul Catatan** (opsional, default) + **Mata Pelajaran/Kuliah** (opsional) → "Buat Catatan" → note kosong; user tulis bab manual via editor.

## B. Dashboard "Catatan Kamu" (koleksi materi)
- Toggle **grid/list**, search "Cari...", filter **Subjek**, sort (Terbaru/Terlama/Judul A-Z/Subjek).
- Kartu materi: ikon per tipe, judul, subjek, cuplikan, label sumber, "X menit lalu".
- Kartu stat "Peringkat" bisa tampil "Top 60% / Terus kejar!".

## C. NOTE WORKSPACE (buka satu catatan) — layout 3 kolom
Header: **judul** · badge subjek · **Bagikan** · **Ekspor PDF**. Meta: tanggal, subjek, "N file".
**Sub-sidebar kiri** (khusus note): **Catatan · Mind Map · Flashcards · Kuis · Dokumen · Chat** + tombol **Tingkatkan** + **Fokus 25:00** (timer Pomodoro: play/reset/settings, bisa di-expand → 25:00 besar).

### Tab: Catatan (Bab/Chapters)
- "Bab — X/Y selesai · N terkunci". Daftar chapter:
  - Nomor, judul, status (**Menunggu** / **Selesai** hijau), panah reorder (atas/bawah).
  - Chapter belum dibuat → tombol **✨ Buat** (generate isi via AI).
  - Chapter Free = chapter 1; chapter 2+ **🔒 Pro** (terkunci, butuh upgrade).
- **+ Tambah Chapter**: input "Judul chapter baru..." → Tambah/Batal.
- Klik chapter → **editor rich text**: toolbar (undo/redo, **B** I U S, code `<>`, H1 H2 H3, quote, list ul/ol, link, table, code block). Autosave "☁ Tersimpan". Nav **Sebelumnya/Selanjutnya**, "Bab i of n". Tombol Ekspor/Bagikan per chapter. Node drag-handle (⋮⋮) tiap blok.

### Tab: Mind Map
- Empty: kartu "Buat Mind Map — Buat peta visual dari catatanmu..." + tombol **Buat Mind Map**.
- Hasil: **tree/spider** horizontal (root = judul note → cabang = chapter → daun = subtopik). Tombol **Buat Ulang** (regenerate), zoom **−/+**.

### Tab: Flashcards
- "Buat Flashcards — Pilih jumlah": **15 · 25 · 50 (PRO)** flashcard. Pilih Chapter (checkbox, "Batal Semua"). Tombol **Buat N Flashcards** → generate AI → review kartu.
- Panel **Asisten AI** di kanan (lihat Chat).

### Tab: Kuis
- **Jenis Soal** (multi, "Pilih Semua"): **Pilihan Ganda · Benar/Salah · Isi Titik-titik**.
- **Jumlah Soal**: 15 · 20 · 30 (semua **PRO**); Free = 5.
- Pilih Chapter. Tombol **Mulai Quiz (5 soal)** → modal "Membuat Quiz — Mempersiapkan quiz..." → kuis interaktif.

### Tab: Dokumen
- Daftar file sumber (nama, PDF • ukuran, tombol download). **Pratinjau** PDF inline (viewer, halaman x of y). Panel Asisten AI di kanan.

### Tab: Chat (Asisten AI) — Fitur PRO
- List **Percakapan** (New Chat +, grup "HARI INI", tiap chat ada jam).
- Selector konteks **"Semua chapter"** (dropdown **Konteks Chapter** multi-select, "Batal Semua").
- Empty: judul note + "Tanyakan tentang catatan ini..." + **prompt saran**: "Jelaskan konsep utama" · "Buat ringkasan singkat" · "Apa poin-poin penting yang harus saya ingat?" · "Berikan contoh soal dari materi ini".
- Input "Tanyakan sesuatu tentang catatan ini..." + kirim. Footer "AI dapat membuat kesalahan. Periksa informasi penting." Badge **Chat AI - Fitur Pro** + **Upgrade ke Pro**.
- Panel **Asisten AI** ringkas juga muncul di tab Flashcards/Kuis/Dokumen (toggle collapse ▣).

### Bagikan & Ekspor
- **Bagikan Catatan**: "Jadikan catatan ini publik untuk membagikannya". Status **Privat** (Hanya kamu) → tombol **Aktifkan** (jadi publik + link).
- **Ekspor PDF**: modal "Pilih chapter yang ingin diexport" (checkbox per chapter, "Batal Semua") → tombol **Ekspor N Bab**.

## D. Prediksi Soal (Latihan Soal) — versi detail
- "Buat Prediksi" → modal **Buat Prediksi Soal Baru**: **Judul Koleksi** + **Tipe** dropdown (UTS/UAS/Kuis/Latihan) + **Mata Pelajaran** → "Lanjut" → **Upload Soal Sebelumnya** (dropzone PDF, JPG, PNG, HEIC — Maks 10 file, 50MB/file) → **Buat Prediksi** → AI **"Menganalisis soal..."** → koleksi prediksi.
- List **Koleksi Soal**: kartu (judul, subjek, "N soal", "X menit lalu"), search "Cari koleksi...".
- Detail koleksi: judul, subjek, tipe, "N soal sumber", badge **Selesai**. Tiap soal: nomor, **tingkat** (Mudah/Sedang/Sulit) + **topik**, teks soal (dukung math/rumus), opsi jawaban (pilihan ganda). Badge **🔒 Terkunci** (Pro). Panel **Analisis** (💡, **PRO** — "Analisis lengkap tersedia di Pro" + Tingkatkan).

## E. Gating Free vs Pro (penting)
- Catatan/Bab: chapter 1 gratis; chapter 2+ **Pro**.
- Kuis: 5 soal gratis; 15/20/30 **Pro**. Flashcards: 15 gratis; 50 **Pro**.
- **Chat AI = Pro**. Analisis prediksi = **Pro**. Mind Map & Flashcards dasar = gratis.

## F. Timer Fokus (Pomodoro)
Di sub-sidebar note: "Fokus 25:00" → expand: display 25:00 besar, tombol **play/reset/settings**.

---

## Implikasi AI (3rd-party)
| Fitur | AI dipakai |
|---|---|
| Proses file/YouTube/audio/video → catatan berbab | Parsing (LlamaParse) + transkrip (Whisper/Groq utk audio/video, youtube-transcript) → **Claude** (susun bab, gaya & bahasa sesuai konfigurasi) |
| Generate isi chapter | **Claude** (per chapter, mode Kilat/Standar/Lengkap) |
| Mind Map | **Claude** (struktur node JSON) |
| Flashcards | **Claude** (Q/A dari chapter terpilih) |
| Kuis | **Claude** (soal + jawaban + pembahasan) |
| Chat asisten | **Claude** (RAG konteks chapter terpilih) |
| Prediksi soal | **Claude** (analisis pola soal lama → prediksi) |

**Parameter generasi** dari form: modeBelajar (kilat/standar/lengkap), gayaPenulisan (formal/santai/kreatif/akademis), bahasa (id/en/ar/zh). Disimpan per-note; dipakai menyusun prompt Claude. Golden hours / persona onboarding juga bisa memengaruhi.
