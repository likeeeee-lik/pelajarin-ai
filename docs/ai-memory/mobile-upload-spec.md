# Alur Unggah Materi — MOBILE (dari docs/ss/app/homepage, 8 layar) — dibaca 2026-07-12

> **8 layar sudah diringkas di sini. JANGAN buka ulang screenshot-nya.**

Alur: **FAB (+) di Beranda → Bottom sheet pilih sumber → Wizard 2 langkah → Proses → kartu progres di Beranda**

---

## 1. Bottom sheet "Buat catatan baru" (`kategori upload.jpeg`)
Muncul dari bawah (bukan layar penuh). Ada handle bar kecil di atas + tombol **✕**.
- Judul **"Buat catatan baru"**, sub **"Pilih bahan yang mau kamu ubah jadi catatan"**
- **4 baris** (kartu, ikon persegi-membulat berwarna, teks + subteks, panah ›):

| Sumber | Ikon/warna | Subteks |
|---|---|---|
| **Upload File** | biru | PDF, Word, PPT |
| **YouTube** | merah | Tempel link video |
| **Audio** | hijau | MP3, WAV, rekaman |
| **Video** | ungu | MP4, MOV |

⚠️ **Tidak ada opsi "Tulis Catatan"** di sheet ini (web punya). 4 sumber saja.

---

## 2. Wizard "Upload Materi" — LANGKAH 1/2 (pilih bahan)
Header: **✕** · judul **"Upload Materi"** · kanan **"Langkah 1 / 2"**.
Di bawahnya **2 segmen progres** (segmen-1 oranye, segmen-2 abu).
Isi berbeda per sumber, semuanya diakhiri tombol oranye **"Lanjutkan"** (disabled sampai terisi):

- **File** (`upload file.jpeg`): judul "Pilih File", sub "Upload PDF, DOCX, PPT, atau dokumen lainnya untuk dibuatkan catatan belajar". Ikon biru → **"Tap untuk memilih file"** · format: `PDF, DOCX, DOC, PPT, PPTX, TXT`
- **YouTube** (`upload yt.jpeg`): judul "Masukkan URL YouTube". Input dengan ikon, placeholder `https://youtube.com/watch?v=...`
- **Audio** (`upload audio.jpeg`): judul "Pilih Audio". Ikon hijau → **"Tap untuk memilih audio"** · `MP3, WAV, M4A, OGG`
- **Video** (`upload video.jpeg`): judul "Pilih Video". Ikon ungu → **"Tap untuk memilih video"** · `MP4, MOV, AVI, MKV`

---

## 3. Wizard — LANGKAH 2/2 "Pengaturan Catatan" (`detail upload.jpeg`)
Kedua segmen progres oranye. Sub: "Atur gaya catatan dan bahasa yang kamu mau".

- **Mata Pelajaran/Kuliah** `*` (WAJIB, ada tanda bintang merah) — dropdown "Pilih mata pelajaran..."
- **Mode Belajar** — 3 kartu sejajar (ikon + judul + subteks), default **Standar**:
  - **Kilat** (✨ kuning) — "Inti materi"
  - **Standar** (oranye, TERPILIH) — "Seimbang"
  - **Lengkap** (🎯 merah) — "Mendalam"
- **Gaya Penulisan** — dropdown dengan emoji, default **😊 Ramah & Santai**
- **Bahasa Catatan** — dropdown dengan bendera, default **🇮🇩 Bahasa Indonesia**, catatan kecil "Catatan akan dibuat dalam bahasa ini"
- **Kartu berkas terpilih** — ikon sumber + nama/URL + label tipe ("Video YouTube") + tombol **✕** untuk membuang
- Tombol bawah: **Kembali** (abu) · **✨ Proses** (oranye)

---

## 4. Modal "Pilih Mata Pelajaran" (`tambah mapel input.jpeg`)
Muncul di atas langkah 2 (dialog tengah, bukan bottom sheet).
- Judul **"Pilih Mata Pelajaran"** + **✕**
- Baris input: ikon **+** · placeholder/ketikan · tombol **"Buat"** **HIJAU** di kanan
- Garis pemisah, lalu daftar mapel. Item terpilih = **border oranye + teks oranye + ikon ✓**

---

## 5. Setelah tekan Proses (`setelah upload.jpeg`)
**Kembali ke Beranda** (bukan menahan di layar upload). Di Beranda muncul **kartu progres**:
- Spinner + **"AI memproses materi..."** + sub **"Menganalisis konten dengan AI..."** + **persen di kanan** (mis. **60%**)
- Ditempatkan **di atas "Koleksi Kamu"**
- Setelah selesai, materi muncul di koleksi.

---

## Selisih vs implementasi mobile SEKARANG (per 2026-07-12)
`buat-materi.tsx` yang ada masih **satu layar**, dengan chip sumber (File/YouTube/Tulis), dan **tidak** punya:
- bottom sheet pemilih sumber (4 kartu)
- wizard 2 langkah + progres segmen
- sumber **Audio** & **Video** (backend: butuh `GROQ_API_KEY` untuk transkripsi; tanpa itu teks kosong → API menolak)
- **Mode Belajar / Gaya Penulisan / Bahasa** (backend SUDAH mendukung: `modeBelajar`, `gayaPenulisan`, `bahasa` di `POST /materials`)
- kartu progres "AI memproses materi… 60%" di Beranda
- mapel WAJIB (sekarang opsional)
