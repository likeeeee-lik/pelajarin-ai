const MONTHS = ["Jul", "Agu", "Sep", "Okt", "Nov", "Des", "Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul"];
const WEEKS = 53;
const DAYS = 7;

/** Heatmap kontribusi ala GitHub (statis, 0 aktivitas). */
export function ActivityHeatmap({ totalAktivitas = 0 }: { totalAktivitas?: number }) {
  return (
    <div className="card p-6">
      <h2 className="font-bold">
        {totalAktivitas} Aktivitas <span className="font-normal text-muted">di tahun lalu</span>
      </h2>

      <div className="mt-4 overflow-x-auto">
        <div className="min-w-[720px]">
          {/* label bulan */}
          <div className="mb-1 flex justify-between px-1 text-[11px] text-muted">
            {MONTHS.map((m, i) => (
              <span key={`${m}-${i}`}>{m}</span>
            ))}
          </div>
          {/* grid: kolom = minggu, baris = hari */}
          <div className="flex gap-[3px]">
            {Array.from({ length: WEEKS }).map((_, w) => (
              <div key={w} className="flex flex-col gap-[3px]">
                {Array.from({ length: DAYS }).map((_, d) => (
                  <span key={d} className="h-2.5 w-2.5 rounded-[3px] bg-ink-500/50" />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* legenda */}
      <div className="mt-3 flex items-center justify-end gap-2 text-xs text-muted">
        <span>Kurang</span>
        <span className="h-2.5 w-2.5 rounded-[3px] bg-ink-500/50" />
        <span className="h-2.5 w-2.5 rounded-[3px] bg-brand/30" />
        <span className="h-2.5 w-2.5 rounded-[3px] bg-brand/60" />
        <span className="h-2.5 w-2.5 rounded-[3px] bg-brand" />
        <span>Lebih</span>
      </div>
    </div>
  );
}
