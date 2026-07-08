"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Crown, Flame, Medal, Trophy, Zap } from "lucide-react";
import { LEADERBOARD, LEADERBOARD_PER_PAGE, LEADERBOARD_TOTAL } from "@/lib/mock-leaderboard";

type Metric = "xp" | "streak";

export default function LeaderboardPage() {
  const [metric, setMetric] = useState<Metric>("xp");
  const [page, setPage] = useState(1);

  const ranked = useMemo(
    () => [...LEADERBOARD].sort((a, b) => b[metric] - a[metric]),
    [metric],
  );
  const pages = Math.ceil(ranked.length / LEADERBOARD_PER_PAGE);
  const start = (page - 1) * LEADERBOARD_PER_PAGE;
  const rows = ranked.slice(start, start + LEADERBOARD_PER_PAGE);

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Trophy className="h-8 w-8 text-brand" />
          <div>
            <h1 className="text-3xl font-extrabold">Leaderboard</h1>
            <p className="text-sm text-muted">Top {LEADERBOARD_TOTAL} pelajar terbaik</p>
          </div>
        </div>
        <div className="flex rounded-2xl border border-ink-500/70 bg-ink-700/50 p-1">
          <Toggle active={metric === "xp"} onClick={() => setMetric("xp")}>
            <Zap className="h-4 w-4" /> Total XP
          </Toggle>
          <Toggle active={metric === "streak"} onClick={() => setMetric("streak")}>
            <Flame className="h-4 w-4" /> Streak
          </Toggle>
        </div>
      </header>

      <div className="grid gap-3 lg:grid-cols-2">
        {rows.map((row, i) => {
          const rank = start + i + 1;
          return (
            <div
              key={row.name}
              className={`flex items-center gap-4 rounded-2xl border px-4 py-3.5 ${
                rank <= 3 ? "border-brand/30 bg-brand/5" : "border-ink-500/60 bg-ink-700/40"
              }`}
            >
              <RankBadge rank={rank} />
              <Avatar name={row.name} color={row.color} />
              <div className="min-w-0 flex-1">
                <p className="truncate font-bold">{row.name}</p>
                <p className="text-xs text-muted">Level {row.level}</p>
              </div>
              <div className="flex items-center gap-1.5 font-extrabold text-brand">
                {metric === "xp" ? (
                  <>
                    <Zap className="h-4 w-4" />
                    {row.xp.toLocaleString("en-US")}
                  </>
                ) : (
                  <>
                    <Flame className="h-4 w-4" />
                    {row.streak} <span className="text-sm font-semibold text-muted">hari</span>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted">
          Menampilkan {rows.length} dari {LEADERBOARD_TOTAL}
        </p>
        <div className="flex items-center gap-3">
          <PageBtn disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>
            <ChevronLeft className="h-4 w-4" />
          </PageBtn>
          <span className="text-sm font-semibold">
            {page} / {pages}
          </span>
          <PageBtn disabled={page >= pages} onClick={() => setPage((p) => Math.min(pages, p + 1))}>
            <ChevronRight className="h-4 w-4" />
          </PageBtn>
        </div>
      </div>
    </div>
  );
}

function Toggle({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-semibold transition ${
        active ? "bg-brand text-white" : "text-muted hover:text-white"
      }`}
    >
      {children}
    </button>
  );
}

function RankBadge({ rank }: { rank: number }) {
  if (rank === 1) return <Crown className="h-6 w-6 shrink-0 text-yellow-400" />;
  if (rank === 2) return <Medal className="h-6 w-6 shrink-0 text-slate-300" />;
  if (rank === 3) return <Medal className="h-6 w-6 shrink-0 text-orange-400" />;
  return <span className="w-6 shrink-0 text-center text-sm font-bold text-muted">{rank}</span>;
}

function Avatar({ name, color }: { name: string; color: string }) {
  return (
    <span
      className={`grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gradient-to-br ${color} text-sm font-bold text-white`}
    >
      {name.charAt(0).toUpperCase()}
    </span>
  );
}

function PageBtn({
  disabled,
  onClick,
  children,
}: {
  disabled: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className="grid h-9 w-9 place-items-center rounded-full border border-ink-500 text-muted transition enabled:hover:text-white disabled:opacity-30"
    >
      {children}
    </button>
  );
}
