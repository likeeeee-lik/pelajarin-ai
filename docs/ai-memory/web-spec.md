# Spesifikasi Web — Pelajarin.ai

> Hasil analisis `docs/ss/web/` (peta file di `docs/ss/web/_STRUKTUR.md`). **Sumber kebenaran untuk versi WEB — tak perlu buka screenshot lagi.**
> Versi web = **tema gelap** (ada theme toggle ☀️, mendukung light/dark), aksen oranye. Onboarding & app web LEBIH KAYA dari versi mobile.

Terdiri dari 3 sub-produk web:
1. **Landing/marketing** (`pelajarin.ai`) — publik.
2. **Auth server** (`auth.pelajarin.ai`) — OIDC provider terpisah (kemungkinan Logto).
3. **App/dashboard** (`app.pelajarin.ai` atau path `/app`) — setelah login.

---

## A. AUTH SERVER (`auth.pelajarin.ai`) — OIDC Provider
**Konfirmasi kuat:** ini provider identitas terpisah, bukan halaman app biasa. Bukti: punya **account portal "Your applications"** yang melisting beberapa aplikasi OAuth (`pelajarin.ai web`, `pelajarin.ai affiliate - web`) + halaman consent OIDC. Pola ini khas **Logto / Better Auth / Ory**. Semua halaman bertema gelap + toggle ☀️ (versi mobile sebelumnya putih — provider sama, tema beda).

Halaman:
- **Create account** (`27.1`): logo pelajarin.ai kiri-atas. Judul "Create account". Tombol "Sign up with Google" (logo warna) + "Sign up with Discord". Divider "OR". Field: **Name** (fokus = border oranye, label mengambang), **Email address**, **Password**, **Confirm password**. Tombol oranye "Create account".
- **Sign in** (mobile SS #2, `login-flow.md`): Continue with Google/Discord, Email, Password, tombol "Sign in", "Forgot password?"/"Create account".
- **Authorize access / consent** (`29.1`): "pelajarin.ai web wants to access:" → OpenID, Profile, Email. Tombol oranye "Allow access" + "Deny".
- **Signed in / Account portal** (`27.2`): avatar + nama + email. Section "Your applications" (daftar app OAuth, tiap baris ada ikon buka ↗). Tombol "Sign out".
- **Splash** (`28`): logo + wordmark + spinner oranye di bg gradient.

## B. LANDING (`pelajarin.ai`) — `1`, `2.x`
- **Navbar**: logo "pelajarin.ai" | menu Cara Kerja · Fitur · Harga · FAQ | toggle ☀️ + dropdown bahasa "ID" + tombol oranye "Masuk". (Di landing panjang, navbar jadi pill mengambang.)
- **Hero**: "Ubah 6 Jam Belajar Jadi **1 Jam**" + sub "Transformasi cara belajarmu dengan AI. Upload materi apapun, dapatkan ringkasan, flashcard, dan kuis dalam sekejap." + tombol oranye "Mulai Gratis Sekarang" + **mockup dashboard** (ada demo input URL YouTube).
- Section: "Dipercaya oleh pelajar dari" (logo kampus) · "Kamu nggak sendirian" · "Semua yang Kamu Butuhkan" (Ringkasan Otomatis, Tutor AI 24/7, Smart Flashcards, Kuis Interaktif) · "Mereka Sudah Membuktikannya" (462k+ pengguna, 1.1M+ catatan, 3.5/5 rating, 0.7k+ sekolah) · testimoni · "Support Berbagai Format" (Dokumen/Audio/Video/YouTube) · "Kenapa pelajarin.ai?" (tabel banding) · "Belajar di mana saja" (badge Play/App Store) · FAQ · CTA · "Didukung oleh dewaweb".
- **Footer**: pelajarin.ai + "Platform belajar AI untuk siswa" + sosmed (IG/LinkedIn/Discord) + "Gabung Discord →" · kolom PRODUK (Harga, Institusi, Karier) · LEGAL (Pengembalian Dana, Ketentuan, Privasi) · **CV Triputra Consulting** (AKR Tower LT 16A, Jakarta) + **Dewaventures PTY LTD** (Singapore) + Tel +62 8161 9324 85 + support@pelajarin.ai.

### Pricing page (`2.1`)
- Judul "Pilih Plan yang Tepat". Toggle **Bulanan / 6 Bulan (-20%) / Tahunan (-50%)**.
- 3 kartu:
  - **Free** — "Gratis" — tombol "Mulai Gratis". Termasuk: Catatan terbatas · Flashcards & Quiz unlimited · Chat AI terbatas · Video & audio processing terbatas · Basic support.
  - **Pro** (badge "⭐ Terpopuler", border oranye) — **Rp 30.000/bulan** (Rp 360.000/tahun) — tombol oranye "Upgrade ke Pro". Termasuk: Unlimited catatan · Flashcards & Quiz unlimited · Unlimited chat AI · Unlimited video processing · Unlimited audio processing · Priority support tertinggi.
  - **Institusi** — "Custom" — tombol "Hubungi Sales". Termasuk: Unlimited semua fitur · Custom integration · Dedicated support · Analytics & reporting · Custom jumlah pelajar.
- "Kata mereka:" testimoni carousel (bintang 5) + "Butuh bantuan memilih plan? Kontak kami".

## C. APP / DASHBOARD (setelah login) — `29.2`, `30`–`36`
Layout: **sidebar kiri** (bukan bottom-tab seperti mobile) + konten kanan.

### Sidebar (collapsible, ada tombol ‹ untuk lipat)
Logo "pelajarin.ai" → menu: **Dashboard** (ikon home), **Mata Pelajaran** (folder), **Latihan Soal** (doc-search), **Leaderboard** (trophy), **Streaks** (flame), **Tingkatkan Pro** (roket, tombol oranye menonjol). Bawah: kartu user (avatar + "Likae" + email) → klik = dropdown **Profil / Keluar**.

### Dashboard (`30`)
- "Halo, Likae! 👋" + "Rabu, 8 Juli 2026". Tombol oranye "🚀 Tingkatkan Pro" kanan-atas.
- 4 kartu stat: **Kartu Hari Ini** (0, "Selesai!") · **Streak** (0 hari, "Terbaik: 0") · **Level** (Lvl 1, "0 XP" + progress) · **Peringkat** (#0, "Pengguna Teratas").
- Baris "Buat baru:" tombol → **Unggah File** (↑, PDF/DOCX/PPT), **YouTube** (Link Video), **Audio** (MP3/WAV), **Video** (MP4/MOV), **Tulis Catatan** (mulai dari nol).
- Empty state besar: ikon teropong "Mulai Belajar dengan AI / Upload materi belajarmu dan biarkan AI membuat catatan, flashcard, dan kuis otomatis." + 5 kartu sumber (Unggah File/YouTube/Audio/Video/Tulis Catatan).

### Mata Pelajaran (`31`)
Header "📖 Mata Pelajaran / Kelola daftar mata pelajaran untuk mengorganisir catatan Anda". Kartu "Tambah Mata Pelajaran Baru" (input + tombol "+ Tambah"). Kartu "Statistik" (Total Mata Pelajaran 0, Total Catatan 0). "Daftar Mata Pelajaran" → empty "Belum ada mata pelajaran".

### Latihan Soal (`32`) = Prediksi Soal Ujian
Header "🎯 Prediksi Soal Ujian / Upload soal ujian sebelumnya dan dapatkan prediksi soal berikutnya" + tombol oranye "+ Buat Prediksi". Empty card: "Prediksi Soal dengan AI ... AI akan menganalisis pola" + "+ Buat Prediksi Pertama". (Flow upload 2 langkah spt mobile: judul, mapel, tipe UTS/UAS/Kuis/Latihan → upload file.)

### Leaderboard (`33`)
Header "🏆 Leaderboard / Top 50 pelajar terbaik" + toggle "Total XP"(aktif)/"Streak". **Grid 2 kolom**. Baris: rank (top-3 ikon medali) · avatar · nama + "Level X" · XP (mis "45,150" dg ikon ⚡). Footer "Top 10 dari 50" + paginasi ‹ 1/5 ›.

### Streaks (`29.2`, `34`)
Header "🔥 Streak & Progres / Pantau konsistensi belajarmu". 3 kartu besar: **Streak Saat Ini** (0 hari, "Mulai belajar hari ini!") · **Streak Terpanjang** (0 hari, "Rekor terbaikmu") · **Level** (1, progress 0/174 XP). 4 kartu kecil: **Total XP** (0) · **Flashcard Direview** (0) · **Kuis Lulus** (0) · **Kuis Sempurna** (0). Kartu "💡 Tips Menjaga Streak" (3 bullet: review 1 flashcard/hari, atau selesaikan 1 kuis, streak reset jika tidak ada aktivitas 1 hari).

### Profil Pengguna (`35`, `36`)
Header "Profil Pengguna / Kelola informasi dan preferensi akun Anda".
- 5 kartu stat: **Total Catatan** (biru) · **Flashcard Dibuat** (hijau) · **Kuis Dibuat** (ungu) · **Prediksi Ujian** (merah) · **Total File** (oranye) — semua 0.
- Kartu **Pengaturan Profil**: Nama Lengkap (editable) · Email (disabled, "Email terikat dengan akun dan tidak dapat diubah") · **Bahasa Tampilan** (dropdown ID) — "Mengatur bahasa antarmuka aplikasi" · **Bahasa Generasi** (dropdown "Bahasa Indonesia") — "Mengatur bahasa yang digunakan AI saat membuat konten belajar" · tombol oranye "Simpan".
- Kartu **Langganan** (badge "Gratis"): "Siklus Tagihan: Bulanan". **Kuota Penggunaan**: Catatan Mingguan **0/1** (reset 8 Juli 2026) · Chat AI Mingguan **0/0** · Prediksi Ujian (Demo) **0/1**. Tombol gradient "✨ Upgrade ke Pro".
- **Heatmap aktivitas** ala GitHub: "0 Aktivitas di tahun lalu" (grid kontribusi Jul→Jul, legenda Kurang→Lebih).

---

## Perbedaan penting WEB vs MOBILE
- **Navigasi**: web = sidebar kiri collapsible; mobile = bottom-tab 5 item.
- **Onboarding**: web pakai 5 fase + transisi + radar chart hasil (lihat `onboarding-spec.md`); lebih kaya dari mobile.
- **Profil**: web punya heatmap aktivitas + Bahasa Generasi (mobile hanya Bahasa Tampilan).
- **Auth**: sama-sama OIDC provider `auth.pelajarin.ai`; web pakai tema gelap.
- Terminologi web: "Latihan Soal" (mobile: "Ujian"), "Streaks" (mobile: "Peringkat"+"Streak & XP" terpisah), "Tingkatkan Pro" (mobile: "Upgrade ke Pro").
