import { Rocket } from "lucide-react";
import { SectionPlaceholder } from "@/components/app/section-placeholder";

export default function UpgradePage() {
  return (
    <SectionPlaceholder
      title="Tingkatkan ke Pro"
      subtitle="Unlimited catatan, chat AI, dan prediksi ujian"
      icon={Rocket}
      milestone="W8"
    />
  );
}
