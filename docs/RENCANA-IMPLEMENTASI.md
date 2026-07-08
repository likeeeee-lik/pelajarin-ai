# Rencana Implementasi — Pelajarin.ai

> Dokumen perencanaan. **Belum ada kode.** Disusun dari analisis screenshot di `docs/ss/`.
> Stack final: **Expo (React Native) + Supabase + Claude AI**.

---

## 1. Ringkasan Produk

Aplikasi belajar berbasis AI. User mengunggah materi (file / audio / video / YouTube) → AI mengubahnya menjadi **catatan rapi, flashcard, kuis, dan prediksi soal ujian**. Dibungkus **gamifikasi** (XP, level, streak, leaderboard) dengan model **freemium** (Free vs Pro).

Tiga bagian besar:
1. **App mobile** (Android + iOS) — produk utama.
2. **Web landing** (`pelajarin.ai`) — marketing + link download.
3. **Backend** — auth, AI processing, data, gamifikasi, langganan.

---

## 2. Stack Final & Alasan

| Lapisan | Pilihan | Alasan |
|---|---|---|
| Mobile | **Expo (React Native, TypeScript)** | Cross-platform, `expo-auth-session` cocok dengan pola login-via-browser di screenshot, OTA update, ekosistem besar |
| Navigasi | **expo-router** | File-based routing, deep link untuk callback OAuth |
| State/data | **TanStack Query + Zustand** | Query = cache data server; Zustand = state ringan (wizard, UI) |
| UI | **NativeWind (Tailwind) + Reanimated** | Styling cepat konsisten tema gelap; animasi progress/ring |
| Web landing | **Next.js** | Bisa berbagi tipe/logika dengan mobile |
| Backend/DB | **Supabase** (PostgreSQL, Auth, Storage, Edge Functions, Realtime) | All-in-one, murah, cepat untuk MVP; OAuth Google/Discord bawaan; RLS untuk keamanan data per-user |
| AI teks | **Anthropic Claude (Sonnet untuk umum, Opus untuk prediksi ujian)** | Catatan, flashcard, kuis, prediksi soal, chat tutor |
| Transkripsi | **Whisper via Groq** | Audio/video → teks, cepat & murah |
| YouTube | **youtube-transcript** | Ambil transkrip tanpa download video |
| Parsing dokumen | **LlamaParse / unstructured** | PDF/DOCX/PPT/gambar → teks (+ OCR) |
| Pembayaran | **Midtrans** atau **Xendit** | QRIS, e-wallet, VA, kartu (Indonesia) |
| Penyimpanan file | **Supabase Storage** (upgrade ke Cloudflare R2 bila perlu) | Terintegrasi + RLS |
| Push notif | **Expo Notifications** | Reminder streak & review |

### Kenapa Supabase (bukan backend custom)?
- MVP jauh lebih cepat: Auth + DB + Storage + serverless function dalam satu tempat.
- **Row Level Security (RLS)** = tiap user hanya bisa akses datanya sendiri, langsung dari client — aman tanpa banyak boilerplate API.
- Pekerjaan AI berat tetap jalan di **Edge Functions** (server-side, API key aman).
- Jika nanti butuh logika kompleks / skala besar, gampang menambah backend Node di samping Supabase tanpa migrasi total.

---

## 3. Arsitektur

```
┌─────────────┐     ┌─────────────┐     ┌──────────────────┐
│  App Expo   │     │ Web Next.js │     │  auth.pelajarin  │
│  (mobile)   │     │  (landing)  │     │  (Supabase Auth) │
└──────┬──────┘     └──────┬──────┘     └────────┬─────────┘
       │ HTTPS + JWT       │                     │ OAuth/OIDC
       ▼                   ▼                     ▼
┌───────────────────────────────────────────────────────────┐
│                        SUPABASE                            │
│  Postgres (RLS)  │  Storage  │  Edge Functions  │ Realtime │
└──────┬───────────────────────────────┬────────────────────┘
       │ (Edge Functions memanggil AI) │
       ▼                               ▼
  ┌──────────┐  ┌──────────┐  ┌─────────────┐  ┌────────────┐
  │  Claude  │  │  Whisper │  │  LlamaParse │  │  Midtrans  │
  │   API    │  │  (Groq)  │  │  / YT trans │  │  / Xendit  │
  └──────────┘  └──────────┘  └─────────────┘  └────────────┘
```

**Alur pemrosesan materi (inti app):**
1. User pilih sumber (file/YouTube/audio/video) → upload ke Storage / kirim URL.
2. Edge Function `process-material` → ekstrak teks (parse dokumen / transkrip audio / transkrip YouTube).
3. Kirim teks ke Claude → hasilkan **catatan + flashcard + kuis** (structured output/JSON).
4. Simpan ke DB, kurangi kuota, tambah XP.
5. App menampilkan hasil (Realtime/refetch).

**Alur prediksi ujian:** upload soal lama → parse → Claude analisis pola → simpan prediksi (kuota terpisah: Free = 1 seumur hidup).

---

## 4. Skema Database (draft)

```
profiles           (id→auth.users, nama, avatar, bahasa, plan, xp, level,
                    streak_count, streak_best, streak_last_active, created_at)
onboarding_answers (id, user_id, question_key, value_json)   -- 20 langkah wizard
subjects           (id, user_id, nama, warna, created_at)
materials          (id, user_id, subject_id, judul, tipe[file|youtube|audio|video],
                    source_url, status[processing|ready|failed], raw_text, created_at)
notes              (id, material_id, user_id, konten_md, created_at)
flashcards         (id, material_id, user_id, front, back,
                    review_due_at, ease, interval)           -- spaced repetition
quizzes            (id, material_id, user_id, soal_json, skor, created_at)
exam_predictions   (id, user_id, subject_id, judul, tipe[UTS|UAS|Kuis|Latihan],
                    source_files, prediksi_json, created_at)
chat_sessions      (id, user_id, material_id, persona, created_at)
chat_messages      (id, session_id, role, konten, created_at)
xp_events          (id, user_id, sumber, jumlah_xp, created_at)
usage_quota        (user_id, minggu, catatan_terpakai, chat_terpakai,
                    prediksi_terpakai)
subscriptions      (id, user_id, plan, status, periode, provider,
                    provider_ref, mulai, berakhir)
leaderboard        -- VIEW dari profiles diurut xp/streak
```
Semua tabel user-scoped diproteksi **RLS**: `user_id = auth.uid()`.

---

## 5. Struktur Folder (monorepo)

```
pelajarin-ai/
├─ apps/
│  ├─ mobile/            # Expo app
│  │  ├─ app/            # expo-router (splash, auth, wizard, (tabs)/…)
│  │  ├─ components/
│  │  ├─ features/       # materials, exam, gamification, profile
│  │  ├─ lib/            # supabase client, api, hooks
│  │  └─ theme/          # warna, tokens (oranye + gelap)
│  └─ web/               # Next.js landing
├─ packages/
│  ├─ shared/            # tipe TypeScript, skema Zod, konstanta
│  └─ config/            # eslint, tsconfig
├─ supabase/
│  ├─ migrations/        # SQL skema + RLS
│  └─ functions/         # Edge Functions: process-material,
│                        #   predict-exam, chat, webhook-payment
└─ docs/
```

---

## 6. Rencana Bertahap (Milestone)

**M0 — Fondasi** (setup): monorepo, Expo + expo-router, Supabase project, skema DB + RLS, tema/desain token, komponen dasar.

**M1 — Auth & Onboarding**: login Google/Discord/Email via Supabase Auth (pola browser + deep link), splash, wizard 20 langkah, simpan `onboarding_answers`.

**M2 — Materi → Catatan (jalur PDF dulu)**: FAB upload PDF → Edge Function parse → Claude → catatan + flashcard + kuis; Beranda + Koleksi + search/filter; Mata Pelajaran (CRUD subjek).

**M3 — Gamifikasi**: XP/level/streak, kartu statistik Beranda, halaman Streak & XP, Leaderboard.

**M4 — Sumber materi lain**: YouTube, Audio, Video (transkripsi Whisper).

**M5 — Prediksi Ujian**: upload soal lama (2 langkah) → analisis pola → prediksi.

**M6 — Chat Tutor AI**: chat dengan persona (Militer/Guru BK/Teman/Profesor), kuota.

**M7 — Langganan & Pembayaran**: pricing, kuota Free/Pro, Midtrans/Xendit + webhook.

**M8 — Web landing + rilis**: Next.js landing, ikon/splash, build EAS, submit Play Store & App Store.

> MVP yang bisa dites paling awal = **M0–M3** (upload PDF jadi catatan + gamifikasi dasar).

---

## 7. Kuota & Plan (dari screenshot)

| | Free | Pro |
|---|---|---|
| Catatan | 1 / minggu | tanpa batas |
| Chat AI | 0 / minggu | tanpa batas |
| Prediksi ujian | 1 seumur hidup | tanpa batas |
| Harga Pro | — | Rp30k/bln (tahunan) · Rp48k/bln (6 bln) · Rp60k/bln (bulanan) |

Kuota dicek di Edge Function **sebelum** memanggil AI (hemat biaya + aman dari manipulasi client).

---

## 8. Keamanan & Biaya
- **API key AI/pembayaran hanya di Edge Functions**, tidak pernah di app.
- **RLS** di semua tabel; validasi kuota server-side.
- **Rate limiting** pada function AI.
- Pantau biaya: Claude (per token) + Whisper (per menit) — mode kuota menjaga margin.

---

## 9. Yang saya butuhkan sebelum mulai kode
1. **Aset brand**: logo (buku senyum), warna oranye pastinya (mis. `#F97316`?), font.
2. **Akun**: Supabase, Anthropic (Claude), Groq, Midtrans/Xendit, Google/Discord OAuth, Apple/Google Play developer.
3. Konfirmasi **domain** (`pelajarin.ai`, `auth.pelajarin.ai`).
4. Prioritas: mulai eksekusi dari **M0 → M1**?

---

*Setelah dokumen ini kamu setujui, langkah berikutnya (menunggu persetujuan): mulai M0 (setup fondasi) atau menyusun desain detail per-layar.*
