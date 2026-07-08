import { Greeting } from "@/components/app/dashboard/greeting";
import { StatCards } from "@/components/app/dashboard/stat-cards";
import { DashboardClient } from "@/components/app/dashboard/dashboard-client";

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <Greeting />
      <StatCards />
      <DashboardClient />
    </div>
  );
}
