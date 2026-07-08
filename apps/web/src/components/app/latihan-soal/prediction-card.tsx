import { FileText, Sparkles } from "lucide-react";
import type { Prediction } from "./create-modal";

const TIPE_LABEL: Record<Prediction["tipe"], string> = {
  uts: "UTS",
  uas: "UAS",
  kuis: "Kuis",
  latihan: "Latihan",
};

export function PredictionCard({ item }: { item: Prediction }) {
  return (
    <div className="card p-5">
      <div className="flex items-center justify-between">
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand/15 text-brand">
          <Sparkles className="h-5 w-5" />
        </span>
        <span className="rounded-full border border-ink-500 px-2.5 py-0.5 text-xs font-semibold text-muted">
          {TIPE_LABEL[item.tipe]}
        </span>
      </div>
      <h3 className="mt-3 truncate font-bold">{item.judul}</h3>
      <p className="text-sm text-muted">{item.mapel}</p>
      <p className="mt-3 flex items-center gap-1.5 text-xs text-muted">
        <FileText className="h-3.5 w-3.5" /> {item.fileCount} file diproses
      </p>
    </div>
  );
}
