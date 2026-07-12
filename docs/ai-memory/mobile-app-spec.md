# Spesifikasi Mobile App (dari docs/ss/app, 38 layar) — dibaca 2026-07-10

## ALUR AUTH MOBILE — DIPUTUSKAN USER (2026-07-12, saat tes di HP)
**Urutan wajib: Daftar → (balik ke) Masuk → Splash logo → Wizard → Dashboard.**
- Registrasi **sengaja TIDAK auto-login**: API tetap mengembalikan token, tapi `daftar.tsx` memanggil `hapusToken()` lalu `router.replace("/masuk", {baru:"1", email})`. Layar Masuk menampilkan banner hijau "Akun berhasil dibuat" + email terisi otomatis.
- Login sukses → `/splash` (bukan langsung dashboard). `splash.tsx`: logo SVG + animasi, tampil **minimal 1400ms**, sambil ambil `/me` → arahkan ke `/onboarding` (bila `onboardingCompleted=false`) atau `/beranda`.
- Logo: `src/components/logo.tsx` pakai **react-native-svg**, path SAMA dengan `apps/web/src/components/logo.tsx`.
- Password: komponen **`FieldPassword`** di `components/ui.tsx` — ada ikon mata (eye/eye-off) untuk lihat/sembunyikan. Dipakai di masuk & daftar.

## STATUS BUILD (2026-07-11): fase 1–5 SELESAI (commit 20ebe9e)
Semua 5 tab + alur dibangun & terverifikasi (tsc bersih, bundle Metro 3,19MB, BELUM diuji perangkat):
- `(tabs)/beranda` (sapaan, chip streak/lvl/xp, fokus card, 4 kartu statistik, Koleksi + filter, FAB)
- `(tabs)/mata-pelajaran` (tambah/hapus + statistik) · `(tabs)/ujian` (list prediksi)
- `buat-prediksi` (2 langkah, picker mapel + expo-document-picker) · `prediksi/[id]` (opsi interaktif + kunci/pembahasan)
- `buat-materi` (file/youtube/note) · `catatan/[id]` (workspace 5 sub-tab: Bab/MindMap/Flashcard/Kuis/Chat, semua lewat endpoint AI nyata, kuis replay dari DB + simpan skor)
- `(tabs)/profil` (edit nama PATCH /me, kuota, keluar) · `pricing` (placeholder, bayar belum ada) · `(tabs)/peringkat` (placeholder, gamifikasi belum ada)
Token di expo-secure-store; http.ts refresh senyap saat 401. expo-router grup + typed routes.
BELUM: onboarding wizard di mobile (logika ada di API), Google OAuth, markdown render (kontenMd tampil teks polos), gamifikasi nyata, pembayaran.

## Spesifikasi asli (dari 38 layar)

Mobile = fitur SAMA dengan web, disusun dalam **5 tab bawah**:
**Beranda · Mata Pelajaran · Ujian · Peringkat · Profil**

## Onboarding (ss 1–20): wizard 20 pertanyaan
Sama isi dgn web onboarding. Progress "N/20" + "Lewati" (skip). Tombol oranye "Lanjut"/"Selesai".
Jenis: pilih-satu (profil SMP/SMA/S1/Pascasarjana/Profesional; target 6 bln; persona AI Tutor Militer/Guru BK/Teman Sebaya/Profesor; output bahasa), slider tunggal (ambisi 1–10, stres %), dual-slider 50/50 (teori↔praktek, kecepatan↔ketelitian, lupa detail↔susah konsep), multi-slider (Golden Hours: Pagi/Siang/Sore/Malam), skenario (reaksi soal panjang, reaksi nilai jelek, presentasi, hook "hemat 2 jam").

## Auth (ss 21–24)
- 21 Welcome: logo + "Buat akun baru" + **Daftar dengan Google** / **Daftar dengan Email** / "Sudah punya akun? Masuk".
- 22–23: **Logto hosted sign-in + consent** (in-app browser). ⚠️ USANG — kita sudah pindah ke **auth lokal email+password**. Mobile pakai layar Masuk/Daftar native (sudah dibuat), Google belum ada.
- 24: splash logo buku.

## Beranda (ss 25)
Header: chip **streak / Level / XP** + ikon search. "Selamat Pagi, {nama}".
Kartu **"FOKUS AI HARI INI"**: ajakan upload + ring XP (0%) + "ke level berikutnya 0/174 XP".
Banner **"Buka mode belajar tanpa batas"** (→ upgrade).
4 kartu statistik: **Kartu Review · Streak · Total XP · Skor Quiz**.
**"Koleksi Kamu"**: search "Cari catatan..." + chip filter **Semua/Dokumen/YouTube/Audio/Video** + daftar materi (empty: "Mulai dari satu materi"). **FAB +** = buat materi.

## Mata Pelajaran (ss 26,30)
Tombol **Tambah** (hijau), Statistik (total mapel / total catatan / tanpa kategori), Daftar. Modal Tambah: input "Nama mata pelajaran" + Batal/Tambah.

## Ujian (= Prediksi Soal, ss 27,31,32,33)
"Prediksi Soal Ujian" + **Buat Prediksi**. Alur 2 langkah:
- Langkah 1/2 **Upload Soal Ujian**: Judul Koleksi, Mata Pelajaran (picker modal "Pilih Mata Pelajaran" + "Buat baru..."), Tipe Ujian (UTS/UAS/Kuis/Latihan), "Pengguna gratis: 1 prediksi ujian seumur hidup", Lanjutkan.
- Langkah 2/2: Upload File Soal (PDF/DOCX/PPT/TXT/PNG/JPG), Ringkasan, Kembali/Proses.

## Peringkat / Leaderboard (ss 28)
"Top 50 pelajar paling konsisten minggu ini". Toggle **Total XP / Streak**. List rank+avatar+level+XP, paginasi 1/5. ⚠️ Butuh gamifikasi nyata (masih mock).

## Profil (ss 29,37)
Avatar + nama + email + badge **Free Plan**. Pengaturan Profil (nama/email-terkunci/Bahasa Tampilan). **Langganan**: Anggota sejak, Kuota (Catatan mingguan 0/1, Chat AI mingguan 0/0), **Upgrade ke Pro**. Lainnya: Streak & XP, Pricing. **Keluar** (modal konfirmasi "Keluar dari akun?"). Version.

## Pricing / Upgrade (ss 35)
"PREMIUM · Tanya AI Sepuasnya", carousel fitur. **Paket**: Tahunan Rp30.000/bln (PALING HEMAT, total Rp360k/th, hemat 50%), 6 Bulan Rp48.000/bln (hemat 20%), Bulanan Rp60.000/bln. **Upgrade ke Pro** + "Punya kode referral?". ⚠️ Pembayaran belum dibangun.

## Catatan penting selisih vs backend saat ini
- Auth: screenshot pakai Logto; implementasi = lokal. Google OAuth belum ada.
- Gamifikasi (XP/Level/Streak/Peringkat/Skor Quiz/Kartu Review) = MOCK di backend. Beranda & Peringkat butuh ini nyata.
- Pembayaran/paket Pro = belum ada (butuh Midtrans/Xendit + gating Pro nyata).
- Yang SUDAH nyata & siap dipakai mobile: auth lokal, /me /stats /materials /subjects, prediksi soal, note workspace (chapter/mindmap/flashcard/kuis/chat), verifikasi email, refresh token.
- Note workspace detail (buka materi → tab catatan/mindmap/flashcard/kuis/chat) ada di web; layar mobile-nya belum terlihat di ss (mungkin 34/36 belum dibaca) — desain mengikuti web.
