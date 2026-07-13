# Spesifikasi Mobile App (dari docs/ss/app, 38 layar) — dibaca 2026-07-10

> **38 layar sudah dibaca & diringkas di berkas ini. JANGAN buka ulang screenshot-nya.**
> Kalau butuh detail layar, baca dari sini. Buka `docs/ss/app` hanya bila ada
> layar yang benar-benar belum tercatat (mis. ss 34/36).

## ⚠️ URUTAN APP MOBILE — FINAL, JANGAN DIUBAH LAGI (user menegaskan 2× pada 2026-07-12)

**Buka app → Welcome (Daftar/Masuk) → Daftar → Masuk → Splash → Wizard → Dashboard**

**AUTH DULU, WIZARD BELAKANGAN.**

### ⚠️ JEBAKAN: penomoran folder `docs/ss/app` MENYESATKAN
Nomor berkas menaruh wizard di **ss 1–20** dan auth di **ss 21–24**, seolah wizard duluan.
**Itu salah.** Lihat **stempel waktu di dalam screenshot**: auth **18.55–18.56**, wizard
**18.57–19.01** → auth direkam LEBIH DULU. Nomor berkas ≠ urutan alur.
Saya pernah tertipu ini dan membangun funnel wizard-duluan (commit 7897468) — user langsung
mengoreksi. **Jangan ulangi. Auth dulu.**

### Beda dengan WEB (sengaja)
| | Urutan |
|---|---|
| **Web** | Wizard (anonim) → Daftar → App |
| **Mobile** | Welcome → Daftar → Masuk → Splash → Wizard → App |

### Implementasi
- `index.tsx`: ada sesi → `/beranda`; belum → `/welcome`.
- `welcome.tsx` (ss 21): logo + "Daftar dengan Email" + "Sudah punya akun? Masuk".
  Tombol **Google TIDAK ditampilkan** — OAuth belum ada; tombol mati lebih buruk daripada tidak ada.
- `daftar.tsx`: registrasi **sengaja TIDAK auto-login** → `hapusToken()` → `/masuk` (banner hijau
  "Akun berhasil dibuat" + email terisi otomatis).
- `masuk.tsx`: login sukses → `/splash`.
- `splash.tsx` = **satu-satunya titik keputusan** setelah login: logo (min 1400ms) + ambil `/me` →
  `onboardingCompleted=false` ? `/onboarding` : `/beranda`.
- `onboarding.tsx`: SELALU dalam keadaan login. Selesai/Lewati → `PATCH /me {onboardingCompleted:true}` → `/beranda`.
- **JANGAN taruh gate onboarding di `(tabs)/_layout.tsx`** — dua tempat yang memutuskan = loop bolak-balik (pernah terjadi).

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

## WORKSPACE MOBILE = SETARA WEB (2026-07-12)
`catatan/[id]` kini **6 sub-tab** (sebelumnya 5), sama dengan web:
**Bab · Mind Map · Flashcard · Kuis · Dokumen · Chat**
- **Dokumen** (baru): daftar file asli; ketuk → `GET /materials/:id/files/:fileId/url` (signed URL Supabase) → dibuka lewat `Linking.openURL`. Empty state jujur bila materi dari teks/YouTube.
- **Bagikan** (baru): `POST /materials/:id/share {enable:true}` → `shareSlug` → dibagikan lewat `Share` bawaan RN sebagai `{EXPO_PUBLIC_WEB_URL}/publik/{slug}`. **Butuh env `EXPO_PUBLIC_WEB_URL`** (IP LAN web, bukan localhost).
- **Hapus materi** (baru): `DELETE /materials/:id` + konfirmasi Alert → balik ke Beranda.
- **Fokus Timer** (baru, `components/fokus-timer.tsx`): Pomodoro 25:00 play/pause/reset di header workspace — padanan "Fokus 25:00" di sidebar web.
- **Ekspor PDF SENGAJA TIDAK dibuat di mobile** — web sudah punya; padanan mobile = Bagikan (tautan publik).
- Picker mapel: `components/pilih-mapel.tsx` **dipakai bersama** buat-materi & buat-prediksi (cari + "Buat X", cerminan SubjectCombobox web). Nama persis sama → tombol Buat disembunyikan (cegah duplikat).

**PERINGKAT SUDAH NYATA (2026-07-12)**: endpoint baru `GET /leaderboard?sort=xp|streak` (LeaderboardModule) — user diurutkan dari `Profile.xp`/`Streak.current` yang memang ada di DB, seri dipecah oleh nama agar stabil. Balasan: `entries` (rank, nama, avatar, level, xp, streak, `aku`), `akuRank`, `total`. Layar `(tabs)/peringkat` menampilkannya (toggle XP/Streak, piala 3 besar, baris sendiri disorot). **Datanya asli — XP semua 0 karena belum ada yang MENAIKKAN XP; begitu gamifikasi nyala, layar ini langsung hidup tanpa diubah.** Verified: 7 user, akuRank benar, tanpa token 401.

**BELUM ADA**: Google OAuth (dibuang bersama Logto — harus dibangun sendiri: endpoint `/auth/google` + expo-auth-session, kemungkinan butuh development build, bukan Expo Go) · **sistem yang menaikkan XP/streak** (tabel & endpoint sudah siap, tinggal event-nya) · pembayaran · verifikasi email di mobile (cuma banner "buka web") 

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

## NAVBAR MELAYANG (2026-07-12)
Bottom tab bar **mengambang**, bukan menempel tepi (sesuai ss 26–28):
`position:absolute`, `left/right:14`, `bottom = max(insets.bottom,10)+6`, `height:66`,
**bentuk PIL**: `height:58`, `borderRadius: 58/2 = 29` (radius = setengah tinggi → ujung bulat penuh), `left/right:12`, border 1px penuh, elevation 12 + shadow. Ikon 20px, label 9.5px.
Karena melayang & menimpa konten: semua layar tab pakai `paddingBottom: 130`, dan **FAB Beranda
naik ke `bottom: 104`** agar tak tertutup. Kalau menambah layar tab baru, ikuti angka ini.
