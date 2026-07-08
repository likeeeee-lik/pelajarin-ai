# Rencana Implementasi WEB — Pelajarin.ai

> Web dikerjakan lebih dulu, dengan **API backend bersama** (dipakai web + mobile). Stack dikunci di `docs/ai-memory/decisions.md`.
> Referensi UI: `docs/ai-memory/web-spec.md`, `onboarding-spec.md`, `login-flow.md`, `design-system.md`.

## 1. Stack Final
| Lapisan | Pilihan |
|---|---|
| Web frontend | Next.js (App Router, TypeScript) + Tailwind + TanStack Query + Zustand |
| API bersama | NestJS (REST/JSON, JWT) + Prisma |
| Auth | Logto (OIDC) di `auth.pelajarin.ai` — SDK Next.js & Expo |
| Database | Supabase Postgres (via Prisma) + Supabase Storage |
| AI | Claude · Whisper/Groq · youtube-transcript · LlamaParse |
| Bayar | Midtrans/Xendit |
| Monorepo | Turborepo |

## 2. Struktur Monorepo
```
pelajarin-ai/
├─ apps/
│  ├─ web/        # Next.js (frontend web)
│  ├─ api/        # NestJS (API bersama) + prisma/
│  └─ mobile/     # Expo (menyusul)
├─ packages/
│  └─ shared/     # tipe TS, skema Zod, API client (web & mobile pakai ini)
├─ docs/
└─ turbo.json
```

## 3. Alur Auth (Logto, sesuai screenshot)
1. Web klik "Masuk" → redirect ke Logto (`auth.pelajarin.ai`): Sign in / Create account (Google, Discord, email+password).
2. Consent "Authorize access" (OpenID/Profile/Email) → callback ke web.
3. Web simpan sesi; panggilan ke API `apps/api` membawa **access token (JWT)**.
4. API verifikasi JWT via JWKS Logto → mengenali user. Mobile pakai flow OIDC yang sama nanti.

## 4. Skema Database (garis besar — hanya diakses via API)
```
profiles          (id[=logto sub], nama, email, avatar, bahasa_tampilan,
                   bahasa_generasi, plan, xp, level, created_at)
onboarding_answers(id, user_id, question_key, value_json)
cognitive_scores  (user_id, ambisi, energi, teori_praktek, memori, fokus,
                   stres, kecepatan, motivasi)          -- 8 sumbu radar
persona_pref      (user_id, persona, output_bahasa, gaya_jawaban,
                   golden_hours_json)
subjects          (id, user_id, nama, warna)
materials         (id, user_id, subject_id, judul, tipe, source_url,
                   status, raw_text, created_at)
notes             (id, material_id, user_id, konten_md)
flashcards        (id, material_id, user_id, front, back,
                   review_due_at, ease, interval)       -- spaced repetition
quizzes           (id, material_id, user_id, soal_json, skor)
exam_predictions  (id, user_id, subject_id, judul, tipe, source_files,
                   prediksi_json)
chat_sessions     (id, user_id, material_id, persona)
chat_messages     (id, session_id, role, konten)
xp_events         (id, user_id, sumber, jumlah_xp)
streaks           (user_id, current, best, last_active)
usage_quota       (user_id, minggu, catatan, chat, prediksi)
subscriptions     (id, user_id, plan, status, provider, provider_ref,
                   mulai, berakhir)
referrals         (id, user_id, kode, referred_by)      -- affiliate/referral
```

## 5. Permukaan API (contoh endpoint)
- `GET /me`, `PATCH /me` (profil, bahasa)
- `POST /onboarding`, `GET /onboarding/scores`
- `GET/POST /subjects`
- `POST /materials` (upload/URL) → proses async → `GET /materials/:id`
- `GET /materials/:id/notes|flashcards|quizzes`
- `POST /exam-predictions`
- `POST /chat/sessions`, `POST /chat/messages` (streaming)
- `GET /leaderboard`, `GET /streaks`, `GET /usage`
- `POST /billing/checkout`, `POST /webhooks/payment`
> Panggilan AI & cek kuota **selalu** di API, tidak pernah di client.

## 6. Milestone WEB (bertahap)
- **W0 — Fondasi**: Turborepo, `apps/web` (Next.js) + `apps/api` (NestJS) + `packages/shared`, koneksi Supabase Postgres via Prisma, skema awal, design token (tema gelap + oranye).
- **W1 — Auth (fitur pertama)**: integrasi Logto di web (login/register/consent/logout, halaman "Masuk"), verifikasi JWT di API, endpoint `/me`.
- **W2 — Onboarding**: 20 langkah / 5 fase + radar chart hasil; simpan `onboarding_answers` + `cognitive_scores` + persona.
- **W3 — Dashboard & Materi (PDF dulu)**: sidebar, dashboard, upload PDF → API parse → Claude → catatan+flashcard+kuis; Mata Pelajaran.
- **W4 — Gamifikasi**: XP/level/streak, halaman Streaks, Leaderboard.
- **W5 — Sumber lain**: YouTube, Audio, Video (transkrip).
- **W6 — Prediksi Ujian (Latihan Soal)**.
- **W7 — Chat Tutor AI** (persona dari onboarding).
- **W8 — Langganan & Pembayaran** + Profil (kuota, heatmap aktivitas).
- **W9 — Landing page** publik.
- **(lalu) Mobile**: `apps/mobile` Expo konsumsi API yang sama.

## 7. Yang dibutuhkan dari user sebelum wiring
- **Logto**: tenant (cloud/self-host) + endpoint + app credentials; koneksi Google & Discord OAuth.
- **Supabase**: project URL + service key (DB + Storage).
- **Anthropic** (Claude) + **Groq** (Whisper) API key.
- Domain: `pelajarin.ai`, `auth.pelajarin.ai`, `app.pelajarin.ai`/`api.pelajarin.ai`.
- Aset brand: logo, hex oranye pasti, font.

> Fitur pertama yang dikerjakan: **W0 fondasi + W1 login (web)**. Untuk W1 fully-wired butuh kredensial Logto; UI login bisa dibangun lebih dulu sambil menunggu.
