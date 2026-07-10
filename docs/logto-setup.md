# Setup Logto (auth nyata)

Kode sudah siap. Yang tersisa hanya membuat tenant Logto dan mengisi env.
Selama env belum diisi, aplikasi tetap jalan di **mode stub** (dev).

## 1. Buat tenant (gratis)

1. Daftar di <https://cloud.logto.io> → buat tenant (region mana pun).
2. Catat **Logto endpoint**, bentuknya `https://xxxx.logto.app/`.

## 2. Buat aplikasi

**Applications → Create application → Next.js (App Router)** — tipe *Traditional web*.

Isi:

| Kolom | Nilai |
| --- | --- |
| Redirect URI | `http://localhost:3000/api/logto/callback` |
| Post sign-out redirect URI | `http://localhost:3000` |
| CORS allowed origins | `http://localhost:3000` |

Catat **App ID** dan **App Secret**.

## 3. Buat API resource (agar API NestJS bisa memverifikasi token)

**API resources → Create API resource**

| Kolom | Nilai |
| --- | --- |
| Name | `Pelajarin API` |
| API identifier | `https://api.pelajarin.ai` |

> Identifier ini hanya penanda (tidak harus bisa diakses). Nilainya dipakai
> sebagai `LOGTO_API_RESOURCE` (web) **dan** `LOGTO_AUDIENCE` (API).

## 4. (Opsional) Google & Discord

**Connectors → Social connectors** → tambahkan Google dan/atau Discord,
lalu aktifkan di **Sign-in experience → Sign-up and sign-in → Social sign-in**.

Tombol di halaman `/masuk` sudah mengirim `?provider=google|discord`, dan route
`/api/logto/sign-in` meneruskannya sebagai `directSignIn`.

## 5. Isi env

### `apps/web/.env.local`

```
NEXT_PUBLIC_AUTH_MODE=logto
NEXT_PUBLIC_API_URL=http://localhost:4000

LOGTO_ENDPOINT=https://xxxx.logto.app/
LOGTO_APP_ID=<App ID>
LOGTO_APP_SECRET=<App Secret>
LOGTO_COOKIE_SECRET=<32+ char acak: openssl rand -base64 32>
LOGTO_BASE_URL=http://localhost:3000
LOGTO_API_RESOURCE=https://api.pelajarin.ai
```

### `apps/api/.env`

```
# hapus / kosongkan AUTH_MODE agar tidak lagi stub
AUTH_MODE=

LOGTO_JWKS_URL=https://xxxx.logto.app/oidc/jwks
LOGTO_ISSUER=https://xxxx.logto.app/oidc
LOGTO_AUDIENCE=https://api.pelajarin.ai
```

> `JWKS_URL` = `{endpoint}/oidc/jwks`, `ISSUER` = `{endpoint}/oidc`.

## 6. Restart & uji

```bash
pnpm dev:api
pnpm dev:web
```

Alur yang harus jalan:

1. Buka `http://localhost:3000` → tombol **Masuk** tampil.
2. Klik **Masuk** → diarahkan ke halaman Logto → login/daftar.
3. Kembali ke `/app` (atau `/onboarding` bila user baru).
4. Navbar landing kini menampilkan **avatar + nama** (dari `GET /me`).
5. **Keluar** dari sidebar → sesi Logto dihapus → tombol **Masuk** kembali.

## Cara kerja token (web → API)

Komponen klien tidak bisa membaca cookie sesi Logto (httpOnly), jadi:

1. `lib/api/http.ts` memanggil `GET /api/logto/token`.
2. Route itu (server) mengambil access token untuk `LOGTO_API_RESOURCE`.
3. Token dikirim sebagai `Authorization: Bearer <token>` ke NestJS.
4. `JwtAuthGuard` memverifikasinya via JWKS remote Logto.

Token di-cache 60 detik di memori; saat API membalas `401`, cache dibuang.

## Keamanan

- Mode stub **ditolak** saat `NODE_ENV=production`. Tanpa `LOGTO_JWKS_URL` di
  produksi, semua request terproteksi membalas `401` (fail-closed).
- Jangan pernah commit `.env` / `.env.local`. Gunakan `.env.example` sebagai acuan.
