"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { materialsApi } from "@/lib/api/resources";
import type { MaterialType } from "@/lib/api/types";
import { CreateBar } from "./create-bar";
import { StartEmpty } from "./start-empty";
import { Collection } from "./collection";
import { CreateMaterialModal } from "./create-material-modal";

/** Bagian interaktif dashboard: buat materi + koleksi (dari API). */
export function DashboardClient() {
  const [source, setSource] = useState<MaterialType | null>(null);
  const materials = useQuery({ queryKey: ["materials"], queryFn: materialsApi.list });

  return (
    <div className="flex flex-col gap-6">
      <CreateBar onPick={setSource} />

      {materials.isLoading ? (
        <div className="card grid place-items-center p-12 text-muted">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      ) : materials.isError ? (
        <div className="card p-8 text-center text-sm text-muted">
          Gagal memuat koleksi. Pastikan server API berjalan (<code>pnpm dev:api</code>).
        </div>
      ) : materials.data && materials.data.length > 0 ? (
        <Collection materials={materials.data} />
      ) : (
        <StartEmpty onPick={setSource} />
      )}

      {source ? <CreateMaterialModal source={source} onClose={() => setSource(null)} /> : null}
    </div>
  );
}
