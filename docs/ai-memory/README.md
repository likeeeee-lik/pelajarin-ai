# AI Memory — Pelajarin.ai

Folder ini adalah **memori bersama untuk AI (Claude Code)** yang di-commit ke repo, supaya:
- Claude **tidak perlu membuka ulang screenshot** di `docs/ss/` lebih dari sekali.
- PC / mesin lain yang mengerjakan project ini bisa **memuat konteks yang sama** (cukup baca folder ini).

## Mulai dari mana? (baca berurutan)
1. **`decisions.md`** — keputusan stack & arsitektur, status tiap fitur. Paling penting.
2. **`mobile-app-spec.md`** — status build mobile + **urutan layar FINAL** (jangan diubah).
3. Sisanya sesuai kebutuhan.

## Isi
| File | Fungsi |
|---|---|
| `mobile-app-spec.md` | **MOBILE (terkini)**: 38 layar `docs/ss/app/` sudah diringkas, status build, urutan FINAL. |
| `app-spec.md` | Spec produk lama & lebih luas (konsep, gamifikasi, freemium). Sebagian alur usang. |
| `web-spec.md` | Spesifikasi versi **WEB** (landing, auth server OIDC, dashboard sidebar). Sumber `docs/ss/web/`. |
| `onboarding-spec.md` | Onboarding 20 langkah / 5 fase + radar chart hasil (web). |
| `note-workspace-spec.md` | **Fitur inti**: upload→AI→catatan berbab, mind map, flashcards, kuis, chat, prediksi soal + gating Free/Pro. Sumber `docs/ss/web/userDashboard/`. |
| `login-flow.md` | Detail per-screenshot alur login/auth + temuan arsitektur auth (OIDC). |
| `design-system.md` | Warna, tipografi, komponen, ikon, pola visual. |
| `decisions.md` | Keputusan stack, arsitektur, dan aturan kerja (mis. sync memory sebelum push). |

> Peta file screenshot: `docs/ss/web/_STRUKTUR.md` (web) & `docs/ss/app/` (mobile, urut 1–37).

## Aturan pemeliharaan (PENTING)
1. Setiap ada pemahaman/keputusan baru → **update file di sini**.
2. **Sebelum setiap `git push`** → pastikan folder ini sudah sinkron dengan pemahaman terbaru, lalu ikut di-commit.
3. Saat mulai bekerja di mesin lain → **baca folder ini dulu** sebelum menyentuh kode.

> Referensi lain: `docs/RENCANA-IMPLEMENTASI.md` (rencana teknis & milestone), `docs/ss/` (screenshot asli).
