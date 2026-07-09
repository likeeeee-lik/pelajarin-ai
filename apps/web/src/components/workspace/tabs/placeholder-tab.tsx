import type { LucideIcon } from "lucide-react";

export function PlaceholderTab({ label, icon: Icon }: { label: string; icon: LucideIcon }) {
  return (
    <div className="card grid min-h-[60vh] place-items-center p-12 text-center">
      <div>
        <span className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-brand/15 text-brand">
          <Icon className="h-8 w-8" />
        </span>
        <h2 className="mt-6 text-2xl font-extrabold">{label}</h2>
        <p className="mx-auto mt-2 max-w-sm text-muted">
          Fitur ini akan segera aktif di workspace. Endpoint AI-nya sudah siap di backend.
        </p>
      </div>
    </div>
  );
}
