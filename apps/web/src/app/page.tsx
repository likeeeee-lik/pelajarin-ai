import Link from "next/link";
import {
  Brain,
  ClipboardCheck,
  FileText,
  GraduationCap,
  Layers,
  MessageCircle,
  Mic,
  Upload,
  Video,
  Youtube,
  type LucideIcon,
} from "lucide-react";
import { MarketingNavbar } from "@/components/marketing/navbar";
import { MarketingFooter } from "@/components/marketing/footer";

const FEATURES: { icon: LucideIcon; title: string; desc: string }[] = [
  { icon: FileText, title: "Ringkasan Otomatis", desc: "Ubah dokumen ratusan halaman jadi poin penting yang mudah dipahami." },
  { icon: MessageCircle, title: "Tutor AI 24/7", desc: "Tanyakan apa saja tentang materi. AI siap menjelaskan konsep sulit kapan pun." },
  { icon: Layers, title: "Smart Flashcards", desc: "Hafalan jadi efektif dengan metode spaced repetition otomatis." },
  { icon: ClipboardCheck, title: "Kuis Interaktif", desc: "Uji pemahaman dengan kuis yang di-generate langsung dari materimu." },
];

const STEPS: { icon: LucideIcon; title: string; desc: string }[] = [
  { icon: Upload, title: "1. Upload Materi", desc: "File, audio, video, atau link YouTube." },
  { icon: Brain, title: "2. AI Merapikan", desc: "AI ubah jadi catatan, flashcard, dan kuis." },
  { icon: GraduationCap, title: "3. Belajar Cepat", desc: "Kuasai materi dalam waktu yang jauh lebih singkat." },
];

const STATS = [
  { value: "462k+", label: "Pengguna aktif" },
  { value: "1.1M+", label: "Catatan dibuat" },
  { value: "3.5/5", label: "Rating pengguna" },
  { value: "0.7k+", label: "Sekolah & kampus" },
];

const FORMATS: { icon: LucideIcon; title: string; desc: string; color: string }[] = [
  { icon: FileText, title: "Dokumen", desc: "PDF, DOCX, PPT", color: "text-sky-400 bg-sky-400/15" },
  { icon: Mic, title: "Audio", desc: "MP3, WAV", color: "text-emerald-400 bg-emerald-400/15" },
  { icon: Video, title: "Video", desc: "MP4, MOV", color: "text-purple-400 bg-purple-400/15" },
  { icon: Youtube, title: "YouTube", desc: "Tempel link", color: "text-red-400 bg-red-400/15" },
];

const FAQ = [
  { q: "Apa itu Pelajarin.ai?", a: "Platform belajar berbasis AI yang mengubah materi apa pun (file, audio, video, YouTube) menjadi catatan rapi, flashcard, kuis, dan prediksi soal ujian." },
  { q: "Format file apa saja yang didukung?", a: "Dokumen (PDF, DOCX, PPT), audio (MP3, WAV), video (MP4, MOV), serta tautan YouTube." },
  { q: "Apakah gratis?", a: "Ya, ada paket Free untuk mulai. Untuk fitur tanpa batas, tersedia paket Pro mulai Rp 30.000/bulan." },
  { q: "Berapa lama proses generate catatan?", a: "Umumnya hanya beberapa detik hingga menit, tergantung ukuran materi." },
  { q: "Apakah data saya aman?", a: "Materimu diproses secara privat dan tidak dibagikan. Kamu memegang kendali penuh atas datamu." },
];

export default function LandingPage() {
  return (
    <div className="bg-ink-900">
      <MarketingNavbar />

      {/* Hero */}
      <section id="cara-kerja" className="bg-aurora">
        <div className="mx-auto max-w-3xl px-5 py-24 text-center">
          <h1 className="text-4xl font-extrabold leading-tight sm:text-6xl">
            Ubah 6 Jam Belajar
            <br />
            Jadi <span className="text-brand">1 Jam</span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-muted">
            Transformasi cara belajarmu dengan AI. Upload materi apapun, dapatkan
            ringkasan, flashcard, dan kuis dalam sekejap.
          </p>
          <Link
            href="/onboarding"
            className="mt-8 inline-flex rounded-2xl bg-brand px-8 py-4 font-bold text-white shadow-brand transition hover:bg-brand-600"
          >
            Mulai Gratis Sekarang →
          </Link>
        </div>
      </section>

      {/* Cara kerja */}
      <Section>
        <SectionTitle kicker="CARA KERJA" title="Semudah 3 Langkah" />
        <div className="grid gap-6 md:grid-cols-3">
          {STEPS.map((s) => (
            <div key={s.title} className="card p-6 text-center">
              <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-brand/15 text-brand">
                <s.icon className="h-6 w-6" />
              </span>
              <h3 className="mt-4 font-bold">{s.title}</h3>
              <p className="mt-1 text-sm text-muted">{s.desc}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Fitur */}
      <Section id="fitur">
        <SectionTitle kicker="FITUR UNGGULAN" title="Semua yang Kamu Butuhkan" />
        <div className="grid gap-6 sm:grid-cols-2">
          {FEATURES.map((f) => (
            <div key={f.title} className="card flex gap-4 p-6">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brand/15 text-brand">
                <f.icon className="h-5 w-5" />
              </span>
              <div>
                <h3 className="font-bold">{f.title}</h3>
                <p className="mt-1 text-sm text-muted">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Stats */}
      <Section>
        <SectionTitle title="Mereka Sudah Membuktikannya" />
        <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
          {STATS.map((s) => (
            <div key={s.label} className="card p-6 text-center">
              <p className="text-3xl font-extrabold text-brand">{s.value}</p>
              <p className="mt-1 text-sm text-muted">{s.label}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Format */}
      <Section>
        <SectionTitle title="Support Berbagai Format" />
        <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
          {FORMATS.map((f) => (
            <div key={f.title} className="card p-6 text-center">
              <span className={`mx-auto grid h-12 w-12 place-items-center rounded-2xl ${f.color}`}>
                <f.icon className="h-6 w-6" />
              </span>
              <h3 className="mt-3 font-bold">{f.title}</h3>
              <p className="text-sm text-muted">{f.desc}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* FAQ */}
      <Section id="faq">
        <SectionTitle kicker="FAQ" title="Pertanyaan Umum" />
        <div className="mx-auto flex max-w-2xl flex-col gap-3">
          {FAQ.map((item) => (
            <details key={item.q} className="card group p-5">
              <summary className="flex cursor-pointer list-none items-center justify-between font-semibold">
                {item.q}
                <span className="text-muted transition group-open:rotate-45">+</span>
              </summary>
              <p className="mt-3 text-sm text-muted">{item.a}</p>
            </details>
          ))}
        </div>
      </Section>

      {/* CTA */}
      <Section>
        <div className="mx-auto max-w-2xl rounded-xl2 border border-brand/40 bg-brand/10 p-10 text-center">
          <h2 className="text-3xl font-extrabold">Siap Revolusi Cara Belajarmu?</h2>
          <p className="mt-2 text-muted">Gabung dengan ribuan siswa cerdas lainnya. Mulai gratis.</p>
          <Link
            href="/onboarding"
            className="mt-6 inline-flex rounded-2xl bg-brand px-8 py-4 font-bold text-white shadow-brand transition hover:bg-brand-600"
          >
            Mulai Gratis Sekarang
          </Link>
        </div>
      </Section>

      <MarketingFooter />
    </div>
  );
}

function Section({ id, children }: { id?: string; children: React.ReactNode }) {
  return (
    <section id={id} className="mx-auto max-w-6xl px-5 py-16">
      {children}
    </section>
  );
}

function SectionTitle({ kicker, title }: { kicker?: string; title: string }) {
  return (
    <div className="mb-10 text-center">
      {kicker ? (
        <p className="text-sm font-bold tracking-widest text-brand">{kicker}</p>
      ) : null}
      <h2 className="mt-1 text-3xl font-extrabold">{title}</h2>
    </div>
  );
}
