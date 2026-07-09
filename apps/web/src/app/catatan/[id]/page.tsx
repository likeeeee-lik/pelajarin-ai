"use client";

import { useParams } from "next/navigation";
import { NoteWorkspace } from "@/components/workspace/note-workspace";

export default function CatatanPage() {
  const params = useParams<{ id: string }>();
  return <NoteWorkspace id={params.id} />;
}
