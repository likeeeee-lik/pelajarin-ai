# Panduan Mendapatkan Kredensial — Supabase & Logto

Dibutuhkan untuk "wiring" login (Logto) + database/storage (Supabase). Keduanya
**gratis** untuk mulai. Isi hasilnya ke file `.env` (lihat `.env.example`).

---

## A. SUPABASE (Database Postgres + Storage) — ±5 menit

1. Buka **https://supabase.com** → **Sign in** (pakai akun GitHub paling cepat).
2. Klik **New project**.
   - **Name**: `pelajarin-ai`
   - **Database Password**: buat password kuat → **SIMPAN** (dipakai di connection string)
   - **Region**: pilih **Southeast Asia (Singapore)** (terdekat)
3. Tunggu provisioning ±2 menit.
4. Ambil nilai berikut:
   - **Project URL & Service key**: menu **Project Settings → API**
     - `Project URL`  → env `SUPABASE_URL`
     - `service_role` secret (bukan `anon`) → env `SUPABASE_SERVICE_KEY`
   - **Connection string (untuk Prisma)**: menu **Project Settings → Database → Connection string**
     - Salin URI. Ada 2 varian:
       - **Direct / Session (port 5432)** → env `DIRECT_URL` (dipakai Prisma migrate)
       - **Transaction pooler (port 6543)** → env `DATABASE_URL` (dipakai app; tambahkan `?pgbouncer=true` di ujungnya)
     - Ganti `[YOUR-PASSWORD]` di URI dengan password langkah 2.
5. Storage (nanti): kita buat bucket `materials` saat fitur upload. Belum perlu sekarang.

**Yang dikirim ke saya:** `SUPABASE_URL`, `SUPABASE_SERVICE_KEY`, `DATABASE_URL`, `DIRECT_URL`.

---

## B. LOGTO (Auth / OIDC — Sign in, Consent, akun) — ±10 menit

Rekomendasi: **Logto Cloud** (gratis, tanpa server sendiri). Alternatif self-host (Docker) di bawah.

### B1. Buat tenant & aplikasi
1. Buka **https://cloud.logto.io** → **Sign up**.
2. Buat tenant (pilih environment **Development**, region terdekat).
3. Menu **Applications → Create application**.
   - Pilih framework **Next.js (App Router)** → tipe **Traditional Web**.
   - Beri nama `pelajarin.ai web`.
4. Setelah dibuat, catat dari halaman aplikasi:
   - **Logto endpoint** (mis. `https://xxxx.logto.app/`) → env `LOGTO_ENDPOINT`
   - **App ID** → env `LOGTO_APP_ID`
   - **App Secret** → env `LOGTO_APP_SECRET`
5. Di setting aplikasi, isi **Redirect URIs**:
   - Sign-in redirect: `http://localhost:3000/callback`
   - Post sign-out redirect: `http://localhost:3000`
   *(nanti ditambah domain produksi `https://pelajarin.ai/...`)*
6. Buat **Cookie secret** acak (string panjang) → env `LOGTO_COOKIE_SECRET`
   (mis. hasil `openssl rand -base64 32`).

### B2. API resource (untuk verifikasi token di NestJS)
1. Menu **API resources → Create**.
   - Name: `pelajarin-api`
   - Identifier (audience): `https://api.pelajarin.ai` (boleh URL apa saja yang konsisten) → env `LOGTO_AUDIENCE`
2. Dari endpoint Logto, isi:
   - `LOGTO_ISSUER` = `{LOGTO_ENDPOINT}/oidc`
   - `LOGTO_JWKS_URL` = `{LOGTO_ENDPOINT}/oidc/jwks`

### B3. Social login (Google & Discord) — OPSIONAL, bisa menyusul
Di Logto: **Connectors → Social → Add** untuk Google dan Discord. Masing-masing
minta Client ID/Secret dari provider:

- **Google**: https://console.cloud.google.com → buat project → **APIs & Services → Credentials → Create OAuth client ID** (tipe **Web**). Di "Authorized redirect URIs", tempel **callback URL yang ditunjukkan Logto** pada connector Google. Salin Client ID/Secret ke Logto.
- **Discord**: https://discord.com/developers/applications → **New Application → OAuth2** → salin Client ID/Secret → tambahkan redirect = callback URL dari Logto → masukkan ke connector Discord.

> **Email/Password aktif otomatis** di Logto. Jadi kita bisa jalan dulu tanpa Google/Discord, tambahkan sosial belakangan.

**Yang dikirim ke saya:** `LOGTO_ENDPOINT`, `LOGTO_APP_ID`, `LOGTO_APP_SECRET`, `LOGTO_COOKIE_SECRET`, `LOGTO_AUDIENCE` (+ issuer & jwks otomatis dari endpoint).

### Alternatif: Logto self-host (Docker)
```bash
docker run -d --name logto -p 3001:3001 -p 3002:3002 \
  -e TRUST_PROXY_HEADER=1 svhd/logto:latest
```
Admin console di `http://localhost:3002`. Endpoint jadi `http://localhost:3001`.
Butuh Postgres sendiri. Lebih ribet — Cloud lebih disarankan untuk mulai.

---

## Ringkasan env yang akan diisi (lihat `.env.example`)
| Env | Dari |
|---|---|
| `SUPABASE_URL`, `SUPABASE_SERVICE_KEY` | Supabase → Settings → API |
| `DATABASE_URL`, `DIRECT_URL` | Supabase → Settings → Database |
| `LOGTO_ENDPOINT`, `LOGTO_APP_ID`, `LOGTO_APP_SECRET`, `LOGTO_COOKIE_SECRET` | Logto → Application |
| `LOGTO_AUDIENCE`, `LOGTO_ISSUER`, `LOGTO_JWKS_URL` | Logto → API resource + endpoint |
| `NEXT_PUBLIC_AUTH_MODE=logto` | diubah dari `stub` saat siap |

Setelah nilai-nilai ada, saya akan: pasang SDK `@logto/next` + route auth di web,
wire verifikasi JWT di API, jalankan `prisma migrate` ke Supabase, dan simpan
onboarding/profil ke DB (mengganti data mock).

**Catatan biaya:** Supabase free tier & Logto Cloud free tier cukup untuk
pengembangan. Tidak perlu kartu kredit untuk mulai.
