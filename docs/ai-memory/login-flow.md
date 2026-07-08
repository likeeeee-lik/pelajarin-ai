# Alur Login — Pelajarin.ai (detail per screenshot)

> Sumber: `docs/ss/1login1.jpeg`, `2login2.jpeg`, `3afterlogin.jpeg`. Dibaca teliti — **tak perlu buka screenshot lagi.**
> **Temuan penting:** hanya screenshot 1 yang layar **native di dalam app**. Screenshot 2 & 3 adalah **halaman web dari auth server** (`auth.pelajarin.ai`) yang dibuka di **browser eksternal** — terlihat dari address bar `auth.pelajarin.ai`, tombol X/share/translate browser, dan tema putih (beda total dari tema gelap app).

---

## SS #1 — `1login1.jpeg` — Entry Screen (NATIVE, tema gelap)
Ini layar yang kita bangun di app.
- Background: navy sangat gelap + glow lingkaran maroon di kiri-atas & ungu samar di kanan-bawah.
- **Tengah (vertikal, agak ke bawah):**
  - Logo buku-senyum (outline putih, ~64px).
  - Wordmark **"pelajarin.ai"** — putih, bold, besar (~34px).
  - Judul **"Buat akun baru"** — putih, bold (~22px), jarak di bawah wordmark.
  - Subjudul **"Mulai belajar dengan AI di Pelajarin.ai"** — abu (~15px).
- **Tombol 1 — "Daftar dengan Google"**: full-width, pill, background abu-gelap (`#2A3242`-ish), teks putih bold, ikon amplop di kiri teks. (Catatan: ikon amplop, bukan logo Google berwarna.)
- **Divider "ATAU"**: garis tipis kiri-kanan, teks "ATAU" abu, uppercase, spasi lebar.
- **Tombol 2 — "Daftar dengan Email"**: full-width, pill, background **oranye** (brand), teks putih bold, ikon **sparkle ✨** di kiri teks. Ada glow/shadow oranye lembut.
- **Link bawah — "‹ Sudah punya akun? Masuk"**: teks **oranye** bold, ada chevron kiri "‹". → pindah ke mode Masuk/Sign in.
- Padding horizontal konsisten (~24px), tombol tinggi ~56px, radius penuh.

## SS #2 — `2login2.jpeg` — Sign In (HALAMAN WEB auth server, tema putih)
Dibuka di browser saat user pilih Google/Email. Ini **milik auth server**, bukan layar app.
- Address bar browser: `…uth.pelajarin.ai`. Ada tombol X (tutup), share, translate, ⋮.
- Header: logo buku-senyum (hitam) + "pelajarin.ai" (hitam bold).
- Judul **"Sign in"** — hitam, bold, besar, center.
- **Tombol "Continue with Google"**: full-width, outline abu, background putih, **logo Google berwarna** + teks hitam.
- **Tombol "Continue with Discord"**: full-width, outline abu, putih, **logo Discord (hitam)** + teks hitam.
- **Divider "OR"**.
- Field **Email** (label "Email", placeholder `name@example.com`), outline rounded.
- Field **Password** (label "Password", placeholder "Enter your password").
- **Tombol "Sign in"**: full-width, pill, background **hitam**, teks putih.
- Baris bawah: "Forgot password?" (kiri) · "Create account" (kanan) — abu.
- Footer kecil: "Signing in to pelajarin.ai mobile".

## SS #3 — `3afterlogin.jpeg` — Authorize Access / OIDC Consent (HALAMAN WEB auth server, putih)
Muncul setelah sign in berhasil — layar persetujuan OIDC. Bukan layar app.
- Header sama: logo + "pelajarin.ai".
- Judul **"Authorize access"** (hitam bold besar).
- Baris ikon perisai + **"pelajarin.ai mobile wants to access:"**.
- 3 kartu scope (outline rounded, bullet abu):
  - **OpenID** — "Verify your identity"
  - **Profile** — "Access your name and profile picture"
  - **Email** — "Access your email address"
- **Tombol "Allow access"**: full-width, pill, **hitam**, teks putih.
- Teks **"Deny"** di bawahnya (abu, center).

---

## Kesimpulan arsitektur auth (asli)
App asli memakai **auth server hosted terpisah** (`auth.pelajarin.ai`) yang bertindak sebagai **OIDC provider** (dukung Google, Discord, email/password + halaman consent). Pola: app native buka **browser eksternal** → login di auth server → consent → redirect balik ke app (deep link) membawa token. Ini ciri khas **Better Auth / Logto / OIDC provider** — **bukan** Supabase Auth default (Supabase tidak menampilkan halaman consent "Authorize access" sendiri; Google/Discord yang tampilkan consent-nya).

**Implikasi untuk kita** (stack = Supabase): perlu keputusan — replikasi persis arsitektur hosted OIDC (pakai Better Auth/Logto di `auth.pelajarin.ai`), atau bangun **layar native** (dark, sesuai SS #1) + Supabase Auth (Google/Discord/email) tanpa halaman consent putih. Lihat `decisions.md`.
