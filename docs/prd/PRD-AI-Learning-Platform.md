# Product Requirements Document — AI Learning Platform (Model Pelajarin.ai)

**Codename:** _BelajarAI_ (placeholder — sesuaikan)
**Versi:** 1.0
**Tipe:** AI-powered learning SaaS — mobile-first
**Model:** Backend penuh, autentikasi, pemrosesan AI (RAG), freemium/subscription
**Stack:** React Native Expo (SDK 51) · Supabase (Postgres + pgvector + Auth + Storage) · Edge Functions (Deno) · LLM API · RevenueCat · Midtrans
**Status:** Draft
**Author:** DA

---

## 1. Overview

### 1.1 Ringkasan Produk
BelajarAI adalah aplikasi belajar berbasis AI untuk siswa Indonesia. Pengguna mengunggah materi (dokumen, audio, video, atau link YouTube), dan AI mengubahnya menjadi ringkasan, flashcard, kuis, serta menyediakan AI Tutor 24/7 yang menjawab pertanyaan berdasarkan materi tersebut. Dibungkus dengan gamifikasi (XP, level, streak, leaderboard) dan model bisnis freemium/subscription.

### 1.2 Value Proposition
Memangkas waktu belajar secara drastis ("6 jam jadi 1 jam") dengan mengotomasi peringkasan, pembuatan latihan, dan tanya-jawab materi — semua dalam Bahasa Indonesia.

### 1.3 Tujuan Produk
- Membantu siswa memahami materi lebih cepat lewat AI.
- Meningkatkan retensi belajar via flashcard (spaced repetition) & kuis.
- Menyediakan tutor AI yang kontekstual terhadap materi pengguna.
- Membangun bisnis subscription yang berkelanjutan (pendapatan menutup biaya AI).

### 1.4 Non-Goals (v1)
- Bukan LMS sekolah formal (tidak ada manajemen kelas/guru-murid kompleks).
- Tidak ada pembuatan konten kolaboratif real-time.
- iOS menyusul (v1 fokus Android, sesuai acuan yang iOS-nya "coming soon").
- Tidak ada fitur sosial/komunitas kompleks di v1.

### 1.5 Peringatan Kompleksitas & Prinsip
Ini produk AI-heavy: **setiap aksi AI = biaya API riil**. Karena itu, kontrol biaya (quota, rate limit, caching), pemrosesan asinkron (job queue), dan monetisasi bukan fitur tambahan — melainkan fondasi yang dirancang sejak awal.

---

## 2. Target Pengguna & Persona

| Persona | Deskripsi | Kebutuhan |
|---|---|---|
| **Siswa SMA/Kuliah** | Pengguna utama, banyak materi, waktu terbatas | Ringkasan cepat, latihan, tutor tanya-jawab |
| **Pelajar mandiri** | Belajar skill/topik sendiri | Ubah materi apa pun jadi bahan belajar |
| **Siswa persiapan ujian** | Butuh review intensif | Flashcard + kuis dari materi ujian |

### 2.1 Skenario Utama
1. Siswa upload PDF materi 200 halaman → dapat ringkasan poin kunci dalam beberapa menit.
2. Dari materi yang sama, generate 30 flashcard & kuis 20 soal untuk latihan.
3. Bingung satu konsep → tanya AI Tutor yang menjawab merujuk ke materi tersebut.
4. Paste link YouTube video pelajaran → jadi ringkasan + kuis.
5. Belajar rutin tiap hari → streak & XP naik, naik peringkat di leaderboard.

---

## 3. Arsitektur Sistem

### 3.1 Diagram Alur Tingkat Tinggi
```
[Mobile App (RN Expo)]
     │  upload materi / link
     ▼
[API / Edge Function]  ──►  [Storage (file)]
     │  buat job
     ▼
[Job Queue]  ──►  [Worker: Ingesti & Pemrosesan]
                        │  ekstrak teks / transkripsi
                        │  chunking + embedding
                        ▼
                  [Vector DB (pgvector)] + [Postgres (metadata)]
     ┌──────────────────────────────────────────┐
     │  Saat user minta ringkasan/kuis/flashcard │
     │  atau bertanya ke AI Tutor:               │
     │  retrieve chunk relevan → LLM → hasil     │
     └──────────────────────────────────────────┘
     ▼
[Mobile App]  ◄── hasil (ringkasan/flashcard/kuis/jawaban tutor)
```

### 3.2 Stack Teknologi
| Area | Pilihan | Catatan |
|---|---|---|
| Mobile | React Native Expo SDK 51 | Sesuai keahlian; Android dulu |
| Bahasa | TypeScript (strict) | End-to-end |
| Auth | Supabase Auth | Email, Google |
| Database | Supabase Postgres | Data relasional |
| Vector DB | Supabase **pgvector** | Embedding materi (RAG); satu platform, hemat |
| Storage | Supabase Storage | File upload user, terisolasi per user (RLS) |
| Backend logic | Supabase Edge Functions (Deno) | Orkestrasi AI, API |
| Job queue | Tabel antrian + worker, atau Inngest/Trigger.dev | Untuk job panjang (video/audio) |
| LLM | API (Claude / OpenAI / model kuat B.Indo) | Ringkasan, kuis, tutor |
| Transkripsi | Whisper (atau API STT) | Audio & video → teks |
| Embedding | Model embedding (mis. text-embedding) | Untuk RAG |
| Subscription | RevenueCat | Kelola langganan mobile (sesuai rencana ResetKu) |
| Payment | Midtrans | Gateway lokal Indonesia (sesuai pengalaman KliknClean) |
| Offline (opsional) | WatermelonDB | Cache materi & progres |
| Push notif | Expo Notifications | Job selesai, reminder streak |
| Analytics | PostHog / Firebase | Perilaku & funnel |

### 3.3 Prinsip Arsitektur Kunci
- **Pemrosesan asinkron:** semua ingesti berat lewat job queue; app tidak menunggu di satu request.
- **RAG-first untuk AI Tutor:** jawaban tutor selalu berbasis materi pengguna (retrieval), meminimalkan halusinasi.
- **Cost-aware by design:** quota, rate limit, caching hasil, batas ukuran input tertanam di lapisan API.
- **Isolasi data per user:** RLS ketat di Supabase; file & materi tidak bocor antar-akun.

---

## 4. Pipeline Ingesti Konten (Per Format)

### 4.1 Dokumen (PDF, Word, PPT)
- Ekstraksi teks. PDF berupa scan/gambar → **OCR**.
- Deteksi dokumen kosong/gagal ekstrak → beri error jelas.

### 4.2 Audio (MP3, WAV)
- Transkripsi (speech-to-text) → teks → lanjut ke chunking.

### 4.3 Video (MP4, MOV)
- Ekstrak audio → transkripsi → teks.

### 4.4 YouTube
- Ambil transkrip/caption bila tersedia; jika tidak, unduh audio → transkripsi.
- **Perhatikan legalitas & ToS YouTube**; batasi durasi.

### 4.5 Tahap Umum Setelah Teks Didapat
1. **Chunking** teks jadi potongan bermakna.
2. **Embedding** tiap chunk → simpan ke pgvector.
3. Simpan metadata materi (judul, sumber, jumlah token, status) di Postgres.
4. Update status job → notifikasi user.

### 4.6 Status Job (UI harus menangani)
`queued` → `processing` → `completed` / `failed`. Tampilkan progress & pesan error yang dapat dimengerti.

---

## 5. Fitur AI Inti

### 5.1 Ringkasan Otomatis
- Ubah materi panjang jadi poin-poin kunci berjenjang.
- Opsi tingkat ringkasan (singkat / sedang / detail).
- Caching: ringkasan disimpan, tidak digenerate ulang tiap buka.

### 5.2 Flashcard Otomatis
- Generate pasangan pertanyaan-jawaban dari materi.
- Pengguna bisa edit/hapus/tambah kartu manual.

### 5.3 Kuis Pilihan Ganda
- Generate soal PG + kunci + pembahasan dari materi.
- Atur jumlah soal & tingkat kesulitan.
- Mode ujian: nilai akhir + review jawaban.

### 5.4 AI Tutor (Chat berbasis RAG)
- Chat 24/7 yang menjawab **berdasarkan materi user** (retrieval dari pgvector).
- Menyertakan rujukan ke bagian materi bila relevan.
- Riwayat percakapan per materi.
- Batasi panjang konteks & jumlah pesan sesuai tier (kontrol biaya).

---

## 6. Fitur Belajar & Retensi

### 6.1 Spaced Repetition (Flashcard)
- Algoritma seperti SM-2: kartu dijadwalkan ulang berdasarkan tingkat kemudahan jawaban user.
- Antrian "kartu jatuh tempo hari ini".

### 6.2 Library Materi
- Semua materi (Notes) tersimpan per user, bisa dicari & dikelompokkan.
- Tiap materi menautkan ringkasan, flashcard, kuis, dan chat tutornya.

### 6.3 Mode Belajar & Review
- Belajar (baca ringkasan), latihan (flashcard/kuis), review (kartu jatuh tempo).

---

## 7. Gamifikasi

Selaras dengan yang terlihat di acuan (Notes, Streak, XP, Level, Leaderboard) — area yang sudah kuat di pengalaman ResetKu.

| Elemen | Aturan |
|---|---|
| **XP** | Didapat dari aktivitas belajar (selesai kuis, review flashcard, dll) |
| **Level** | Naik mengikuti kurva XP; membuka lencana/status |
| **Streak** | Belajar ≥1 aktivitas per hari; grace/freeze opsional |
| **Leaderboard** | Global & mingguan (server-authoritative) |
| **Badge** | Achievement (mis. 7-day streak, 100 kartu direview) |
| **Dashboard** | Statistik: jumlah Notes, streak, XP, level, aktivitas |

---

## 8. Akun & Monetisasi

### 8.1 Autentikasi
- Supabase Auth: email/OTP, Google. (Apple saat rilis iOS.)
- Profil: nama, avatar, jenjang pendidikan (opsional).

### 8.2 Model Freemium / Subscription
- **Free tier:** quota terbatas (mis. X materi/bulan, Y pesan tutor/hari, ukuran file dibatasi). Alat akuisisi, bukan produk penuh.
- **Paid tier(s):** quota lebih besar/tanpa batas wajar, fitur lanjutan (materi lebih besar, prioritas antrian, model lebih kuat).
- Tanpa kartu kredit untuk mulai (free langsung jalan).

### 8.3 Payment & Billing
- **RevenueCat** untuk kelola subscription lintas store & status entitlement.
- **Midtrans** untuk pembayaran lokal (bila jual di luar in-app purchase / web).
- Catatan: kebijakan in-app purchase Google Play untuk konten digital perlu diperhatikan (komisi store vs gateway lokal).

### 8.4 Quota & Rate Limiting (WAJIB)
- Batas per tier ditegakkan di lapisan API sebelum memanggil LLM.
- Hitung & catat konsumsi (token/job) per user untuk monitoring biaya.
- Tolak/antre bila melebihi quota; tawarkan upgrade.

---

## 9. Model Data (Ringkas)

| Tabel | Kolom kunci |
|---|---|
| `profiles` | id, name, avatar, education_level, tier, created_at |
| `materials` | id, user_id, title, source_type, source_ref, status, tokens, created_at |
| `material_chunks` | id, material_id, content, embedding (vector), position |
| `summaries` | id, material_id, level, content, created_at |
| `flashcards` | id, material_id, front, back, ease, interval, due_at |
| `quizzes` | id, material_id, config |
| `quiz_questions` | id, quiz_id, question, options, answer, explanation |
| `quiz_attempts` | id, user_id, quiz_id, score, answers, taken_at |
| `tutor_chats` | id, user_id, material_id, created_at |
| `tutor_messages` | id, chat_id, role, content, created_at |
| `jobs` | id, user_id, material_id, type, status, error, created_at |
| `usage_counters` | user_id, period_key, tokens_used, jobs_used |
| `player_stats` | user_id, xp, level, updated_at |
| `streaks` | user_id, current, longest, last_active_date |
| `badges` / `user_badges` | definisi & unlock |
| `scores` | user_id, period_type, period_key, xp (untuk leaderboard) |
| `subscriptions` | user_id, tier, status, provider, renews_at |

**RLS:** setiap user hanya akses datanya; leaderboard via view teragregasi; penulisan sensitif lewat Edge Function.

---

## 10. Alur Utama (Flows)

### 10.1 Alur Upload → Hasil
```
Pilih sumber (dokumen/audio/video/YouTube)
   ▼
Upload / paste link → buat material + job (status: queued)
   ▼
Worker proses (ekstrak/transkrip → chunk → embed) → status: processing
   ▼
Selesai (status: completed) → push notif "Materi siap"
   ▼
Buka materi → pilih: Ringkasan / Flashcard / Kuis / Tanya Tutor
```

### 10.2 Alur AI Tutor (RAG)
```
User kirim pertanyaan
   ▼
Embed pertanyaan → retrieve chunk relevan dari pgvector (materi terkait)
   ▼
Susun prompt (pertanyaan + konteks chunk) → panggil LLM
   ▼
Tampilkan jawaban + rujukan → simpan ke riwayat
   (cek quota sebelum panggil LLM)
```

### 10.3 Alur Upgrade
```
User kena limit / ingin fitur pro
   ▼
Halaman pricing → pilih paket → RevenueCat/Midtrans
   ▼
Update entitlement → quota naik → fitur terbuka
```

---

## 11. Persyaratan Non-Fungsional

| Aspek | Target |
|---|---|
| Performa | UI responsif; job berat asinkron dengan feedback progress |
| Skalabilitas biaya | Quota & rate limit menegakkan batas sebelum panggil LLM |
| Keamanan data | RLS ketat, isolasi file per user, enkripsi in transit |
| Privasi pelajar | Privacy policy jelas; pertimbangan data di bawah umur |
| Legal | ToS: user bertanggung jawab atas materi yang diunggah (hak cipta) |
| Keandalan | Retry job gagal; pesan error yang jelas |
| Bahasa | Output AI berkualitas dalam Bahasa Indonesia (diuji) |
| Observability | Logging konsumsi token & biaya per user/fitur |

---

## 12. Roadmap / Fase (Realistis untuk Bertahap)

> Meski target akhir full-feature, urutan ini menekan risiko biaya & kompleksitas: buktikan pipeline inti dulu sebelum format mahal (audio/video/YouTube).

| Fase | Cakupan |
|---|---|
| **M1 — Fondasi** | Auth, profil, upload **dokumen** (PDF/Office), ekstraksi teks, chunking + embedding (pgvector), job queue dasar |
| **M2 — AI Inti** | Ringkasan, flashcard, kuis PG, **AI Tutor (RAG)**; library materi; caching hasil |
| **M3 — Retensi & Gamifikasi** | Spaced repetition, XP/level/streak/leaderboard/badge, dashboard |
| **M4 — Monetisasi** | Free vs paid tier, quota & rate limit, RevenueCat/Midtrans, halaman pricing, monitoring biaya |
| **M5 — Format Lanjutan** | Audio → transkripsi; video → audio → transkripsi; YouTube; batasan durasi |
| **M6 — Polish & Rilis** | Notifikasi, error handling, aksesibilitas, i18n, QA, rilis Play Store (iOS menyusul) |

---

## 13. Metrik Sukses (KPI)

- **Aktivasi:** % user yang menyelesaikan 1 materi penuh (upload → hasil).
- **Retensi D1/D7/D30** dan **streak aktif**.
- **Konversi free → paid** (fokus keberlanjutan).
- **Biaya AI per user aktif** (harus di bawah ARPU).
- **Materi diproses per user** & fitur yang paling dipakai.
- **Sukses pemrosesan job** (< X% gagal).

---

## 14. Risiko & Mitigasi

| Risiko | Mitigasi |
|---|---|
| **Biaya AI meledak** | Quota per tier, rate limit, caching, batas ukuran input, monitoring token |
| **Halusinasi AI Tutor** | RAG ketat (jawab dari materi), sertakan rujukan, batasi klaim di luar konteks |
| **PDF scan/kompleks gagal ekstrak** | OCR fallback, deteksi & pesan error jelas |
| **Job panjang timeout** | Arsitektur asinkron + queue + retry |
| **Legal hak cipta materi** | ToS: tanggung jawab di user; batasi penggunaan komersial ulang |
| **Kualitas B.Indo model kurang** | Uji beberapa model; prompt tuning; pilih model terbaik untuk B.Indo |
| **Kompleksitas untuk solo dev** | Bangun bertahap (M1→); jangan kerjakan semua format sekaligus |
| **Kebijakan IAP Play Store** | Pahami komisi store vs gateway; pilih model billing sejak awal |

---

## 15. Lampiran — Konvensi

- **Bahasa kode & tipe:** TypeScript strict.
- **Struktur dokumentasi:** `docs/prd/` (konsisten dengan konvensi project lain).
- **Status job:** `queued | processing | completed | failed`.
- **Tier:** `free | pro` (perluas bila perlu).
- **Period key leaderboard/usage:** `weekly:2026-W27`, `monthly:2026-07`.
- **Source type materi:** `document | audio | video | youtube`.

---

_Draft v1. Ini produk AI SaaS berskala serius; detail tiap area besar (pipeline ingesti, RAG, billing) sebaiknya dipecah ke sub-PRD/technical design terpisah. Prioritas eksekusi: buktikan pipeline dokumen → ringkasan/kuis/tutor (M1–M2) sebelum menambah format audio/video/YouTube yang jauh lebih mahal & kompleks (M5)._
