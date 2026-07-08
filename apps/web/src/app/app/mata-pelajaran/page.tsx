import { Folder } from "lucide-react";
import { SectionPlaceholder } from "@/components/app/section-placeholder";

export default function MataPelajaranPage() {
  return (
    <SectionPlaceholder
      title="Mata Pelajaran"
      subtitle="Kelola daftar mata pelajaran untuk mengorganisir catatan Anda"
      icon={Folder}
      milestone="W3+"
    />
  );
}
