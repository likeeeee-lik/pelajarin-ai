import { Trophy } from "lucide-react";
import { SectionPlaceholder } from "@/components/app/section-placeholder";

export default function LeaderboardPage() {
  return (
    <SectionPlaceholder
      title="Leaderboard"
      subtitle="Top 50 pelajar terbaik"
      icon={Trophy}
      milestone="W4"
    />
  );
}
