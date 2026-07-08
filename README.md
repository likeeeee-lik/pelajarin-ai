# Pelajarin.ai

Aplikasi belajar berbasis AI: upload materi (file/audio/video/YouTube) → AI membuat
catatan, flashcard, kuis, dan prediksi soal ujian. Gamifikasi (XP/level/streak/leaderboard),
freemium, chat tutor AI berpersona.

> **Baca dulu sebelum ngoding:** `docs/ai-memory/` — memori bersama (spesifikasi UI web & mobile,
> onboarding, alur auth, design system, keputusan stack). PC lain cukup baca folder itu untuk konteks penuh.

## Stack
- **Web**: Next.js 15 (App Router, TS) + Tailwind — `apps/web`
- **API bersama**: NestJS + Prisma (dipakai web & mobile) — `apps/api`
- **Auth**: Logto (OIDC) @ `auth.pelajarin.ai`
- **DB + Storage**: Supabase (Postgres via Prisma)
- **AI**: Claude · Whisper/Groq · youtube-transcript · LlamaParse
- **Mobile (menyusul)**: Expo — `apps/mobile`
- **Shared**: tipe + Zod + API client — `packages/shared`
- Monorepo: Turborepo + pnpm

## Menjalankan (dev)
```bash
# Windows: pnpm via corepack (Program Files tidak bisa ditulis)
export COREPACK_HOME="$HOME/.cache/corepack"
corepack pnpm@9.15.0 install

pnpm dev:web   # http://localhost:3000
pnpm dev:api   # http://localhost:4000
```
Salin `.env.example` → `.env` dan isi kredensial saat siap. Mode auth default `stub`
(UI login jalan tanpa server); set `NEXT_PUBLIC_AUTH_MODE=logto` saat Logto siap.

## Status
- ✅ W0 fondasi monorepo · ✅ W1 UI login web (entry/masuk/daftar/consent, mode stub)
- ⏳ Berikutnya: wiring Logto + Supabase, onboarding, dashboard. Lihat `docs/RENCANA-WEB.md`.

## Struktur
```
apps/web        Next.js (frontend web)
apps/api        NestJS (API bersama) + prisma/schema.prisma
packages/shared tipe + Zod + ApiClient
docs/           rencana + ai-memory + screenshot (ss/app, ss/web)
```
