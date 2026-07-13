# Spesifikasi Mobile App (dari docs/ss/app, 38 layar) — dibaca 2026-07-10

> **38 layar sudah dibaca & diringkas di berkas ini. JANGAN buka ulang screenshot-nya.**
> Kalau butuh detail layar, baca dari sini. Buka `docs/ss/app` hanya bila ada
> layar yang benar-benar belum tercatat (mis. ss 34/36).

## ⚠️ URUTAN APP — SUDAH FINAL, JANGAN DIUBAH LAGI (dikonfirmasi user 2026-07-12)

**Daftar → Masuk → Splash → Wizard → Dashboard**

**Ini SENGAJA BERBEDA dari penomoran folder `docs/ss/app`** (yang menaruh wizard di
ss 1–20, artinya sebelum auth) dan **berbeda dari web** (web = wizard dulu baru
daftar). User ditanya langsung dan **memilih urutan mobile ini**. Jangan "perbaiki"
agar cocok dengan nomor folder — itu justru salah.

| | Web | Mobile |
|---|---|---|
| Urutan | Wizard → Daftar → App | Daftar → Masuk → Splash → Wizard → App |

## ALUR AUTH MOBILE — DIPUTUSKAN USER (2026-07-12, saat tes di HP)
**Urutan wajib: Daftar → (balik ke) Masuk → Splash logo → Wizard → Dashboard.**
- Registrasi **sengaja TIDAK auto-login**: API tetap mengembalikan token, tapi `daftar.tsx` memanggil `hapusToken()` lalu `router.replace("/masuk", {baru:"1", email})`. Layar Masuk menampilkan banner hijau "Akun berhasil dibuat" + email terisi otomatis.
- Login sukses → `/splash` (bukan langsung dashboard). `splash.tsx`: logo SVG + animasi, tampil **minimal 1400ms**, sambil ambil `/me` → arahkan ke `/onboarding` (bila `onboardingCompleted=false`) atau `/beranda`.
- Logo: `src/components/logo.tsx` pakai **react-native-svg**, path SAMA dengan `apps/web/src/components/logo.tsx`.
- Password: komponen **`FieldPassword`** di `components/ui.tsx` — ada ikon mata (eye/eye-off) untuk lihat/sembunyikan. Dipakai di masuk & daftar.

## STATUS BUILD (per 2026-07-12, commit 27b7a9c) — SEDANG DIUJI DI HP
Layar (17): `masuk` `daftar` `splash` `onboarding` · 5 tab (`beranda` `mata-pelajaran` `ujian` `peringkat` `profil`) · `buat-materi` `catatan/[id]` `buat-prediksi` `prediksi/[id]` `pricing` `index` + 2 `_layout`.
- `catatan/[id]` = workspace 5 sub-tab (Bab/MindMap/Flashcard/Kuis/Chat), semua lewat endpoint AI nyata (Claude). Kuis bisa diulang dari DB tanpa panggil AI + skor tersimpan.
- `onboarding` = wizard 20 pertanyaan, 6 jenis input (single/scale/dual/semantic/capsule/curve) + layar hasil 8 skor radar. **Pertanyaan DISALIN** ke `src/lib/onboarding/` (web pakai ikon Lucide yg tak jalan di RN) → **TODO(shared): satukan ke packages/shared; sampai itu, UBAH DI KEDUA TEMPAT.**
- Markdown isi bab: `react-native-markdown-display` (sudah, tidak lagi teks polos).
- Token di expo-secure-store; `http.ts` refresh senyap saat 401. expo-router grup + typed routes.
- Paket kunci: `@react-native-community/slider`, `react-native-svg` (logo), `expo-document-picker`, `@expo/vector-icons`.

**PERINGKAT SUDAH NYATA (2026-07-12)**: endpoint baru `GET /leaderboard?sort=xp|streak` (LeaderboardModule) — user diurutkan dari `Profile.xp`/`Streak.current` yang memang ada di DB, seri dipecah oleh nama agar stabil. Balasan: `entries` (rank, nama, avatar, level, xp, streak, `aku`), `akuRank`, `total`. Layar `(tabs)/peringkat` menampilkannya (toggle XP/Streak, piala 3 besar, baris sendiri disorot). **Datanya asli — XP semua 0 karena belum ada yang MENAIKKAN XP; begitu gamifikasi nyala, layar ini langsung hidup tanpa diubah.** Verified: 7 user, akuRank benar, tanpa token 401.

**BELUM ADA**: Google OAuth (dibuang bersama Logto — harus dibangun sendiri: endpoint `/auth/google` + expo-auth-session, kemungkinan butuh development build, bukan Expo Go) · **sistem yang menaikkan XP/streak** (tabel & endpoint sudah siap, tinggal event-nya) · pembayaran · verifikasi email di mobile (cuma banner "buka web") · ikon search Beranda masih hiasan.

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
