import { FileSearch } from "lucide-react";
import { SectionPlaceholder } from "@/components/app/section-placeholder";

export default function LatihanSoalPage() {
  return (
    <SectionPlaceholder
      title="Prediksi Soal Ujian"
      subtitle="Upload soal ujian sebelumnya dan dapatkan prediksi soal berikutnya"
      icon={FileSearch}
      milestone="W6"
    />
  );
}
