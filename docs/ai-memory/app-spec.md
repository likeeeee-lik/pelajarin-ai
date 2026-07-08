# Spesifikasi App — Pelajarin.ai

> Hasil analisis lengkap screenshot `docs/ss/`. **Ini sumber kebenaran UI & flow — tidak perlu buka screenshot lagi.**
> Nama produk: **pelajarin.ai**. Bahasa: Indonesia (ada opsi EN). Tema: gelap. Aksen: oranye.
> Logo: buku terbuka dengan wajah senyum + bookmark berbentuk seperti pin lokasi.
> Perusahaan: **CV Triputra Consulting** (Jakarta). Hosting didukung **dewaweb**. Email: support@pelajarin.ai.

---

## Konsep Inti
Upload materi (file / audio / video / YouTube) → AI ubah jadi **catatan, flashcard, kuis, prediksi soal ujian**. Gamifikasi (XP, level, streak, leaderboard). Freemium (Free vs Pro). Ada **chat tutor AI** dengan persona. Tagline: "Ubah 6 Jam Belajar Jadi 1 Jam".

---

## 1. AUTH (host: `auth.pelajarin.ai`)
- **Layar Daftar (dark)**: logo + "pelajarin.ai", judul "Buat akun baru", sub "Mulai belajar dengan AI di Pelajarin.ai". Tombol gelap "Daftar dengan Google" (ikon amplop) → divider "ATAU" → tombol oranye "Daftar dengan Email" (ikon sparkle) → link oranye "‹ Sudah punya akun? Masuk".
- **Sign in (host web, bg putih)**: "Continue with Google", "Continue with Discord", "OR", field Email (`name@example.com`) + Password, tombol hitam "Sign in", "Forgot password?" / "Create account", footer "Signing in to pelajarin.ai mobile".
- **Authorize access (OIDC consent, bg putih)**: "pelajarin.ai mobile wants to access:" → OpenID (Verify your identity), Profile (name & profile picture), Email. Tombol hitam "Allow access" / teks "Deny".
- **Pola teknis**: mobile buka browser eksternal ke auth server (OAuth2/OIDC + consent). Provider: Google, Discord, Email/Password.

## 2. SPLASH
- Splash 1: bg navy gelap, hanya logo buku-senyum putih di tengah.
- Splash 2: wordmark "pelajarin.ai" + spinner oranye; background lingkaran glow lembut (maroon di kiri, ungu di kanan).

## 3. ONBOARDING WIZARD (20 langkah)
- Header: chevron back (kiri) · "n / 20" (tengah) · "Lewati" (kanan, abu). Progress bar oranye di bawah header.
- Judul pertanyaan: putih bold besar; subjudul abu. Tombol bawah oranye "Lanjut ›" (redup saat belum pilih), langkah terakhir "Selesai ✓".
- **Tipe input yang dipakai:**
  - Kartu single-select **dengan ikon** (selected = border+teks oranye + centang).
  - Kartu single-select **tanpa ikon**.
  - Kartu single-select **judul + subjudul**.
  - **Dual slider** (dua slider vertikal).
  - **Semantic differential slider** (kiri ↔ kanan, tampil %).
- **Pertanyaan yang terlihat:**
  - Q1: "Siapa yang sedang kita bantu hari ini?" → SMP, SMA/SMK, Mahasiswa S1, Pascasarjana, Profesional (ikon).
  - Q2: "Apa target utamamu dalam 6 bulan ke depan?" → Lulus Ujian/SNBT, Kejar IPK Cumlaude, Berjuang Lulus Skripsi/TA, Upskilling/Belajar Hal Baru.
  - Q4: "Nilai rata-rata/IPK saat ini vs target?" → slider IPK saat ini (3.0) + Target IPK (3.5).
  - Q8: "Kelemahan memori kamu" → slider "Lupa detail & fakta" ↔ "Susah paham konsep besar".
  - Q11: "Reaksi kamu pas lihat soal ujian yang panjang banget?" → Skip cari gampang / Panik blank / Baca pelan dari awal / Nebak aja.
  - Q16: "Kamu mau AI bersikap seperti apa?" → Tutor Militer (tegas), Guru BK (supportif), Teman Sebaya (santai), Profesor (akademis). *(dipakai sebagai persona chat)*
  - Q20: "Kalau AI bisa hemat 2 jam belajar kamu setiap hari, mau dipakai buat apa?" → Tidur, Main game, Nongkrong sama temen, Belajar hal lain. *(hook penutup)*
- Jawaban dipakai untuk personalisasi gaya bantuan AI.

## 4. BERANDA (tab: Beranda)
- Baris atas pills: "🔥 0 hari" · "⭐ Lvl 1" · "0 XP" (oranye). Kanan: ikon search (lingkaran oranye).
- "MINGGU, 5 JULI" (abu kecil) → "Selamat Malam, Likae" (bold besar). Avatar kartun (panda/hantu) kanan atas.
- **Kartu "FOKUS AI HARI INI"** (tint oranye): "Satu sesi kecil, progres terasa." + "Upload file, audio, video, atau YouTube. Materi akan dirapikan jadi catatan belajar." + ring XP "0%" + progress "ke level berikutnya 0 / 174 XP".
- **Kartu "Buka mode belajar tanpa batas"** (border kuning): "Chat AI, chapter, dan prediksi ujian lebih lega." + panah ›.
- **4 kartu statistik**: "0 Kartu Review / Aman hari ini" (ikon oranye) · "0 hari Streak" (api merah) · "0 Total XP" (bintang biru) · "0% Skor Quiz" (piala emas).
- **"📖 Koleksi Kamu / 0 catatan"** → search "Cari catatan..." → chip filter: **Semua** (aktif oranye), Dokumen, YouTube, Audio, Video.
- **Empty state** (border oranye): "Mulai dari satu materi / Upload file, audio, video, atau YouTube. Materi akan dirapikan jadi catatan belajar."
- **FAB oranye "+"** kanan bawah.
- **Search page**: input "Cari catatan, ujian..." + X. Empty: "Temukan materi dengan cepat / Cari catatan, subjek, prediksi ujian, atau materi yang pernah dibuat AI."

### Bottom sheet FAB "Buat catatan baru"
"Pilih bahan yang mau kamu ubah jadi catatan":
- **Upload File** — PDF, Word, PPT (ikon biru)
- **YouTube** — Tempel link video (ikon merah)
- **Audio** — MP3, WAV, rekaman (ikon hijau)
- **Video** — MP4, MOV (ikon ungu)

## 5. MATA PELAJARAN (tab)
- Header "PELAJARIN.AI" → "Mata Pelajaran" → "Kelola daftar mata pelajaran untuk mengorganisir catatan kamu" + ikon folder oranye.
- Kartu "Tambah Mata Pelajaran" + tombol **HIJAU** "+ Tambah".
- Kartu "Statistik": Total mata pelajaran (0, oranye) · Total catatan (0) · Tanpa kategori (0).
- "Daftar Mata Pelajaran" → empty (kartu dashed): "Belum ada mata pelajaran / Tambahkan di form di atas untuk mulai mengorganisir catatan."
- **Form tambah** (kartu inline): "Tambah Mata Pelajaran / Nama mata pelajaran" input (border oranye) + "Batal" + tombol hijau "Tambah".

## 6. UJIAN — AI PREDIKSI (tab)
- Header "AI PREDIKSI" → "Prediksi Soal Ujian" → "Upload soal ujian sebelumnya untuk dapat prediksi soal berikutnya" + ikon sparkle.
- Tombol oranye "+ Buat Prediksi".
- Empty (border oranye): "Prediksi soal dengan AI / Upload soal-soal ujian sebelumnya. AI akan menganalisis pola untuk memprediksi soal ujian berikutnya." + "+ Buat prediksi pertama".

### Flow "Upload Soal Ujian" (2 langkah)
- **Langkah 1/2**: X · "Upload Soal Ujian" · "Langkah 1 / 2". Field "Judul Koleksi" (ph "Contoh: UTS Kalkulus 2024"). "Mata Pelajaran" dropdown "Pilih mata pelajaran..." (ikon ↕). "Tipe Ujian" grid 2×2: **UTS** (Ujian Tengah Semester, default terpilih), **UAS** (Ujian Akhir Semester), **Kuis** (Kuis atau Ulangan), **Latihan** (Soal Latihan). Note "ⓘ Pengguna gratis: 1 prediksi ujian seumur hidup". Tombol oranye "Lanjutkan".
- **Modal pilih mapel**: "Pilih Mata Pelajaran" · input "+ Buat baru..." · empty "Belum ada mata pelajaran. Buat baru di atas."
- **Langkah 2/2**: "☁ Upload File Soal / Upload satu atau beberapa file soal ujian sebelumnya. AI akan menganalisis pola dan membuat prediksi soal." Dropzone dashed + klip: "Tap untuk memilih file / **PDF, DOCX, PPT, TXT, PNG, JPG**". Kartu "Ringkasan: Judul / Tipe / File: n file". Tombol "Kembali" + oranye "✨ Proses".

## 7. PERINGKAT — LEADERBOARD (tab)
- Header "KOMUNITAS" → "Leaderboard" → "Top 50 pelajar paling konsisten minggu ini" + piala.
- Toggle "**Total XP**" (aktif oranye) / "Streak".
- Baris: rank (top-3 piala emas/perak/perunggu, sisanya angka) · avatar · nama + "Level X" · "XXk+ XP" kanan.
- Paginasi "1 / 5" dengan ‹ ›.

## 8. PROFIL (tab)
- **Kartu header** (gradient oranye): avatar · "Likae" · "sefinalika@gmail.com" · badge "Free Plan".
- **"Pengaturan Profil / Perbarui informasi akun kamu"**: Nama lengkap (editable) · Email (disabled, "Email terikat dengan akun dan tidak dapat diubah") · Bahasa Tampilan dropdown "🇮🇩 Bahasa Indonesia" ("Mengatur bahasa tampilan aplikasi").
- **"Langganan / Status & penggunaan"**: "Anggota 5 Juli 2026". Kuota: **Catatan mingguan 0/1**, **Chat AI mingguan 0/0**. Tombol oranye "✨ Upgrade ke Pro".
- **"Lainnya"**: "Streak & XP ›", "Pricing ›".
- Tombol **merah "Keluar"**. Footer "Version 1.1.4".

## 9. PRICING / UPGRADE (modal)
- X · badge "🏆 PREMIUM". Carousel fitur (ikon) + "Tanya AI Sepuasnya / Dapatkan penjelasan konsep sulit langsung dari AI Mentor 24/7." + dots.
- "PILIH PAKET BELAJARMU":
  - **Tahunan** — badge "PALING HEMAT" — **Rp30.000/bln** (Total Rp360.000/tahun) — "Hemat 50%" — *default terpilih*.
  - **6 Bulan** — Rp48.000/bln (Total Rp288.000/6 bln) — "Hemat 20%".
  - **Bulanan** — Rp60.000/bln.
- Tombol oranye "Upgrade ke Pro". Link "Punya kode referral?" (oranye). Footer "Bantuan • Syarat & Ketentuan".

## 10. STREAK & XP (dari Profil > Lainnya)
- X · "Streak & XP / Pantau ritme belajar dan capaian kamu".
- Kartu besar (border oranye): ikon api · "0 / Hari Berturut-turut / Rekor: 0 hari".
- Kartu "Level 1 / 0 XP" + progress "0 / 174 XP ke level berikutnya".
- 4 kartu stat: Total XP (0) · Ranking (#67k+) · Top (60%) · Kartu direview (0).
- "Pencapaian": Total waktu belajar (0 menit) · Kartu direview (0) · Kuis lulus (0) · Kuis sempurna (0).

## 11. LANDING WEB (`pelajarin.ai`)
- Nav: pelajarin.ai | Cara Kerja · Fitur · Harga · FAQ | 🔔 + tombol oranye "Masuk".
- Hero: "Ubah 6 Jam Belajar Jadi **1 Jam**" + "Transformasi cara belajarmu dengan AI. Upload materi apapun, dapatkan ringkasan, flashcard, dan kuis dalam sekejap." + tombol oranye "Mulai Gratis Sekarang" + mockup demo flashcard.
- "DIPERCAYA OLEH PELAJAR DARI" (logo kampus: ITB, UGM, dll).
- "Kamu nggak sendirian" (pain points relatable).
- "FITUR UNGGULAN / Semua yang Kamu Butuhkan": **Ringkasan Otomatis, Tutor AI 24/7, Smart Flashcards, Kuis Interaktif**.
- "Mereka Sudah Membuktikannya": 350k+ pengguna aktif · 0.8M+ catatan dibuat · 2.6/5 rating · 0.5k+ sekolah & kampus. + testimoni.
- "Support Berbagai Format": Dokumen, Audio, Video, YouTube.
- "Kenapa pelajarin.ai?" (tabel perbandingan vs alternatif).
- "Belajar di mana saja, kapan saja" + badge Google Play & App Store + mockup HP.
- "Pertanyaan Umum" (FAQ accordion).
- CTA "Siap Revolusi Cara Belajarmu?". "Didukung oleh dewaweb".
- Footer: nav + PRODUK + LEGAL + alamat CV Triputra Consulting (Jakarta) + support@pelajarin.ai.

---

## Navigasi Bottom Tab (5)
**Beranda · Mata Pelajaran · Ujian · Peringkat · Profil**

## Domain Data (dari UI)
Level & XP (0/174 XP ke level berikutnya), Streak (hari berturut + rekor), Kartu Review (spaced repetition flashcard), Skor Quiz, Kuota mingguan (Catatan, Chat AI), Prediksi ujian (Free = 1 seumur hidup), Ranking global, Persona AI, Bahasa (ID/EN).
