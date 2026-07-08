import {
  Calendar,
  CheckCircle2,
  Flame,
  Lightbulb,
  Trophy,
  Zap,
} from "lucide-react";
import { MOCK_USER } from "@/lib/mock-user";

export default function StreaksPage() {
  const u = MOCK_USER;
  const xpPct = u.xpToNext > 0 ? Math.min(100, (u.xp / u.xpToNext) * 100) : 0;

  return (
    <div className="flex flex-col gap-6">
      <header className="flex items-center gap-3">
        <Flame className="h-8 w-8 text-brand" />
        <div>
          <h1 className="text-3xl font-extrabold">Streak &amp; Progres</h1>
          <p className="text-sm text-muted">Pantau konsistensi belajarmu</p>
        </div>
      </header>

      {/* 3 kartu besar */}
      <div className="grid gap-4 md:grid-cols-3">
        <BigCard
          label="Streak Saat Ini"
          value={`${u.streakCurrent} hari`}
          sub="Mulai belajar hari ini!"
          icon={<Flame className="h-6 w-6 text-brand" />}
          iconBg="bg-brand/20"
          highlight
        />
        <BigCard
          label="Streak Terpanjang"
          value={`${u.streakBest} hari`}
          sub="Rekor terbaikmu"
          icon={<Trophy className="h-6 w-6 text-yellow-400" />}
          iconBg="bg-yellow-400/15"
        />
        <BigCard
          label="Level"
          value={String(u.level)}
          sub={`${u.xp} / ${u.xpToNext} XP`}
          icon={<Zap className="h-6 w-6 text-white" />}
          iconBg="bg-brand"
          progress={xpPct}
        />
      </div>

      {/* 4 kartu kecil */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <MiniCard label="Total XP" value={u.xp} icon={<Zap className="h-5 w-5 text-brand" />} iconBg="bg-brand/15" />
        <MiniCard label="Flashcard Direview" value={u.flashcardDireview} icon={<Calendar className="h-5 w-5 text-sky-400" />} iconBg="bg-sky-400/15" />
        <MiniCard label="Kuis Lulus" value={u.kuisLulus} icon={<CheckCircle2 className="h-5 w-5 text-emerald-400" />} iconBg="bg-emerald-400/15" />
        <MiniCard label="Kuis Sempurna" value={u.kuisSempurna} icon={<Trophy className="h-5 w-5 text-purple-400" />} iconBg="bg-purple-400/15" />
      </div>

      {/* Tips */}
      <div className="rounded-xl2 border border-brand/30 bg-gradient-to-br from-brand/10 to-purple-500/5 p-6">
        <h2 className="flex items-center gap-2 font-bold text-brand">
          <Lightbulb className="h-5 w-5" /> Tips Menjaga Streak
        </h2>
        <ul className="mt-3 space-y-2 text-sm text-white/90">
          <li>• Review minimal 1 flashcard setiap hari</li>
          <li>• Atau selesaikan 1 kuis untuk menjaga streak</li>
          <li>• Streak akan reset jika tidak ada aktivitas dalam 1 hari</li>
        </ul>
      </div>
    </div>
  );
}

function BigCard({
  label,
  value,
  sub,
  icon,
  iconBg,
  progress,
  highlight,
}: {
  label: string;
  value: string;
  sub: string;
  icon: React.ReactNode;
  iconBg: string;
  progress?: number;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-xl2 border p-5 ${
        highlight ? "border-brand/40 bg-brand/10" : "border-ink-500/70 bg-ink-600/60"
      }`}
    >
      <div className="flex items-start justify-between">
        <span className="text-sm text-muted">{label}</span>
        <span className={`grid h-11 w-11 place-items-center rounded-full ${iconBg}`}>{icon}</span>
      </div>
      <p className="mt-3 text-3xl font-extrabold">{value}</p>
      {progress !== undefined ? (
        <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-ink-500/60">
          <div className="h-full rounded-full bg-brand" style={{ width: `${progress}%` }} />
        </div>
      ) : null}
      <p className="mt-2 text-sm text-muted">{sub}</p>
    </div>
  );
}

function MiniCard({
  label,
  value,
  icon,
  iconBg,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  iconBg: string;
}) {
  return (
    <div className="card p-5">
      <span className={`grid h-9 w-9 place-items-center rounded-xl ${iconBg}`}>{icon}</span>
      <p className="mt-3 text-2xl font-extrabold">{value}</p>
      <p className="text-xs text-muted">{label}</p>
    </div>
  );
}
