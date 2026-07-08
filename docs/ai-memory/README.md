# AI Memory — Pelajarin.ai

Folder ini adalah **memori bersama untuk AI (Claude Code)** yang di-commit ke repo, supaya:
- Claude **tidak perlu membuka ulang screenshot** di `docs/ss/` lebih dari sekali.
- PC / mesin lain yang mengerjakan project ini bisa **memuat konteks yang sama** (cukup baca folder ini).

## Isi
| File | Fungsi |
|---|---|
| `app-spec.md` | Spesifikasi tiap layar versi **MOBILE** (bottom-tab). Sumber `docs/ss/app/`. |
| `web-spec.md` | Spesifikasi versi **WEB** (landing, auth server OIDC, dashboard sidebar). Sumber `docs/ss/web/`. |
| `onboarding-spec.md` | Onboarding 20 langkah / 5 fase + radar chart hasil (web). |
| `login-flow.md` | Detail per-screenshot alur login/auth + temuan arsitektur auth (OIDC). |
| `design-system.md` | Warna, tipografi, komponen, ikon, pola visual. |
| `decisions.md` | Keputusan stack, arsitektur, dan aturan kerja (mis. sync memory sebelum push). |

> Peta file screenshot: `docs/ss/web/_STRUKTUR.md` (web) & `docs/ss/app/` (mobile, urut 1–37).

## Aturan pemeliharaan (PENTING)
1. Setiap ada pemahaman/keputusan baru → **update file di sini**.
2. **Sebelum setiap `git push`** → pastikan folder ini sudah sinkron dengan pemahaman terbaru, lalu ikut di-commit.
3. Saat mulai bekerja di mesin lain → **baca folder ini dulu** sebelum menyentuh kode.

> Referensi lain: `docs/RENCANA-IMPLEMENTASI.md` (rencana teknis & milestone), `docs/ss/` (screenshot asli).
