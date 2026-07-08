# Design System — Pelajarin.ai

> Diambil dari observasi screenshot. Nilai hex adalah **perkiraan** yang perlu dikonfirmasi dengan aset brand resmi.

## Warna
| Peran | Perkiraan | Catatan |
|---|---|---|
| Aksen utama (brand) | `#F97316` / `#FF7A00` (oranye) | Tombol utama, teks aktif, progress, highlight terpilih |
| Background app | `#0F1420` – `#131A2A` (navy sangat gelap) | Tema gelap dominan |
| Surface / kartu | `#1A2130` – `#1E2536` | Kartu sedikit lebih terang dari bg |
| Glow dekoratif | maroon (kiri) + ungu (kanan) | Lingkaran blur lembut di splash & wizard |
| Sukses / "Tambah" mapel | hijau terang `#7ED321`-ish | **Khusus** tombol Tambah Mata Pelajaran (beda dari aksen oranye) |
| Bahaya / "Keluar" | merah `#EF4444`-ish | Tombol logout |
| Teks primer | putih | |
| Teks sekunder | abu `#9AA3B2`-ish | Subjudul, placeholder |
| Ikon kategori | biru (File), merah (YouTube), hijau (Audio), ungu (Video), emas (trophy), biru (bintang XP) | |

## Tipografi
- Sans-serif tebal & agak membulat (mirip **Poppins / Nunito Sans**). Judul sangat bold. Perlu konfirmasi font resmi.

## Bentuk & Komponen
- **Radius besar** di mana-mana (kartu ~16–20px, tombol pill/rounded penuh).
- Tombol utama: pill oranye, teks putih bold, kadang ikon (sparkle ✨, panah ›). State disabled = oranye redup.
- Kartu: sudut membulat, border tipis; **empty state** pakai border **dashed** atau border oranye + ikon di tengah + judul + deskripsi.
- Input: rounded, border tipis; saat fokus border **oranye**.
- Progress bar: track gelap + fill oranye. Ring XP: donut dengan indikator oranye.
- Chip filter: pill; aktif = oranye, non-aktif = abu gelap.
- Bottom nav: 5 ikon + label, item aktif oranye.
- Slider: track oranye + thumb bulat oranye.
- Bottom sheet: sudut atas membulat, handle kecil di atas.

## Ikonografi
- Logo: buku terbuka + wajah senyum + bookmark seperti pin.
- Ikon garis (outline) konsisten. Ikon status: 🔥 streak, ⭐ level/XP, 🏆 leaderboard/premium, ✨ AI, 📖 koleksi.

## Nuansa / Tone Copy
- Bahasa Indonesia **santai & memotivasi** ("Kamu nggak sendirian", "Satu sesi kecil, progres terasa", "Nebak aja yang penting keisi"). Gunakan gaya ini untuk semua copy baru.
