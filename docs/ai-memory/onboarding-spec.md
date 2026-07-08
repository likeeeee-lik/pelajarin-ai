# Spesifikasi Onboarding — Pelajarin.ai (web, 20 langkah / 5 fase)

> Dari `docs/ss/web/` (3–26). Onboarding personalisasi setelah daftar. **Tak perlu buka screenshot lagi.**
> Header tiap langkah: progress bar bertahap (5 segmen = 5 fase) + "n/20" (kiri) + nama fase (kanan, oranye). Tombol "Lanjut" (redup s/d dijawab), terakhir "Selesai". Tombol back ‹ bulat kiri-bawah mulai langkah 2.
> Catatan: ada varian "n/19" — jumlah langkah bisa **kondisional** tergantung jawaban (mis. non-mahasiswa lewati IPK).

## Struktur 5 Fase (ada layar transisi animasi antar fase)
1. **Identitas** (ikon orang) — langkah 1–4
2. **Pemetaan Kognitif** (ikon jaring biru, "Cara otakmu bekerja") — langkah 5–9
3. **Audit Psikologis** (ikon "?" ungu, "Mindset & mental kamu") — langkah 9/10–14
4. **Preferensi AI** (ikon "+" hijau, "Sesuaikan AI-mu") — langkah 15–19
5. **The Hook** (ikon bintang, "Satu pertanyaan terakhir") — langkah 20

## Daftar Pertanyaan
### Fase 1 — Identitas
- **1. "Siapa yang sedang kita bantu hari ini?"** (single-select ikon): SMP, SMA/SMK, Mahasiswa S1, Pascasarjana, Profesional.
- **2. "Apa target utamamu dalam 6 bulan ke depan?"** (single-select ikon): Lulus Ujian/SNBT, Kejar IPK Cumlaude, Berjuang Lulus Skripsi/TA, Upskilling/Belajar Hal Baru.
- **3. "Seberapa ambisius kamu?"** (slider 1–10, angka besar + emoji 💪 + label "Cukup serius"): "1 = santai aja, 10 = harus jadi yang terbaik".
- **4. "Nilai rata-rata/IPK saat ini vs target?"** (dua slider): IPK Saat Ini (3.0) & Target IPK (3.5). "Geser slider untuk menyesuaikan".

### Fase 2 — Pemetaan Kognitif
- **5. "Golden Hours — kapan energi kamu paling tinggi?"** (kurva interaktif): drag titik untuk gambar kurva energi 6:00→0:00 (sumbu Y 0-100). Ikon matahari/bulan di atas.
- **6. "Cara tercepat kamu paham materi yang rumit?"** (single-select ikon): Visual & Diagram, Mendengarkan, Membaca, Latihan Soal.
- **7. "Posisi gaya belajar kamu"** (slider dua kutub + label live "Seimbang"): "Teori dulu baru praktek" ↔ "Langsung praktek".
- **8. "Kelemahan memori kamu"** (slider dua kutub): "Lupa detail & fakta" ↔ "Susah paham konsep besar". Sub: "Mana yang lebih sering kamu alami?".
- **9. "Tipe kerja kamu"** (slider dua kutub): "Kecepatan (Speed)" ↔ "Ketelitian (Akurasi)". Sub: "Kamu lebih prioritaskan yang mana?".

### Fase 3 — Audit Psikologis
- **(9/19 varian) "Musuh terbesar kamu saat harus fokus?"** (single-select ikon): Doomscrolling HP, Terlalu Banyak Berpikir, Ngantuk, Bingung mau mulai dari mana.
- **11. "Reaksi kamu pas lihat soal ujian yang panjang banget?"** (single-select): Skip cari yang gampang dulu, Panik blank seketika, Baca pelan-pelan dari awal, Nebak aja yang penting keisi.
- **12. "Level stres akademik kamu sekarang?"** (slider vertikal "kapsul" 0–100, warna & emoji berubah): 0 = 😌 "Santai" (hijau), ~31 = 😐 "Agak Tegang", 100 = 🤯 "Mau Pecah" (merah).
- **13. "Apa dorongan/motivasi terbesar kamu?"** (single-select): Bikin orang tua bangga, Takut gagal/nggak lulus, Pembuktian diri, Ambisi karir/masa depan.
- **14. "Reaksi kamu pas dapat nilai jelek?"** (single-select ikon): Sedih & down berhari-hari, Menyalahkan dosen/soal/sistem, Evaluasi & perbaiki strategi, Cuek yang penting lulus.

### Fase 4 — Preferensi AI
- **15. "Berapa lama kamu bisa fokus tanpa pegang HP?"** (single-select): < 15 menit, Sekitar 30 menit, Sekitar 1 jam, > 2 jam.
- **16. "Kamu mau AI bersikap seperti apa?"** (single-select judul+subjudul): Tutor Militer (tegas, to the point), Guru BK (supportif, sabar, empati), Teman Sebaya (santai, gaul), Profesor (akademis, detail, referensi). *(= persona chat)*
- **17. "Format jawaban AI yang paling kamu benci?"** (single-select): Terlalu panjang & bertele-tele, Terlalu singkat nggak jelas, Terlalu formal & kaku, Kebanyakan bullet point kurang penjelasan.
- **18. "Besok kamu presentasi. Mau AI bantu gimana?"** (single-select): Rangkumin materi kasih poin penting, Simulasi tanya-jawab, Buatkan outline slide, Tenangkan aku dulu kasih tips anti-grogi.
- **19. "Mau output bahasanya seperti apa?"** (single-select ikon): Bahasa Indonesia Baku, Bahasa Indonesia Santai, Bahasa Inggris, Campur (Indo-English).

### Fase 5 — The Hook
- **20. "Kalau AI bisa hemat 2 jam belajar kamu setiap hari, mau dipakai buat apa?"** (single-select ikon): Tidur/istirahat, Main game, Nongkrong sama temen, Belajar hal lain. Tombol "Selesai".

## Hasil / Penutup
- **Loading "Menganalisis profil kognitifmu…"** (`25.1`, `25.2`): **radar/spider chart** 8 sumbu — **Ambisi, Energi, Teori/Pra, Memori, Fokus, Stres, Kecepatan, Motivasi** — terisi animasi. Teks proses ("Mengukur level ambisi…", "Memetakan sumber motivasi…").
- **Hasil "Teman Belajar-mu sudah dikustomisasi!"** (`26`): "Berdasarkan 21 jawaban kamu…". Daftar benefit (Diagram & mind-map otomatis, Push notification jam 18:00 golden hour, Unlimited AI chat, Unlimited notes, Priority processing). Harga **Rp 60.000/bulan** + tombol "⚡ Mulai Pro Sekarang" + "Nanti aja, pakai gratisan dulu".

## Implikasi data (untuk DB/AI)
Semua jawaban → tersimpan sebagai profil personalisasi (key-value) dan diringkas jadi **8 skor kognitif** (untuk radar) + **persona AI** + **preferензi output** (bahasa, panjang, gaya). Dipakai untuk menyusun **system prompt** AI per-user & jadwal notifikasi (golden hour). Golden Hours curve → data time-series preferensi jam belajar.
