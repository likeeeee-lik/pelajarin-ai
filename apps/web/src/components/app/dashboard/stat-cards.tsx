import { Flame, Layers, Medal, Trophy } from "lucide-react";
import { MOCK_USER } from "@/lib/mock-user";

/** 4 kartu ringkasan di dashboard. */
export function StatCards() {
  const u = MOCK_USER;
  const xpPct = u.xpToNext > 0 ? Math.min(100, (u.xp / u.xpToNext) * 100) : 0;

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      <Card
        label="Kartu Hari Ini"
        value={String(u.kartuHariIni)}
        sub="Selesai!"
        icon={<Layers className="h-5 w-5 text-brand" />}
        iconBg="bg-brand/15"
      />
      <Card
        label="Streak"
        value={`${u.streakCurrent} hari`}
        sub={`Terbaik: ${u.streakBest}`}
        icon={<Flame className="h-5 w-5 text-orange-400" />}
        iconBg="bg-orange-400/15"
      />
      <Card
        label="Level"
        value={`Lvl ${u.level}`}
        sub={`${u.xp} XP`}
        icon={<Trophy className="h-5 w-5 text-purple-400" />}
        iconBg="bg-purple-400/15"
        progress={xpPct}
      />
      <Card
        label="Peringkat"
        value={u.ranking ? `#${u.ranking}` : "#0"}
        sub="Pengguna Teratas"
        icon={<Medal className="h-5 w-5 text-emerald-400" />}
        iconBg="bg-emerald-400/15"
      />
    </div>
  );
}

function Card({
  label,
  value,
  sub,
  icon,
  iconBg,
  progress,
}: {
  label: string;
  value: string;
  sub: string;
  icon: React.ReactNode;
  iconBg: string;
  progress?: number;
}) {
  return (
    <div className="card p-5">
      <div className="flex items-start justify-between">
        <span className="text-sm text-muted">{label}</span>
        <span className={`grid h-9 w-9 place-items-center rounded-xl ${iconBg}`}>{icon}</span>
      </div>
      <p className="mt-3 text-2xl font-extrabold">{value}</p>
      {progress !== undefined ? (
        <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-ink-500/60">
          <div className="h-full rounded-full bg-brand" style={{ width: `${progress}%` }} />
        </div>
      ) : null}
      <p className="mt-2 text-xs text-muted">{sub}</p>
    </div>
  );
}
