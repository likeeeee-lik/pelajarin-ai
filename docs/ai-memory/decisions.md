# Keputusan & Aturan Kerja — Pelajarin.ai

## Auth SENDIRI (email+password) — Logto dinonaktifkan (2026-07-10)
User memilih buang Logto. Alasan: halaman login Logto terasa asing, kode verifikasi email merepotkan, dan fitur yg dibutuhkan berbayar — **Custom JWT (klaim email/nama di access token) = Pro $24/bln**, **Collect user profile = Pro**, **Bring your own UI = Pro**. Free hanya: password sign-in, 3 social connector, logo/favicon. (Diverifikasi dari logto.io/pricing, bukan tebakan.)
Logto TIDAK dihapus — tetap hidup di balik `AUTH_MODE=logto` (guard, route /api/logto/*, LogtoAdmin M2M) supaya bisa dikembalikan.

**Bentuk sekarang** (`AUTH_MODE=local` di api & `NEXT_PUBLIC_AUTH_MODE=local` di web — harus sama):
- Schema: `Profile.passwordHash String?` + `id @default(cuid())` (dulu = Logto sub). `prisma db push` sudah jalan.
- `auth/password.ts`: **scrypt** bawaan Node (bukan bcrypt/argon2 — hindari kompilasi native di Windows), salt 16B, keylen 64, `timingSafeEqual`. Aturan: min 8 char, ada huruf+angka.
- `auth/local-jwt.ts`: JWT **HS256** via `jose` (sudah terpasang), iss=pelajarin, aud=pelajarin-api, TTL 7d, secret `AUTH_JWT_SECRET` (min 32 char, dicek saat sign/verify).
- `auth/auth.service.ts`: register/login. **DUMMY_HASH** dipakai saat email tak ditemukan agar scrypt tetap jalan → durasi respons tak membocorkan email mana yg terdaftar. Pesan error login disamakan ("Email atau password salah"). Rate limit in-memory 8×/10 menit per email.
- `POST /auth/register`, `POST /auth/login` (publik, di luar JwtAuthGuard).
- Guard punya 3 mode eksplisit: local | logto | stub. stub di `NODE_ENV=production` → dipaksa "local" (tanpa secret → semua 401 = fail-closed).
- **Web BFF**: `/api/auth/{register,login,logout,token}`. Token JWT disimpan di cookie **httpOnly** (`pelajarin_token`, sameSite lax, secure di prod, 7d) — JS browser tak bisa membacanya. `http.ts` mengambil token dari `/api/auth/token` (cache 60s). Gate `/app` di layout membaca cookie → redirect `/masuk`.
- Form `/masuk` & `/daftar` sudah ada → disambung + tampilkan pesan error server & status pending. Tombol OAuth & tautan "Lupa password?" DISEMBUNYIKAN di mode local (belum ada; tautan itu 404).
- `useSession`: signedIn = `/me` sukses (kecuali stub). Gate onboarding kini aktif di local juga.
- Verified E2E 10/10: /app tanpa sesi→307 /masuk; daftar→cookie HttpOnly; token; /app 200; `/me` mengembalikan **nama yg didaftarkan**; email duplikat 400; login salah=401 pesan sama dgn email tak ada; logout hapus cookie.

**BELUM ADA (utang)**: verifikasi email, lupa password, ganti password, login Google/Discord, refresh token/rotasi, MFA. Rate limit hanya per-proses (hilang saat restart, tak berlaku multi-instance).

## Dev pakai Turbopack (2026-07-10)
Klik pertama tiap rute di sidebar terasa "tidak jalan" — ternyata kompilasi on-demand webpack: `/app/mata-pelajaran` **43s**, latihan-soal 17,5s, streaks 16,9s (klik berikutnya 0,26s). Bukan bug.
Next 15.5 + next.config polos (hanya reactStrictMode + transpilePackages) → `next dev --turbopack` aman. Diukur setelah `rm -rf .next`: semua rute **0,4–1,7s** (landing 8,4s sekali di awal). Tak ada error/warning; gate auth utuh (`/app` 307, `/api/logto/token` 401). Log Next mencetak `Compiled /app/...` walau balasannya 307 → halaman benar-benar terkompilasi, angkanya sahih.
`build` sengaja TIDAK diubah (tetap webpack) supaya produksi tak berubah risikonya.
CATATAN: jangan jalankan dua dev server pada dir yang sama (bentrok `.next`); pernah kejadian API lama menyandera port 4000 → restart gagal diam-diam dgn EADDRINUSE & log jadi menyesatkan.

## Auth Logto AKTIF (2026-07-10)
Tenant Logto Cloud sudah dibuat user; env terisi (`apps/web/.env.local` + `apps/api/.env`, keduanya gitignored — endpoint/app-id/secret JANGAN ditulis di repo). `NEXT_PUBLIC_AUTH_MODE=logto`, `AUTH_MODE` tidak ada di api/.env, `LOGTO_JWKS_URL`/`LOGTO_ISSUER` diturunkan dari endpoint (dikonfirmasi lewat `/oidc/.well-known/openid-configuration`), `LOGTO_AUDIENCE`=`LOGTO_API_RESOURCE`=`https://api.pelajarin.ai`.
Terverifikasi (tanpa browser): API tolak `Bearer dev`/tanpa token → 401 (dulu 200). `/app` → 307 ke `/api/logto/sign-in`. sign-in → 302 ke `{endpoint}/oidc/auth` dgn PKCE + `resource=https://api.pelajarin.ai` (audience cocok). `?provider=google|discord` → `direct_sign_in=social:google|discord`; `?first_screen=register` → `first_screen=register`. Connector google+discord AKTIF di tenant; sign-in method: email.
BELUM diuji: login interaktif di browser (butuh user), callback, onboarding gate, keluar.
**PENTING**: data lama ada di `userId="demo-user"`. Setelah login Logto, user dapat `sub` baru → dashboard kosong. Perlu migrasi userId bila ingin data lama terbawa.

## Auth Logto: kode SIAP, tinggal isi env (2026-07-09)
Panduan lengkap: `docs/logto-setup.md`. Yang dibangun:
- **Jembatan token**: `app/api/logto/token/route.ts` (getAccessToken utk `LOGTO_API_RESOURCE`). `lib/api/http.ts` kini async — mode `logto` ambil token dari route itu (cache 60s, dibuang saat 401); mode `stub` tetap kirim `"dev"`. `apiFetch` TIDAK pernah dipanggil dari server component (sudah dicek) jadi fetch relatif aman.
- **sign-in route** hormati `?provider=google|discord` → `directSignIn: {method:"social", target}` (BUKAN string) & `?first_screen=register`.
- **callback** hanya `redirect("/app")`. (Versi awal cek `onboardingCompleted` di callback → LOOP: `onboardingDone` tak pernah ditulis, dan user funnel onboarding SEBELUM daftar. Diperbaiki.)
- **Gate onboarding**: `PATCH /me { onboardingCompleted }` (baru). Wizard: kalau sudah login → tandai DB → `/app`; kalau belum → `setOnboardingPending()` (localStorage) → `/daftar`. `AppShell` (HANYA mode logto, agar dev stub tak terganggu): profil ada & belum onboarding → konsumsi penanda pending → PATCH true; kalau tak ada penanda → `router.replace("/onboarding")`. Verified: PATCH persist, nama tidak ikut berubah.
- **Identitas asli**: `GET /me` + `PATCH /me` (baru) di UsersController. BUG DIPERBAIKI: `getProfile` dulu menimpa `nama` dari IdP tiap panggilan → editan user hilang; kini upsert update hanya sinkron email/avatar.
- `lib/use-session.ts` = sumber tunggal (profil selalu dari `/me`; signedIn: logto→`/me` sukses, stub→flag localStorage `lib/session.ts`). Dipakai sidebar/greeting/nav-auth-button/profil.
- **Dihapus**: `lib/store.ts` (subjects/materials sudah dead code; profil pindah ke DB via PATCH /me). `MOCK_USER` kini HANYA dipakai halaman streaks (gamifikasi, belum nyata).
- **KEAMANAN**: `JwtAuthGuard.isStub` menolak stub saat `NODE_ENV=production` → fail-closed. Terbukti: prod tanpa JWKS → `/me` & `/materials` 401 utk token apa pun; dev stub tetap 200.
Menyalakan: isi env web (NEXT_PUBLIC_AUTH_MODE=logto + LOGTO_*) & api (kosongkan AUTH_MODE, isi LOGTO_JWKS_URL/ISSUER/AUDIENCE).

## Penanda sesi login di navbar landing (2026-07-09)
Mode auth masih stub (belum ada sesi nyata). `lib/session.ts` = flag localStorage `pelajarin.session` (useSyncExternalStore). Diset via `markSignedIn()` di `AppShell` useEffect (masuk dashboard = login), dihapus via `clearSession()` di `signOut()` stub (Keluar). Navbar landing pakai `<NavAuthButton/>` (client): kalau signedIn → avatar+nama profil (link ke /app), else tombol "Masuk". TODO(logto): ganti dgn sesi Logto asli.

## Statistik nyata dashboard & profil (2026-07-09)
Endpoint `GET /stats` (StatsModule/StatsService, JwtAuthGuard) → hitungan agregat user via `prisma.count` paralel: materials, flashcards, quizzes, predictions, subjects, files (MaterialFile via relasi `material.userId`). Flashcard & Quiz punya `userId` langsung.
Web: `statsApi.get()` + tipe `UserStats`. **Dashboard StatCards** dirombak (dulu dari `MOCK_USER`: streak/level/xp/rank) → 4 kartu NYATA: Total Catatan (+file), Flashcard, Kuis, Prediksi. **Profil** grid statistik pakai `/stats` (dulu Flashcard/Kuis hardcoded 0). Query key `["stats"]`.
Verified: buat materi+5 flashcard → materials/flashcards naik; hapus → turun (cascade). Data user saat ini: 6 catatan/5 fc/1 kuis/3 mapel/3 file.
MASIH mock (butuh sistem aktivitas/gamifikasi = opsi terpisah): streak, level, XP, ranking (dashboard lama), Leaderboard, Streaks page — semua dari `MOCK_USER`/`mock-leaderboard`. ANTHROPIC_API_KEY ditunda (berbayar) — AI_PROVIDER tetap mock.

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

**BACKEND AI KOMPLET (2026-07-09)** — semua endpoint TERVERIFIKASI (mock, live Supabase):
- `mindmap/` — GET `/materials/:id/mindmap` · POST `/materials/:id/mindmap/generate` (upsert MindMap.dataJson).
- `flashcards/` — GET `/materials/:id/flashcards` · POST `/materials/:id/flashcards/generate` (body count, chapterIds → regen set).
- `quizzes/` — GET `/materials/:id/quizzes` · POST `/materials/:id/quizzes/generate` (count, types[], chapterIds → Quiz.soalJson) · GET `/quizzes/:quizId`.
- `chat/` — GET/POST `/materials/:id/chat/sessions` · GET `/chat/sessions/:id/messages` · POST `/chat/sessions/:id/messages` (RAG: konteks dari bab terpilih + history, simpan user+assistant).
- `predictions/` — GET `/predictions` · GET `/predictions/:id` · POST `/predictions` (AI predictExam → prediksiJson).
- Helper `MaterialsService.getContext(user, materialId, chapterIds?)` = gabung isi bab → konteks AI (dipakai mindmap/flashcards/quiz/chat). Modul non-materials import `MaterialsModule`.
- Json fields (mindmap/quiz/prediction) di-cast `as unknown as Prisma.InputJsonValue`.

## FRONTEND NOTE WORKSPACE — SLICE 1 (2026-07-09) — TERVERIFIKASI
- **API baru**: `subjects/` module (GET/POST/DELETE `/subjects`, with `_count.materials`).
- **Web data layer** (`apps/web/src/lib/api/`): `http.ts` (apiFetch + token "dev" utk stub — TODO logto token), `types.ts`, `resources.ts` (subjectsApi/materialsApi/chaptersApi). **React Query** (`@tanstack/react-query`) via `components/query-provider.tsx` di root layout.
- **Migrasi ke API (bukan localStorage lagi)**: Dashboard collection + create-material-modal (kini form config: subjek+buat, Mode Belajar, Gaya Penulisan, Bahasa → `POST /materials` → redirect `/catatan/:id`), Mata Pelajaran (subjects API), Profil (Total Catatan/File dari API). *store.ts materials/subjects jadi tak terpakai; predictions + profileSettings masih localStorage (Latihan Soal & nama).* 
- **Note Workspace** di route TOP-LEVEL `app/catatan/[id]/` (di luar AppShell, sesuai layout screenshot): `components/workspace/` — `WorkspaceSidebar` (tab Catatan/MindMap/Flashcards/Kuis/Dokumen/Chat + Tingkatkan + `FocusTimer` Pomodoro), `note-workspace.tsx` (header judul/subjek/Bagikan/Ekspor[stub], fetch material via query).
- **Tab Catatan FUNGSIONAL**: daftar bab (X/Y selesai, N terkunci), tombol **Buat** (generate isi via `/chapters/:id/generate`), buka **editor** (`chapter-editor.tsx`: textarea Markdown + pratinjau `react-markdown`/remark-gfm, **autosave** debounce → `PATCH /chapters/:id`, badge Tersimpan), **+ Tambah Chapter**, badge Pro.
- **Tab lain** (MindMap/Flashcards/Kuis/Dokumen/Chat) = `PlaceholderTab` ("segera") — endpoint sudah siap, tinggal wiring UI (slice berikutnya).
- Verifikasi: buat subjek+materi via API → koleksi dashboard 3 materi → `/catatan/:id` 200, shell workspace (semua tab+Fokus) ter-render. Typecheck web+api lolos.
- Markdown render distyling via `.md` class di globals.css (belum pakai @tailwindcss/typography).

## NOTE WORKSPACE — SLICE 2: SEMUA TAB TERWIRING (2026-07-09)
Web API resources+types ditambah: `mindmapApi/flashcardsApi/quizzesApi/chatApi` (`lib/api/resources.ts`, `types.ts`). Komponen di `components/workspace/`:
- **Mind Map** (`tabs/mindmap-tab.tsx`): empty→"Buat Mind Map"; render **tree rekursif** (Node berjenjang, warna per depth); "Buat Ulang".
- **Flashcards** (`tabs/flashcards-tab.tsx`): config (jumlah 15/25/50-PRO + `ChapterPicker`) → generate → **deck flip** (klik balik, prev/next, i/total, Buat Ulang).
- **Kuis** (`tabs/kuis-tab.tsx`): config (Jenis Soal multi PG/BS/Isian, Jumlah 5/15/20/30-PRO, chapter) → **runner interaktif** (radio/isian) → **Selesai→skor** + review benar/salah + pembahasan; Ulangi.
- **Chat** (`tabs/chat-tab.tsx`): daftar sesi + New Chat, area pesan (user/asisten markdown), selektor **Konteks chapter**, 4 prompt saran; auto-create session saat kirim pertama.
- **Dokumen** (`tabs/dokumen-tab.tsx`): info sumber (tipe/URL) + pratinjau `rawText`.
- Shared `chapter-picker.tsx`. Semua via React Query + endpoint API yang sudah ada.
- Diwire di `note-workspace.tsx` (ganti PlaceholderTab). Verifikasi: workspace 200; endpoint mindmap/flashcards/quiz/chat OK; typecheck web+api lolos.

## INGESTION NYATA (2026-07-09) — TERVERIFIKASI
`apps/api/src/ingestion/` (OOP, abstraksi seperti AI):
- **File parsing lokal (tanpa API key)**: PDF (`pdf-parse`), DOCX (`mammoth`), TXT/MD/CSV/JSON (utf8). PPT/XLSX belum didukung → fallback "".
- **YouTube**: `youtube-transcript` (transkrip caption, tanpa key).
- **Audio/Video**: `TranscriptionProvider` (abstract) → `GroqTranscriptionProvider` (Groq Whisper `whisper-large-v3`, OpenAI-compatible endpoint via fetch+FormData) / `MockTranscriptionProvider`; dipilih di `ingestion.module.ts` via `GROQ_API_KEY` (ada→groq, else mock).
- `IngestionService.extractFromUpload(file, tipe)` (parse/transkrip) & `extractFromYoutube(url)`.
- **Wiring**: `MaterialsModule` import `IngestionModule`; `MaterialsService` inject `IngestionService` → `create()` ingest YouTube transcript; **`createFromUpload()`** + endpoint **`POST /materials/upload`** (multipart, `FileInterceptor`, limit 300MB) parse/transkrip → `rawText` → outline AI.
- **Web**: `create-material-modal` kini simpan `File` asli → untuk file/audio/video kirim **FormData** ke `/materials/upload` (`materialsApi.upload`); YouTube/note tetap JSON. `apiFetch` skip content-type utk FormData.
- tsconfig API `types:["node","express","multer"]` (untuk `Express.Multer.File`). Uji: upload TXT nyata → rawText terekstrak dari file → 6 bab. Env: `GROQ_MODEL` opsional (default whisper-large-v3).

## STORAGE FILE (Supabase) (2026-07-09) — jalur fallback terverifikasi
`apps/api/src/storage/` (abstraksi seperti AI/ingestion): `StorageProvider` (abstract) → `SupabaseStorageProvider` (`@supabase/supabase-js`, bucket privat `materials` env `SUPABASE_BUCKET`, `createSignedUrl`) / `NoopStorageProvider`. `storage.module.ts` (@Global) pilih via `SUPABASE_URL`+`SUPABASE_SERVICE_KEY` (ada→supabase, else disabled). Client Supabase **lazy** (createClient di getter) agar tak crash saat disabled.
- Prisma: model **MaterialFile** (materialId, name, path, size, mime) + relasi `Material.files`. db push.
- Wiring: `MaterialsService.createFromUpload` → setelah ingest, jika `storage.enabled` → upload bytes ke `{sub}/{materialId}/{ts}_{name}` + buat MaterialFile (gagal upload tak batalkan materi). `get()` include `files`. `fileUrl(user,materialId,fileId)` → signed URL. Endpoint **GET `/materials/:id/files/:fileId/url`**.
- Web: `Material.files: MaterialFile[]`, `materialsApi.fileUrl`. **Dokumen tab** kini daftar file + **Unduh** (signed url→window.open) + **Pratinjau PDF** (iframe signed url); fallback tampil rawText + ajakan isi service key.
- **Verifikasi (tanpa key = disabled)**: log "Storage: disabled"; upload TXT → 6 bab, files:0, rawText ada, tanpa error.
- **AKTIF & TERVERIFIKASI LIVE (2026-07-09)**: user isi `SUPABASE_SERVICE_KEY` (format baru `sb_secret_...` = Secret key, bukan publishable). Log "Storage: supabase"; upload TXT → files:1, signed URL dibuat, download 200 + isi cocok. Bucket `materials` auto-dibuat.
- **Fix penting**: `@supabase/supabase-js` butuh WebSocket global (Realtime) yg tak ada di Node 20 → error "native WebSocket not found". Solusi: install `ws` + polyfill `globalThis.WebSocket = ws` di atas `supabase-storage.provider.ts`. Note: nilai `SUPABASE_SERVICE_KEY` = Secret key baru Supabase (bukan JWT `eyJ`), tetap valid untuk supabase-js.

**Belum:** Bagikan/Ekspor PDF (tombol stub); migrasi Latihan Soal(predictions) ke API; editor rich-text TipTap; gating Pro nyata; PPT/XLSX parser. Kunci kosong (mock/disabled) — isi `ANTHROPIC_API_KEY`(+AI_PROVIDER=claude), `GROQ_API_KEY`, `SUPABASE_SERVICE_KEY` utk AI/transkrip/storage asli.

## Prediksi Soal NYATA: upload→parse→AI→DB (2026-07-09)
Fitur Latihan Soal kini benar-benar berfungsi lewat API (bukan localStorage/mock lagi).
- **Endpoint**: `POST /predictions/upload` (`FilesInterceptor("files",10)`, multi-file, maks 50MB/file) → `PredictionsService.createFromUpload`: parse tiap file via `IngestionService` (PDF/DOCX/TXT; gambar/PPT hanya disimpan), upload ke Supabase Storage di `{userId}/predictions/...`, gabung teks jadi sourceText → `ai.predictExam` → simpan `ExamPrediction` (sourceFiles JSON = metadata, prediksiJson = {questions}). `GET /predictions` & `/predictions/:id` kembalikan `PredictionView` rapi (mapel di-resolve dari subjectId, fileCount, questions).
- `predictions.module` import `IngestionModule`. AI/Storage sudah @Global.
- **AI**: `PredictedQuestion` + `pembahasan`. Mock provider punya bank Fisika/Matematika/Umum (5 soal, dipilih dari kata kunci judul+sumber; kinematika jawab 30 m). Claude prompt: 5 PG + pembahasan. AI_PROVIDER=mock skrg → isi ANTHROPIC_API_KEY utk prediksi nyata.
- **Web**: `predictionsApi` (list/get/upload FormData); `latihan-soal/page` pakai useQuery(["predictions"]); create-modal upload beneran (FilesInterceptor field "files") + navigate ke detail; `[id]/page` fetch API render questions; PredictionCard tipe `ExamPrediction`; profil pakai predictionsApi. **Dihapus**: `lib/prediction-mock.ts` + `usePredictions/addPrediction/PredictionItem` di store.
- Verified E2E: upload txt fisika → 201, file tersimpan Storage, 5 soal (Q1 kinematika→30m), GET/LIST 200.
- Belum ada: endpoint DELETE prediksi; gating Pro nyata utk "Analisis lengkap".
- **Hardening utk AI nyata (2026-07-09)**: ClaudeProvider — `extractJson()` tahan fence/prosa, prediksi pakai `predictModel` (env `ANTHROPIC_MODEL_PREDICT`, default `claude-opus-4-8` sesuai keputusan stack "Opus utk prediksi"; `text()`/`json()` terima param model). Service `normalizeQuestions()` sanitasi output (tingkat valid, opsi array string, buang pertanyaan kosong). `.env.example` dokumen AI_PROVIDER=claude + ANTHROPIC_MODEL_PREDICT. Menyalakan: set `AI_PROVIDER=claude` + isi `ANTHROPIC_API_KEY` di apps/api/.env.

## SubjectCombobox jadi komponen bersama (2026-07-09)
`components/app/subject-combobox.tsx` (searchable + "Buat X" + Enter + link kelola) diekstrak dari create-material-modal, dipakai di **form unggah materi** & **form Prediksi Soal** (`latihan-soal/create-modal.tsx`, dulu input teks biasa → kini combobox; `mapel` di-resolve dari nama subjek terpilih). Predictions masih localStorage (mapel = string nama).

## FIX: bab manual (Tulis Catatan) buka editor kosong (2026-07-09)
`catatan-tab.tsx`: keputusan tombol pakai `chapter.status` (bukan ada-tidaknya konten). `status==="ready"` → **Buka** (jika berisi) / **Tulis** (jika kosong) → buka editor untuk diisi user (ref img 19.2). `status==="pending"` (AI belum digenerate) → **Buat**. Bab yang ditambah via `+ Tambah Chapter` = ready+kontenMd"" → langsung bisa ditulis. Materi `tipe:note` mulai 0 bab.

## BAGIKAN & EKSPOR PDF (2026-07-09) — TERVERIFIKASI
- **Bagikan** (pakai field `Material.sharePublic`/`shareSlug`): API `POST /materials/:id/share {enable}` (`MaterialsService.setShare`, slug via `randomUUID` sekali) + **`PublicController` GET `/public/materials/:slug` TANPA auth** (`getPublic` → judul/subjek/bab berisi). Web: `materialsApi.share`, `publicApi.get`; `ShareModal` (status Privat/Publik + Aktifkan/Nonaktifkan + link `${origin}/publik/{slug}` + Salin). Halaman publik read-only **`app/publik/[slug]/page.tsx`** (react-markdown). Uji: enable→slug→public 200; disable→404.
- **Ekspor PDF**: `ExportPdfModal` — pilih bab (checkbox, Pilih/Batal Semua) → `marked` (md→html) → `window.open`+`print()` (print-to-PDF, zero-server). Hanya bab berisi.
- Tombol header workspace **Bagikan**/**Ekspor PDF** kini fungsional (buka modal masing-masing). Dep baru: `marked` (web).

## FORM UPLOAD DISESUAIKAN REFERENSI (2026-07-09)
`create-material-modal.tsx` dirombak agar cocok `note-workspace-spec.md` §A (screenshot userDashboard 1–4,6,9,12,16):
- **File/Audio/Video = 2 langkah**: (1) **Dropzone** drag&drop + klik, teks "Drag & drop file di sini, atau klik untuk memilih" + format per sumber (file: PDF/Word/PPT/Excel/Text 100MB; audio: MP3/WAV 300MB; video: MP4/MOV 500MB) + kartu file terpilih (nama+ukuran "X.XX MB"+X). (2) **Config**: Mata Pelajaran/Kuliah (**SubjectCombobox** searchable + "Buat 'X'" + link Kelola), **Mode Belajar** 3 kartu (Kilat/Standar/Lengkap + ikon+desc), **Gaya Penulisan** (Serius&Formal/Ramah&Santai/Menyenangkan&Kreatif/Akademis&Ilmiah), **Bahasa Generasi** (🇮🇩/🇺🇸/🇸🇦/🇨🇳). Tombol Batal/Kembali/Lanjutkan.
- **YouTube**: langkah 1 = field "URL Video YouTube", langkah 2 = config sama.
- **Tulis Catatan**: 1 langkah "Buat Catatan Baru" (Judul Catatan opsional + Mata Pelajaran) → "Buat Catatan".
- Judul auto: file→nama file tanpa ekstensi; youtube→"Catatan dari YouTube".
- Saat submit tampil overlay **"Memproses dengan AI"** (ring spin + Brain + bar `@keyframes loading`). Wiring API tetap (upload FormData / create JSON). Header "Unggah File" (atau "Buat Catatan Baru").

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
