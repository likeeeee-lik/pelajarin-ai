import type { LucideIcon } from "lucide-react";

/** Placeholder halaman section yang belum dibangun (biar nav berfungsi). */
export function SectionPlaceholder({
  title,
  subtitle,
  icon: Icon,
  milestone,
}: {
  title: string;
  subtitle: string;
  icon: LucideIcon;
  milestone: string;
}) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <span className="grid h-11 w-11 place-items-center rounded-xl bg-brand/15 text-brand">
          <Icon className="h-6 w-6" />
        </span>
        <div>
          <h1 className="text-2xl font-extrabold">{title}</h1>
          <p className="text-sm text-muted">{subtitle}</p>
        </div>
      </div>
      <div className="card grid place-items-center p-12 text-center">
        <Icon className="h-10 w-10 text-muted" />
        <p className="mt-4 font-semibold">Halaman ini sedang dibangun</p>
        <p className="mt-1 text-sm text-muted">Dijadwalkan pada tahap {milestone}.</p>
      </div>
    </div>
  );
}
