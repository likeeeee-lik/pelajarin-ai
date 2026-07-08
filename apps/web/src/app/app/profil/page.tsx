import { UserCog } from "lucide-react";
import { SectionPlaceholder } from "@/components/app/section-placeholder";

export default function ProfilPage() {
  return (
    <SectionPlaceholder
      title="Profil Pengguna"
      subtitle="Kelola informasi dan preferensi akun Anda"
      icon={UserCog}
      milestone="W8"
    />
  );
}
