# Keputusan & Aturan Kerja — Pelajarin.ai

## Stack FINAL (dikunci 2026-07-08, sesi ke-2)
- **Urutan kerja**: WEB dulu → mobile menyusul.
- **Web frontend**: Next.js (TypeScript) — konsumsi API bersama.
- **Backend API BERSAMA**: **NestJS** (REST + JSON, JWT) + **Prisma** — satu API untuk web & mobile. Semua logika & panggilan AI di sini (bukan di client).
- **Auth**: **Logto** (OIDC provider di `auth.pelajarin.ai`) — Sign in/Create account/Consent/account portal sesuai screenshot. SDK Next.js (web) & Expo (mobile).
- **Database**: **Supabase** dipakai sebagai **Postgres + Storage** saja (auth = Logto, bukan Supabase Auth).
- **Mobile**: Expo (React Native, TS) + expo-router — menyusul, konsumsi API yang sama.
- **AI teks**: Anthropic Claude (Sonnet umum, Opus untuk prediksi ujian).
- **Transkripsi**: Whisper via Groq. **YouTube**: youtube-transcript. **Parsing dokumen**: LlamaParse/unstructured.
- **Pembayaran**: Midtrans / Xendit (Indonesia).
- **Monorepo**: Turborepo — `apps/web`, `apps/api`, `apps/mobile`, `packages/shared` (tipe + Zod + API client).
- Detail lama & milestone mobile: `docs/RENCANA-IMPLEMENTASI.md`. Rencana web: `docs/RENCANA-WEB.md`.

## Status project
- **W0 + W1(UI) SELESAI (2026-07-08, sesi ke-2)**: Turborepo (pnpm) berjalan. `packages/shared` (tipe+Zod+ApiClient), `apps/api` (NestJS: /health, /me, JwtAuthGuard Logto+stub; Prisma schema sbg dokumen belum di-wire), `apps/web` (Next.js 15 + Tailwind, tema gelap/oranye). **UI login clone**: `/` entry, `/masuk`, `/daftar`, `/consent`, `/app` — semua render 200, flow stub jalan (entry→consent→app). Typecheck ketiga paket lolos.
- **W2 ONBOARDING SELESAI (2026-07-08)**: `/onboarding` — 20 pertanyaan/5 fase config-driven (`src/lib/onboarding/`), input: single-select, scale(1-10+emoji), dual-slider(IPK), semantic, capsule(stres vertikal), Golden Hours (kurva drag SVG). Wizard state machine: transisi fase (auto-advance) → pertanyaan → analisis radar 8-sumbu (animasi) → hasil (upsell Pro Rp60k). IPK kondisional (mahasiswa/pascasarjana) → counter 1/19 vs 1/20. Alur register→onboarding via `?flow=register` di consent. Ikon: `lucide-react`.
- **W3 DASHBOARD & SHELL SELESAI (2026-07-08)**: area app di route group `app/app/` dengan `layout.tsx`→`AppShell` (sidebar kiri collapsible + user menu dropdown Profil/Keluar). Sidebar nav: Dashboard, Mata Pelajaran, Latihan Soal, Leaderboard, Streaks, + Tingkatkan Pro (menonjol). `/app` = dashboard (Greeting+tanggal id-ID, 4 stat card, baris "Buat baru", empty state "Mulai Belajar dengan AI" + 5 kartu sumber). Section lain = `SectionPlaceholder` ("sedang dibangun") biar nav jalan: `/app/{mata-pelajaran,latihan-soal,leaderboard,streaks,profil,upgrade}`. Data user dari `lib/mock-user.ts` (TODO: ganti `api.getMe()`). Komponen dashboard di `src/components/app/`.
- **W4 STREAKS & LEADERBOARD SELESAI (2026-07-08)**: `/app/streaks` (3 kartu besar Streak Saat Ini/Terpanjang/Level + 4 mini card Total XP/Flashcard Direview/Kuis Lulus/Kuis Sempurna + kartu Tips Menjaga Streak) dari `mock-user`. `/app/leaderboard` (client: toggle Total XP/Streak, grid 2 kolom, medali top-3 Crown/Medal, avatar inisial, paginasi 1/5) dari `lib/mock-leaderboard.ts` (top-10 asli dari screenshot + 40 generate = 50, punya field xp & streak). XP diformat koma en-US (45,150).
- **MATA PELAJARAN & PROFIL SELESAI (2026-07-08)**: `/app/mata-pelajaran` (client: form tambah + statistik + daftar CRUD state lokal, empty state). `/app/profil` (client: 5 stat card Total Catatan/Flashcard Dibuat/Kuis Dibuat/Prediksi Ujian/Total File, form Pengaturan Profil [nama editable, email disabled, Bahasa Tampilan & Bahasa Generasi select, Simpan], kartu Langganan [badge Gratis, Siklus Tagihan, Kuota Penggunaan 0/1 & 0/0 & prediksi 0/1, Upgrade ke Pro], `ActivityHeatmap` GitHub-style 53×7 statis) dari `lib/mock-profile.ts`.
- **LATIHAN SOAL + PRICING + LANDING SELESAI (2026-07-08)**: (1) `/app/latihan-soal` (client: empty state + tombol Buat Prediksi → **modal 2 langkah** `create-modal.tsx`: Judul/Mata Pelajaran/Tipe Ujian UTS-UAS-Kuis-Latihan → upload file dropzone + Ringkasan + Proses; hasil jadi `PredictionCard`). (2) **Pricing**: `components/marketing/pricing-plans.tsx` (toggle Bulanan/6Bulan-20%/Tahunan-50%, kartu Free/Pro-Terpopuler/Institusi) dipakai di `/app/upgrade` (dalam app shell) & `/harga` (publik). (3) **Landing `/`** (GANTI entry auth lama): `MarketingNavbar` + hero "Ubah 6 Jam...1 Jam" + Cara Kerja + Fitur + Stats + Format + FAQ (native `<details>`) + CTA + `MarketingFooter` (CV Triputra Consulting). Entry auth lama dihapus (`entry-actions.tsx`); daftar/masuk tetap di `/daftar` & `/masuk`. `next build` sukses (14 route). **UI web pada dasarnya LENGKAP.** Semua data masih MOCK — tinggal wiring Logto+Supabase+AI.
- **Toolchain**: pnpm via corepack butuh `COREPACK_HOME="$HOME/.cache/corepack"` (Program Files tak bisa ditulis). Node 20.
- **Belum di-wire (nunggu kredensial user)**: Logto (mode auth masih `stub`, ganti ke `logto` + isi env), Supabase (DATABASE_URL + Storage), Prisma generate/migrate, AI keys.
- Rencana web: `docs/RENCANA-WEB.md`. Rencana mobile (nanti): `docs/RENCANA-IMPLEMENTASI.md`.

## Cara menjalankan (dev)
- Install: `COREPACK_HOME="$HOME/.cache/corepack" corepack pnpm@9.15.0 install`
- Web: `pnpm dev:web` (port 3000) · API: `pnpm dev:api` (port 4000). Semua via turbo.
- Mode auth diatur `NEXT_PUBLIC_AUTH_MODE` (default `stub`).
- **Kredensial**: file rahasia (gitignored) = `apps/api/.env` (Supabase DB/keys, Logto, AI) & `apps/web/.env.local` (auth mode, Logto web). Jangan taruh secret di `.env.example` (committed).

## DATABASE TERSAMBUNG (2026-07-08) — Supabase live
- User sudah isi kredensial Supabase di `apps/api/.env` (project `ftbmnwfatzkeyjprqmks`, region `ap-southeast-1`). `SUPABASE_SERVICE_KEY` **masih kosong** (belum wajib; baru perlu utk Storage/upload).
- API: tambah `@prisma/client` + `prisma` + `dotenv` (di-load di `main.ts` baris pertama). `PrismaModule`(global)+`PrismaService`. Prisma datasource pakai `directUrl` (migrate) + pooler `DATABASE_URL` (runtime).
- **Migrasi awal `init` SUDAH diterapkan ke Supabase** (`apps/api/prisma/migrations/…_init`) — semua tabel skema dibuat. Perintah: `pnpm --filter @pelajarin/api db:migrate` / `db:generate` / `db:studio`.
- **`/me` sekarang DB-backed**: upsert Profile by `sub` (Logto/stub) → baca dari DB. Terverifikasi: 401 tanpa token, profil nyata dgn `Bearer dev`, 1 baris `Profile` (demo-user) tersimpan di Supabase.
- Catatan: `ValidationPipe` global dilepas dari `main.ts` (butuh `class-validator` yg tidak dipasang; kita validasi pakai Zod). Prisma v6.19 (ada notice update v7, diabaikan).
- **Belum**: simpan onboarding/subjects/predictions ke DB (baru Profile/`/me`), Storage (butuh service key), AI.

## LOGTO (AUTH) SUDAH DI-WIRE (2026-07-08) — pending tenant user
- Web: `@logto/next@4.2.10` terpasang. `src/lib/logto.ts` (logtoConfig dari env). Route handler: `app/api/logto/sign-in|callback|sign-out/route.ts` (pakai `signIn`/`handleSignIn`/`signOut` dari `@logto/next/server-actions`). Gate di `app/app/layout.tsx` (async server component): jika `NEXT_PUBLIC_AUTH_MODE=logto` & belum auth → redirect ke `/api/logto/sign-in` (di mode stub, dead-code dieliminasi → `/app` tetap static).
- `lib/auth.ts` mode logto → `window.location` ke `/api/logto/{sign-in,sign-out}` (sudah sesuai). Halaman `/masuk`,`/daftar`,`/consent` hanya untuk mode stub.
- API: guard JWT (`jose` JWKS) sudah ada sejak awal — aktif otomatis begitu `LOGTO_JWKS_URL` diisi.
- **Redirect URI kode**: `http://localhost:3000/api/logto/callback`; sign-out → `http://localhost:3000`.
- **Belum bisa dites** sampai user buat tenant Logto (Cloud) + isi env (web `.env.local` + api `.env`) + set `NEXT_PUBLIC_AUTH_MODE=logto`. User pilih **sekalian Google+Discord** (perlu OAuth client di Google Cloud Console + Discord Dev Portal, dikonfigurasi di Logto connectors). Panduan lengkap + cara aktivasi: `docs/SETUP-KREDENSIAL.md` (bagian B + "cara mengaktifkan").
- `next build` sukses (route logto = dynamic ƒ). `LOGTO_API_RESOURCE` ditambah di env web (audience utk minta access token API).
- TODO nanti: setelah callback, gate `onboardingCompleted` → arahkan user baru ke `/onboarding`; bridge access token web→API (getAccessToken) agar ApiClient kirim token asli (kini `getToken` masih null).

## Aturan kerja AI (permintaan user)
1. **Jangan buka ulang screenshot** `docs/ss/` — semua sudah tercatat di `docs/ai-memory/app-spec.md` & `design-system.md`. Cukup baca folder ini.
2. **Selalu simpan pemahaman/keputusan baru** ke `docs/ai-memory/` (bukan hanya memory pribadi Claude), supaya PC lain dapat konteks yang sama.
3. **Sebelum setiap `git push`**: sinkronkan `docs/ai-memory/` dengan pemahaman terbaru dan ikutkan dalam commit. *(Catatan: agar otomatis penuh, pasang git pre-push hook saat repo sudah di-init — belum dilakukan.)*
4. **Jangan membuat/mengeksekusi kode app sampai user menyetujui.**

## Perubahan strategi (2026-07-08, sesi ke-2)
- User memisah screenshot: `docs/ss/app/` (mobile) & `docs/ss/web/` (web).
- **Urutan pengerjaan: WEB DULU**, lalu mobile (Expo). Alasan: web lebih matang/lengkap di screenshot.
- **Wajib: API backend BERSAMA** dipakai web & mobile dari awal (jangan logika di client). Database & konsumsi AI 3rd-party dirancang dari awal.
- Auth = **OIDC provider terpisah** di `auth.pelajarin.ai` (bukti: account portal "Your applications", consent OIDC). Kemungkinan **Logto**. Ini menggeser rencana "Supabase Auth" → auth kemungkinan pakai Logto/OIDC; Supabase/Postgres tetap bisa jadi DB. **Perlu disepakati** (lihat pertanyaan tertunda).
- Detail: `web-spec.md`, `onboarding-spec.md`, `login-flow.md`.

## Tugas aktif: Clone halaman Login (fitur pertama)
- Detail UI di `login-flow.md`. SS #1 = layar native (dark) yang kita bangun; SS #2 & #3 = halaman web auth server (`auth.pelajarin.ai`) di browser.
- **Keputusan tertunda (perlu persetujuan user sebelum eksekusi):**
  1. Arsitektur auth: (A) layar **native Expo** dark + **Supabase Auth** [rekomendasi, cepat & sesuai stack] vs (B) replikasi persis **hosted OIDC** (Better Auth/Logto di auth.pelajarin.ai) dengan halaman consent putih.
  2. Scope tahap pertama: **UI-only** (layar statis dulu, belum ada auth nyata) vs **fully-wired** (langsung tersambung Supabase — butuh project Supabase + kredensial Google OAuth).

## FITUR DASHBOARD FUNGSIONAL via client store (2026-07-08) — permintaan user
User minta fitur di dashboard "benar-benar berfungsi". Karena backend AI belum ada,
dibuat lapisan **client store berbasis localStorage**: `apps/web/src/lib/store.ts`
(pakai `useSyncExternalStore`). Entitas: `subjects`, `materials`, `predictions`,
`profile` (+ mutators addSubject/removeSubject/addMaterial/removeMaterial/addPrediction/saveProfile).
Data **bertahan saat refresh** & **saling terhubung antar halaman**.
- **Dashboard** (`app/app/page.tsx` + `components/app/dashboard/dashboard-client.tsx`): tombol "Buat baru" & 5 kartu sumber membuka **`CreateMaterialModal`** (Tulis Catatan = editor teks → status "Siap"; File/YouTube/Audio/Video → status "Diproses"). Materi tampil di **`Collection`** ("Koleksi Kamu"); bisa hapus. Empty state bila kosong.
- **Mata Pelajaran**: tambah/hapus subjek → store; hitung catatan per subjek dari materials.
- **Latihan Soal**: prediksi tersimpan di store (persist).
- **Profil**: 5 stat card dihitung dari store (Total Catatan=materials, Prediksi=predictions, Total File=materials non-note); tombol **Simpan** menulis nama+bahasa ke store → "Tersimpan ✓"; **nama tersinkron** ke Greeting & Sidebar.
- Semua ditandai `TODO(API)`: ganti store→API saat Logto+DB aktif. `next build` JANGAN dijalankan saat `next dev` aktif (mengunci/menghapus `.next` → dev rusak & butuh `rm -rf .next` + restart). Verifikasi via typecheck + dev.

## NOTE WORKSPACE — FONDASI BACKEND AI (2026-07-09) — epic besar, bertahap
User tambah 55 screenshot detail (`docs/ss/web/userDashboard/`) → fitur inti berbasis AI. Spec: `docs/ai-memory/note-workspace-spec.md`. Keputusan user: **abstraksi AI + Mock dulu** (swappable ke Claude via env) & **backend nyata (API+DB)**.

**Arsitektur AI (OOP, kunci jangka panjang):** `apps/api/src/ai/`
- `AiProvider` (abstract class = kontrak & token DI): generateOutline, generateChapter, generateMindmap, generateFlashcards, generateQuiz, chat, predictExam. Tipe di `ai.types.ts`.
- `providers/mock.provider.ts` (MockAiProvider — konten contoh) & `providers/claude.provider.ts` (ClaudeAiProvider — Anthropic SDK `@anthropic-ai/sdk`, model env `ANTHROPIC_MODEL` default `claude-sonnet-5`).
- `ai.module.ts` (global): pilih provider via `AI_PROVIDER` env (`mock`|`claude`). `claude` aktif hanya jika `ANTHROPIC_API_KEY` ada, else fallback mock. **Semua fitur inject `AiProvider`, bukan Claude langsung.**
- Env baru (apps/api/.env): `AI_PROVIDER=mock`, `ANTHROPIC_API_KEY=`, `ANTHROPIC_MODEL=claude-sonnet-5`.

**Prisma (extend):** Material + `modeBelajar/gayaPenulisan/bahasa/sharePublic/shareSlug/updatedAt` + relasi `chapters`,`mindmap`. Model baru **Chapter** (urutan, judul, status pending|ready, kontenMd, isPro) + enum ChapterStatus, **MindMap** (dataJson). Diterapkan via **`prisma db push`** (bukan migrate — migrate dev butuh TTY; migration history belum termasuk perubahan ini, TODO reconcile).

**Module selesai + TERVERIFIKASI (mock):**
- `materials/` — POST `/materials` (buat + susun bab via AI outline; `tipe:note`=tanpa bab; bab-1 gratis, sisanya isPro) · GET `/materials` · GET `/materials/:id` (with chapters) · DELETE.
- `chapters/` — POST `/chapters` (tambah bab manual) · POST `/chapters/:id/generate` (isi via AI) · PATCH `/chapters/:id` (autosave editor) · DELETE.
- Guard JwtAuthGuard (stub demo-user). Uji: buat materi→6 bab→generate bab-1 markdown OK; tersimpan di Supabase.

**Belum (slice berikutnya):** endpoint mindmap/flashcards/quiz/chat/predictions (AiProvider sudah punya methodnya), ingestion nyata (parse file/transkrip), lalu **frontend Note Workspace** (6 tab, editor, timer Fokus, gating Pro, Bagikan/Ekspor). Frontend masih pakai localStorage store — perlu migrasi ke API pada slice frontend.

## Alur funnel (dikoreksi user 2026-07-08) — onboarding SEBELUM daftar
Sesuai urutan screenshot web (onboarding no.3–26 sebelum auth no.27), funnelnya:
- Landing **"Mulai Gratis Sekarang" → `/onboarding`** (wizard, tanpa login).
- Onboarding selesai (result) → **`/daftar`** (buat akun) → consent → `/app`.
- Navbar **"Masuk" → `/masuk`** (login) → consent → `/app`.
- consent-actions: register & login sama-sama → `/app` (tidak balik ke onboarding, hindari loop).
- (Nanti dgn Logto/DB: simpan jawaban onboarding setelah user terdaftar.)

## Keputusan sesi (2026-07-08, lanjutan)
- User **belum punya** kredensial Logto/Supabase. Panduan dibuat: `docs/SETUP-KREDENSIAL.md`.
- **Pilihan user**: lanjut bangun UI dulu (Mata Pelajaran, Profil) pakai mock; **wiring Logto+Supabase dilakukan nanti** saat kredensial siap.
- Saat auth di-wire nanti: **sekalian Google + Discord** (bukan email-only) — perlu OAuth client Google Cloud Console + Discord Developer Portal, dikonfigurasi di Logto connectors.

## Aset/akun yang masih ditunggu dari user
- Logo & warna brand resmi (konfirmasi hex oranye), font.
- Akun: Supabase, Anthropic, Groq, Midtrans/Xendit, Google/Discord OAuth, Play/App Store developer.
- Konfirmasi domain: `pelajarin.ai`, `auth.pelajarin.ai`.
