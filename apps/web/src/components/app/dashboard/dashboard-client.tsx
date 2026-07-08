"use client";

import { useState } from "react";
import { useMaterials, type MaterialType } from "@/lib/store";
import { CreateBar } from "./create-bar";
import { StartEmpty } from "./start-empty";
import { Collection } from "./collection";
import { CreateMaterialModal } from "./create-material-modal";

/** Bagian interaktif dashboard: buat materi + koleksi. */
export function DashboardClient() {
  const materials = useMaterials();
  const [source, setSource] = useState<MaterialType | null>(null);

  return (
    <div className="flex flex-col gap-6">
      <CreateBar onPick={setSource} />
      {materials.length > 0 ? <Collection /> : <StartEmpty onPick={setSource} />}
      {source ? <CreateMaterialModal source={source} onClose={() => setSource(null)} /> : null}
    </div>
  );
}
